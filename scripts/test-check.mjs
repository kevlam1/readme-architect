// Tests for the README checker. Plain Node: node scripts/test-check.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkClaims, checkCommands, checkEvidence, checkStructure, isSecretPath, parseMarkdown, scanSecrets,
} from '../.claude/skills/readme-architect/scripts/check-readme.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const top = path.join(here, '..');
const repo = path.join(top, 'test-fixtures', 'sample-repo');
const readme = (n) => readFileSync(path.join(top, 'test-fixtures', 'readmes', n), 'utf8');
const claimsFile = (n) => path.join(top, 'test-fixtures', 'claims', n);
const readmeFile = (n) => path.join(top, 'test-fixtures', 'readmes', n);
const claims = (n) => JSON.parse(readFileSync(claimsFile(n), 'utf8'));
const templateFile = path.join(top, 'test-fixtures', 'templates', 'web-app.md'); // a copy, so editing the real templates can't break the tests
const template = readFileSync(templateFile, 'utf8');
const script = path.join(top, '.claude', 'skills', 'readme-architect', 'scripts', 'check-readme.mjs');
const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

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

test('secret paths are recognised, example env files are not', () => {
  for (const p of ['.env', '.env.local', 'config/server.pem', 'a/id_rsa', 'node_modules/x/index.js', 'x.key']) {
    assert.equal(isSecretPath(p), true, p);
  }
  for (const p of ['.env.example', 'src/main.js', 'package.json', 'keyboard.js']) assert.equal(isSecretPath(p), false, p);
});

test('evidence: a real quote passes', () => {
  assert.equal(checkEvidence(repo, { file: 'package.json', quote: '"dev": "vite"' }).ok, true);
});

test('evidence: whitespace differences are ignored', () => {
  assert.equal(checkEvidence(repo, { file: 'main.js', quote: 'const   KEY =\n  \'sample-todos\';' }).ok, true);
});

test('evidence: a made-up quote is quote-not-found', () => {
  assert.equal(checkEvidence(repo, { file: 'package.json', quote: '"webpack": "^5.0.0"' }).code, 'quote-not-found');
});

test('evidence: a missing file is file-missing', () => {
  assert.equal(checkEvidence(repo, { file: 'scripts/seed.mjs', quote: 'export function seed()' }).code, 'file-missing');
});

test('evidence: a path that leaves the repo is rejected', () => {
  assert.equal(checkEvidence(repo, { file: '../../CLAUDE.md', quote: 'temporaryname' }).code, 'outside-repo');
});

test('evidence: a secret file is refused even if it does not exist', () => {
  assert.equal(checkEvidence(repo, { file: '.env', quote: 'anything here' }).code, 'secret-file');
});

test('evidence: a very short quote proves nothing', () => {
  assert.equal(checkEvidence(repo, { file: 'package.json', quote: 'a' }).code, 'quote-too-short');
});

test('evidence: wrong letter case on the file name is not accepted', () => {
  const r = checkEvidence(repo, { file: 'Package.json', quote: '"dev": "vite"' });
  assert.equal(r.ok, false);
  assert.ok(['case-mismatch', 'file-missing'].includes(r.code), r.code);
});

test('evidence: malformed items are reported, not crashed on', () => {
  assert.equal(checkEvidence(repo, { file: 'package.json' }).code, 'malformed');
  assert.equal(checkEvidence(repo, null).code, 'malformed');
});

test('claims: the good report has 3 supported claims', () => {
  const r = checkClaims(repo, claims('good.json')).results;
  assert.deepEqual(r.map((x) => x.status), ['supported', 'supported', 'supported']);
});

test('claims: the bad report has 2 supported, 1 unsupported, 2 bad evidence', () => {
  const r = checkClaims(repo, claims('bad.json')).results;
  assert.deepEqual(r.map((x) => x.status), ['supported', 'unsupported', 'bad-evidence', 'bad-evidence', 'supported']);
  assert.equal(r[2].problems[0].code, 'quote-not-found');
  assert.equal(r[3].problems[0].code, 'file-missing');
});

function withDir(files, fn) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'readme-architect-test-'));
  try {
    for (const [rel, content] of Object.entries(files)) writeFileSync(path.join(dir, rel), content);
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('claims: evidence only in a notes file is notes-only, code evidence wins when both are cited', () => {
  withDir({ 'NOTES.md': 'The tool is fast and cheap to run.', 'main.js': 'export const speed = "fast";' }, (dir) => {
    const r = checkClaims(dir, {
      claims: [
        { text: 'a', evidence: [{ file: 'NOTES.md', quote: 'fast and cheap' }] },
        { text: 'b', evidence: [{ file: 'NOTES.md', quote: 'fast and cheap' }, { file: 'main.js', quote: 'speed = "fast"' }] },
        { text: 'c', evidence: [{ file: 'main.js', quote: 'speed = "fast"' }] },
      ],
    }).results;
    assert.deepEqual(r.map((x) => x.status), ['notes-only', 'supported', 'supported']);
    assert.deepEqual(r[0].files, ['NOTES.md']);
  });
});

test('claims: the README under test cannot be its own evidence', () => {
  withDir({ 'README.md': 'A very fast tool.', 'main.js': 'x' }, (dir) => {
    const r = checkClaims(dir, { claims: [{ text: 'fast', evidence: [{ file: 'README.md', quote: 'very fast tool' }] }] }, null, 'README.md').results;
    assert.equal(r[0].status, 'bad-evidence');
    assert.equal(r[0].problems[0].code, 'cites-the-readme');
  });
});

test('cli: notes-only claims are listed as a warning, do not fail the run, and show in the result line', () => {
  withDir(
    {
      'NOTES.md': 'The tool is fast and cheap to run.',
      'README.md': '# t\n\nIt is fast and cheap.\n',
      'claims.json': JSON.stringify({ claims: [{ text: 'It is fast and cheap.', evidence: [{ file: 'NOTES.md', quote: 'fast and cheap' }] }] }),
    },
    (dir) => {
      const r = run('--repo', dir, '--readme', path.join(dir, 'README.md'), '--claims', path.join(dir, 'claims.json'));
      assert.equal(r.status, 0, r.stdout);
      assert.match(r.stdout, /1 only by notes/);
      assert.match(r.stdout, /ONLY BY NOTES/);
      assert.match(r.stdout, /Result: PASS \(claims resting on notes only: 1\)/);
    },
  );
});

test('cli: citing the README itself fails the run', () => {
  withDir(
    {
      'README.md': '# t\n\nIt is fast and cheap.\n',
      'claims.json': JSON.stringify({ claims: [{ text: 'It is fast and cheap.', evidence: [{ file: 'README.md', quote: 'fast and cheap' }] }] }),
    },
    (dir) => {
      const r = run('--repo', dir, '--readme', path.join(dir, 'README.md'), '--claims', path.join(dir, 'claims.json'));
      assert.equal(r.status, 1);
      assert.match(r.stdout, /cites-the-readme/);
    },
  );
});

test('claims: a report with no claims list is an error', () => {
  assert.ok(checkClaims(repo, { nope: 1 }).error);
  assert.ok(checkClaims(repo, null).error);
});

test('claims: evidence that is not a list is bad evidence', () => {
  const r = checkClaims(repo, { claims: [{ text: 'x', evidence: 'package.json' }] }).results;
  assert.equal(r[0].status, 'bad-evidence');
});

test('markdown: headings and code are found, and ## inside a fence is not a heading', () => {
  const md = '# T\n\n## A\n\n```\n## not a heading\nnpm run dev\n```\n\nUse `npm test` here.\n';
  const p = parseMarkdown(md);
  assert.deepEqual(p.headings.map((h) => h.text), ['T', 'A']);
  assert.deepEqual(p.code, ['## not a heading', 'npm run dev', 'npm test']);
});

test('markdown: a fence labeled text or output is not read as commands, but an unlabeled or bash one still is', () => {
  const shown = 'Prints:\n\n```text\n  - npm run test: no "test" script\n```\n\n```output\nnode scripts/seed.mjs: file not found\n```\n\n```bash\nnpm run dev\n```\n\n```\nnpm start\n```\n\nThen `npm test` here.\n';
  assert.deepEqual(parseMarkdown(shown).code, ['npm run dev', 'npm start', 'npm test']);
});

test('markdown: a text fence ends at its closing fence, so the next block is read again', () => {
  const md = '```text\nnpm run hidden\n```\n```\nnpm run seen\n```\n';
  assert.deepEqual(parseMarkdown(md).code, ['npm run seen']);
});

test('commands: the good README has no problems', () => {
  const r = checkCommands(repo, parseMarkdown(readme('good.md')).code);
  assert.deepEqual(r.problems, []);
  assert.deepEqual(r.unchecked, []);
});

test('commands: the bad README has 2 problems and 1 unchecked wildcard', () => {
  const r = checkCommands(repo, parseMarkdown(readme('bad.md')).code);
  assert.deepEqual(r.problems.map((p) => p.cmd), ['npm run test', 'node scripts/seed.mjs']);
  assert.deepEqual(r.unchecked.map((p) => p.cmd), ['node scripts/check-*.mjs']);
});

test('commands: prose that mentions node outside code is ignored', () => {
  const r = checkCommands(repo, parseMarkdown('Each node in the tree.\n').code);
  assert.deepEqual(r.problems, []);
});

test('structure: the good README matches the web-app template', () => {
  const s = checkStructure(readme('good.md'), template);
  assert.deepEqual([s.missing, s.extra, s.outOfOrder, s.titleCount], [[], [], [], 1]);
});

test('structure: the bad README is missing Credits, has an extra section, and one out of order', () => {
  const s = checkStructure(readme('bad.md'), template);
  assert.deepEqual(s.missing, ['Credits']);
  assert.deepEqual(s.extra, ['Highlights']);
  assert.deepEqual(s.outOfOrder, ['Features']);
});

test('structure: an optional section may be left out', () => {
  assert.equal(checkStructure(readme('good.md'), template).missing.includes('Known limits'), false);
});

test('secrets: made-up keys are found, and the match text is not returned', () => {
  const fake = ['ghp_' + 'a'.repeat(36), 'AKIA' + 'A'.repeat(16), 'sk-ant-' + 'b'.repeat(30), 'password = ' + 'c'.repeat(20)];
  for (const f of fake) {
    const found = scanSecrets('line one\n' + f + '\n');
    assert.equal(found.length >= 1, true, f.slice(0, 6));
    assert.equal(found[0].line, 2);
    assert.deepEqual(Object.keys(found[0]).sort(), ['line', 'name']);
  }
});

test('secrets: ordinary prose and fixtures are not flagged', () => {
  assert.deepEqual(scanSecrets(readme('good.md')), []);
  assert.deepEqual(scanSecrets(readme('bad.md')), []);
  assert.deepEqual(scanSecrets('Set the token in your environment.\n'), []);
});

test('cli: good README + good claims passes with exit 0', () => {
  const r = run('--repo', repo, '--readme', readmeFile('good.md'), '--claims', claimsFile('good.json'));
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /Result: PASS/);
});

test('cli: bad README + bad claims fails with exit 1 and names each kind of problem', () => {
  const r = run('--repo', repo, '--readme', readmeFile('bad.md'), '--claims', claimsFile('bad.json'));
  assert.equal(r.status, 1);
  for (const s of ['UNSUPPORTED', 'BAD EVIDENCE', 'COMMANDS', 'NOT CHECKED', 'It has a dark mode', 'npm run test']) {
    assert.ok(r.stdout.includes(s), s);
  }
});

test('cli: missing arguments exit with 2', () => {
  assert.equal(run('--repo', repo).status, 2);
});

test('cli: a claims file that is not JSON exits 2 and says it is the model output', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'readme-architect-test-'));
  try {
    const f = path.join(dir, 'broken.json');
    writeFileSync(f, '{ "claims": [ ');
    const r = run('--repo', repo, '--readme', readmeFile('good.md'), '--claims', f);
    assert.equal(r.status, 2);
    assert.match(r.stdout, /MODEL OUTPUT PROBLEM/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('cli: a secret in the README fails the run and its value is never printed', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'readme-architect-test-'));
  try {
    const value = 'A'.repeat(24);
    const f = path.join(dir, 'leaky.md');
    writeFileSync(f, readme('good.md') + '\napi_key = ' + value + '\n');
    const r = run('--repo', repo, '--readme', f, '--claims', claimsFile('good.json'));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /SECRETS/);
    assert.equal(r.stdout.includes(value), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('cli: structure problems only fail the run with --strict-structure', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'readme-architect-test-'));
  try {
    const f = path.join(dir, 'extra.md');
    writeFileSync(f, readme('good.md') + '\n## Extras\n\nNothing here.\n');
    const base = ['--repo', repo, '--readme', f, '--claims', claimsFile('good.json'), '--template', templateFile];
    const loose = run(...base);
    assert.equal(loose.status, 0, loose.stdout);
    assert.match(loose.stdout, /section not in the template: Extras/);
    assert.equal(run(...base, '--strict-structure').status, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

console.log(`\n${passed} passed${process.exitCode ? ', some FAILED' : ''}`);
