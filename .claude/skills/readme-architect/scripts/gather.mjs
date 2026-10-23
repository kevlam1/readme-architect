#!/usr/bin/env node
// Lists a repo's files and key facts as JSON for the model. Leaves out secrets and ignored files. Plain Node, no dependencies.
// Usage: node gather.mjs --repo <dir> [--out <file.json>]   (without --out the JSON is printed)
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isSecretPath, scanSecrets } from './check-readme.mjs';

const MAX_FILES = 3000;
const MAX_ENTRY_FILES = 8;
const MAX_ENTRY_CHARS = 20000;
const ALWAYS_SKIP_DIRS = new Set(['.git', 'node_modules']);
const ENTRY_NAMES = ['index.html', 'main.js', 'main.mjs', 'index.js', 'src/main.js', 'src/main.ts', 'src/index.js', 'src/index.ts', 'app.js', 'server.js'];
const SKILL_FILE = /^\.claude\/skills\/[^/]+\/SKILL\.md$/;

const globToRegex = (g) =>
  new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*').replace(/\?/g, '[^/]') + '$');

// Handles plain names, wildcards, leading/trailing slashes and comments. Lines starting with ! are counted and not applied.
function loadIgnore(root) {
  let text = '';
  try {
    text = readFileSync(path.join(root, '.gitignore'), 'utf8');
  } catch {}
  const rules = [];
  let unsupported = 0;
  for (let line of text.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('!')) {
      unsupported++;
      continue;
    }
    const dirOnly = line.endsWith('/');
    if (dirOnly) line = line.slice(0, -1);
    const anchored = line.includes('/');
    rules.push({ re: globToRegex(line.replace(/^\//, '')), dirOnly, anchored });
  }
  return {
    rules: rules.length,
    unsupported,
    test(rel, isDir) {
      const name = rel.split('/').pop();
      return rules.some((r) => (!r.dirOnly || isDir) && r.re.test(r.anchored ? rel : name));
    },
  };
}

function walk(root, ignore) {
  const files = [];
  const skipped = [];
  let truncated = false;
  const visit = (dirRel) => {
    const entries = readdirSync(path.join(root, dirRel), { withFileTypes: true });
    for (const ent of entries) {
      const rel = dirRel ? `${dirRel}/${ent.name}` : ent.name;
      if (ent.isSymbolicLink()) {
        skipped.push({ path: rel, reason: 'symlink' });
      } else if (ent.isDirectory()) {
        if (ALWAYS_SKIP_DIRS.has(ent.name)) skipped.push({ path: rel + '/', reason: 'skipped-folder' });
        else if (ignore.test(rel, true)) skipped.push({ path: rel + '/', reason: 'ignored' });
        else visit(rel);
      } else if (ent.isFile()) {
        if (isSecretPath(rel)) skipped.push({ path: rel, reason: 'secret-path' });
        else if (ignore.test(rel, false)) skipped.push({ path: rel, reason: 'ignored' });
        else if (files.length >= MAX_FILES) truncated = true;
        else files.push({ path: rel, bytes: statSync(path.join(root, rel)).size });
      }
    }
  };
  visit('');
  files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  skipped.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { files, skipped, truncated };
}

export function detectKind(paths, pkg) {
  const has = (p) => paths.includes(p);
  const skill = paths.find((p) => SKILL_FILE.test(p));
  if (skill && !has('index.html')) return { kind: 'claude-skill', reason: `${skill} exists and there is no index.html` };
  if (has('package.json') && has('index.html')) return { kind: 'web-app', reason: 'package.json and index.html both exist' };
  if (has('index.html')) return { kind: 'static-site', reason: 'index.html exists and there is no package.json' };
  if (pkg && (pkg.bin || pkg.main)) return { kind: 'library-cli', reason: 'package.json has "bin" or "main" and there is no index.html' };
  return { kind: 'unknown', reason: 'no rule matched' };
}

function entryCandidates(paths, pkg) {
  const out = [];
  const add = (p) => {
    if (typeof p !== 'string') return;
    const clean = p.replace(/^\.\//, '');
    if (paths.includes(clean) && !out.includes(clean)) out.push(clean);
  };
  add(pkg?.main);
  if (typeof pkg?.bin === 'string') add(pkg.bin);
  else if (pkg?.bin && typeof pkg.bin === 'object') Object.values(pkg.bin).forEach(add);
  ENTRY_NAMES.forEach(add);
  paths.filter((p) => SKILL_FILE.test(p)).forEach(add);
  return out.slice(0, MAX_ENTRY_FILES);
}

export function gather(rootArg) {
  const root = path.resolve(rootArg);
  if (!statSync(root).isDirectory()) throw new Error('not a folder');
  const ignore = loadIgnore(root);
  const { files, skipped, truncated } = walk(root, ignore);
  const paths = files.map((f) => f.path);

  let pkg = null;
  let packageJsonError = null;
  let packageJson = null;
  if (paths.includes('package.json')) {
    try {
      pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
      const { name, version, description, type, scripts, dependencies, devDependencies, bin, main, license } = pkg;
      packageJson = { name, version, description, type, scripts, dependencies, devDependencies, bin, main, license };
      if (scanSecrets(JSON.stringify(packageJson, null, 2)).length) {
        packageJson = { withheld: 'looks-like-secret' };
        skipped.push({ path: 'package.json', reason: 'looks-like-secret (summary withheld)' });
      }
    } catch (e) {
      packageJsonError = `package.json is not valid JSON: ${e.message}`;
    }
  }

  const entryFiles = [];
  for (const p of entryCandidates(paths, pkg)) {
    const text = readFileSync(path.join(root, p), 'utf8');
    const hits = scanSecrets(text);
    if (hits.length) {
      skipped.push({ path: p, reason: 'looks-like-secret', lines: hits.map((h) => h.line) });
      continue;
    }
    entryFiles.push({ path: p, text: text.length > MAX_ENTRY_CHARS ? text.slice(0, MAX_ENTRY_CHARS) + '\n[truncated]' : text });
  }

  const { kind, reason } = detectKind(paths, pkg);
  return {
    repo: path.basename(root),
    kind,
    kindReason: reason,
    templateFile: kind === 'unknown' ? null : `${kind}.md`,
    readme: paths.find((p) => /^readme(\.md)?$/i.test(p)) ?? null,
    licenseFiles: paths.filter((p) => !p.includes('/') && /^(license|licence|copying)/i.test(p)),
    packageJson,
    packageJsonError,
    gitignore: { rules: ignore.rules, unsupportedLines: ignore.unsupported },
    filesTruncated: truncated,
    files,
    entryFiles,
    skipped,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const arg = (flag) => {
    const i = process.argv.indexOf(flag);
    return i > -1 ? process.argv[i + 1] : null;
  };
  const repo = arg('--repo');
  const out = arg('--out');
  if (!repo) {
    console.log('Usage: node gather.mjs --repo <dir> [--out <file.json>]');
    process.exit(2);
  }
  try {
    const g = gather(repo);
    if (out) {
      mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
      writeFileSync(out, JSON.stringify(g, null, 2));
      console.log(`Wrote ${out}: kind ${g.kind}, template ${g.templateFile}, ${g.files.length} files, ${g.entryFiles.length} entry files, ${g.skipped.length} skipped, README ${g.readme}`);
    } else {
      console.log(JSON.stringify(g, null, 2));
    }
  } catch (e) {
    console.log(`Could not gather ${repo}: ${e.message}`);
    process.exit(2);
  }
}
