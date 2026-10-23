// Tests for the gather script. Plain Node: node scripts/test-gather.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkEvidence } from '../.claude/skills/readme-architect/scripts/check-readme.mjs';
import { detectKind, gather } from '../.claude/skills/readme-architect/scripts/gather.mjs';

const top = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = path.join(top, '.claude', 'skills', 'readme-architect', 'scripts');
const fixture = path.join(top, 'test-fixtures', 'sample-repo');

function withRepo(files, fn) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'readme-architect-test-'));
  try {
    for (const [rel, content] of Object.entries(files)) {
      const abs = path.join(dir, rel);
      mkdirSync(path.dirname(abs), { recursive: true });
      writeFileSync(abs, content);
    }
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('ok   ' + name);
  } catch (e) {
    console.log('FAIL ' + name + '\n     ' + e.message.split('\n')[0]);
    process.exitCode = 1;
  }
}

const fakeToken = 'ghp_' + 'a'.repeat(36);

test('fixture repo: web-app, three files, two entry files, no skipped files', () => {
  const g = gather(fixture);
  assert.equal(g.kind, 'web-app');
  assert.equal(g.templateFile, 'web-app.md');
  assert.deepEqual(g.files.map((f) => f.path), ['index.html', 'main.js', 'package.json']);
  assert.deepEqual(g.entryFiles.map((f) => f.path), ['index.html', 'main.js']);
  assert.equal(g.packageJson.scripts.dev, 'vite');
  assert.equal(g.readme, null);
  assert.deepEqual(g.skipped, []);
});

test('secrets and ignored files are left out, and their contents never appear', () => {
  withRepo(
    {
      '.env': 'MARKER_ENV_CONTENT_9f3a',
      '.env.example': 'API_URL=http://localhost',
      'key.pem': 'MARKER_PEM_CONTENT',
      'node_modules/x/a.js': 'MARKER_NODE_MODULES',
      '.gitignore': 'dist/\nsongs/\n*.log\n!keep.log\n# a comment\n',
      'dist/out.js': 'MARKER_DIST',
      'songs/a.mid': 'MARKER_SONG',
      'debug.log': 'MARKER_LOG',
      'package.json': '{"name":"t","main":"src/main.js","scripts":{"start":"node src/main.js"}}',
      'src/main.js': `const k = "${fakeToken}";\nconsole.log(1);\n`,
    },
    (dir) => {
      const g = gather(dir);
      assert.deepEqual(g.files.map((f) => f.path), ['.env.example', '.gitignore', 'package.json', 'src/main.js']);
      const why = (p) => g.skipped.find((s) => s.path === p)?.reason;
      assert.equal(why('.env'), 'secret-path');
      assert.equal(why('key.pem'), 'secret-path');
      assert.equal(why('node_modules/'), 'skipped-folder');
      assert.equal(why('dist/'), 'ignored');
      assert.equal(why('songs/'), 'ignored');
      assert.equal(why('debug.log'), 'ignored');
      assert.equal(why('src/main.js'), 'looks-like-secret');
      assert.deepEqual(g.entryFiles, []);
      assert.deepEqual(g.gitignore, { rules: 3, unsupportedLines: 1 });
      const out = JSON.stringify(g);
      assert.equal(out.includes('MARKER_'), false);
      assert.equal(out.includes(fakeToken), false);
    },
  );
});

test('a secret inside package.json scripts withholds the whole summary', () => {
  const value = 'z'.repeat(20);
  withRepo({ 'package.json': `{"name":"x","scripts":{"deploy":"curl -H token=${value}"}}` }, (dir) => {
    const g = gather(dir);
    assert.deepEqual(g.packageJson, { withheld: 'looks-like-secret' });
    assert.equal(JSON.stringify(g).includes(value), false);
  });
});

test('kind: static site, claude skill, library, unknown, and index.html wins over a skill', () => {
  withRepo({ 'index.html': '<title>x</title>' }, (d) => assert.equal(gather(d).kind, 'static-site'));
  withRepo({ '.claude/skills/foo/SKILL.md': '---\nname: foo\n---\n' }, (d) => assert.equal(gather(d).kind, 'claude-skill'));
  withRepo({ 'package.json': '{"bin":{"x":"cli.js"}}', 'cli.js': 'console.log("hi")' }, (d) => {
    const g = gather(d);
    assert.equal(g.kind, 'library-cli');
    assert.deepEqual(g.entryFiles.map((f) => f.path), ['cli.js']);
  });
  withRepo({ 'README.md': '# x' }, (d) => {
    const g = gather(d);
    assert.equal(g.kind, 'unknown');
    assert.equal(g.templateFile, null);
  });
  withRepo({ 'index.html': 'x', 'package.json': '{}', '.claude/skills/foo/SKILL.md': 'x' }, (d) => assert.equal(gather(d).kind, 'web-app'));
});

test('detectKind alone: package.json without index.html or bin/main is unknown', () => {
  assert.equal(detectKind(['package.json'], {}).kind, 'unknown');
});

test('invalid package.json is reported, not crashed on', () => {
  withRepo({ 'package.json': '{ nope' }, (dir) => {
    const g = gather(dir);
    assert.equal(g.packageJson, null);
    assert.match(g.packageJsonError, /not valid JSON/);
  });
});

test('a long entry file is cut at 20000 characters', () => {
  withRepo({ 'main.js': 'x'.repeat(25000) }, (dir) => {
    const text = gather(dir).entryFiles[0].text;
    assert.equal(text.endsWith('[truncated]'), true);
    assert.equal(text.length <= 20000 + 20, true);
  });
});

test('readme and license files are found at the top level only', () => {
  withRepo({ 'README.md': '# x', LICENSE: 'MIT', 'docs/LICENSE.txt': 'x' }, (dir) => {
    const g = gather(dir);
    assert.equal(g.readme, 'README.md');
    assert.deepEqual(g.licenseFiles, ['LICENSE']);
  });
});

test('cli: prints JSON for a repo, exits 2 without --repo or for a missing folder', () => {
  const run = (...a) => spawnSync(process.execPath, [path.join(skillDir, 'gather.mjs'), ...a], { encoding: 'utf8' });
  const ok = run('--repo', fixture);
  assert.equal(ok.status, 0);
  assert.equal(JSON.parse(ok.stdout).kind, 'web-app');
  assert.equal(run().status, 2);
  assert.equal(run('--repo', path.join(fixture, 'no-such-folder')).status, 2);
});

test('cli: --out writes the JSON to a new folder and prints one summary line', () => {
  withRepo({ 'README.md': '# t' }, (dir) => {
    const out = path.join(dir, 'nested', 'out', 'gather.json');
    const r = spawnSync(process.execPath, [path.join(skillDir, 'gather.mjs'), '--repo', fixture, '--out', out], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stdout);
    assert.match(r.stdout, /^Wrote .*gather\.json: kind web-app, template web-app\.md, 3 files, 2 entry files, 0 skipped, README null\n$/);
    assert.equal(JSON.parse(readFileSync(out, 'utf8')).kind, 'web-app');
  });
});

test('gather gap: a real file that gather did not list is reported as not-in-gather-list', () => {
  withRepo({ '.gitignore': 'notes.txt\n', 'notes.txt': 'a note line here', 'main.js': 'console.log(1);' }, (dir) => {
    const g = gather(dir);
    const listed = new Set(g.files.map((f) => f.path));
    assert.equal(checkEvidence(dir, { file: 'notes.txt', quote: 'a note line' }).ok, true);
    assert.equal(checkEvidence(dir, { file: 'notes.txt', quote: 'a note line' }, listed).code, 'not-in-gather-list');
    assert.equal(checkEvidence(dir, { file: 'main.js', quote: 'console.log(1)' }, listed).ok, true);
  });
});

test('cli: --gathered tags a gather gap as a gather or process problem, not a model problem', () => {
  withRepo(
    {
      '.gitignore': 'notes.txt\n',
      'notes.txt': 'a note line here',
      'main.js': 'console.log(1);',
      'README.md': '# t\n\nIt prints a note.\n',
      'claims.json': JSON.stringify({ claims: [{ text: 'It prints a note.', evidence: [{ file: 'notes.txt', quote: 'a note line' }] }] }),
    },
    (dir) => {
      const g = gather(dir);
      writeFileSync(path.join(dir, 'gathered.json'), JSON.stringify(g));
      const r = spawnSync(
        process.execPath,
        [path.join(skillDir, 'check-readme.mjs'), '--repo', dir, '--readme', path.join(dir, 'README.md'), '--claims', path.join(dir, 'claims.json'), '--gathered', path.join(dir, 'gathered.json')],
        { encoding: 'utf8' },
      );
      assert.equal(r.status, 1);
      assert.match(r.stdout, /\[gather script or process\] not-in-gather-list/);
    },
  );
});

console.log(`\n${passed} passed${process.exitCode ? ', some FAILED' : ''}`);
