#!/usr/bin/env node
// Checks a README and a claims report against a repo. Plain Node, no dependencies.
// Usage: node check-readme.mjs --repo <dir> --readme <file> --claims <file.json> [--template <file>] [--gathered <gather.json>] [--strict-structure]
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_BYTES = 2 * 1024 * 1024;
const MIN_QUOTE_CHARS = 4;

const norm = (s) => s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
const fail = (code, detail) => ({ ok: false, code, detail });
const escapes = (rel) => rel === '' || path.isAbsolute(rel) || rel.split(path.sep)[0] === '..';

export function isSecretPath(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  const base = parts[parts.length - 1];
  if (parts.includes('node_modules')) return true;
  if (/^\.env/i.test(base) && !/\.(example|sample|template)$/i.test(base)) return true;
  return /\.(pem|key|p12|pfx)$/i.test(base) || /^id_(rsa|dsa|ecdsa|ed25519)/.test(base);
}

const NOTES_FILE = /\.(md|markdown|txt|rst)$/i;

export function checkEvidence(root, ev, listed = null, readmeRel = null) {
  if (!ev || typeof ev.file !== 'string' || typeof ev.quote !== 'string') {
    return fail('malformed', 'evidence needs a "file" string and a "quote" string');
  }
  const abs = path.resolve(root, ev.file);
  const rel = path.relative(root, abs);
  if (escapes(rel)) return fail('outside-repo', ev.file);
  if (isSecretPath(rel)) return fail('secret-file', ev.file);
  if (!existsSync(abs) || !statSync(abs).isFile()) return fail('file-missing', ev.file);
  const realRel = path.relative(realpathSync.native(root), realpathSync.native(abs));
  if (escapes(realRel)) return fail('outside-repo', ev.file);
  if (isSecretPath(realRel)) return fail('secret-file', ev.file);
  if (realRel !== rel && realRel.toLowerCase() === rel.toLowerCase()) {
    return fail('case-mismatch', `${ev.file} is really ${realRel}`);
  }
  const realPosix = realRel.split(path.sep).join('/');
  if (readmeRel && realPosix === readmeRel) return fail('cites-the-readme', 'the README under test cannot be its own evidence');
  if (listed && !listed.has(realPosix)) return fail('not-in-gather-list', ev.file);
  if (statSync(abs).size > MAX_BYTES) return fail('file-too-large', ev.file);
  const quote = norm(ev.quote);
  if (quote.replace(/ /g, '').length < MIN_QUOTE_CHARS) return fail('quote-too-short', ev.file);
  if (!norm(readFileSync(abs, 'utf8')).includes(quote)) return fail('quote-not-found', ev.file);
  return { ok: true };
}

export function checkClaims(root, report, listed = null, readmeRel = null) {
  if (!report || !Array.isArray(report.claims)) return { error: 'the report has no "claims" array' };
  const results = report.claims.map((c) => {
    const text = typeof c?.text === 'string' ? c.text : '(claim has no text)';
    if (c?.evidence !== undefined && !Array.isArray(c.evidence)) {
      return { text, status: 'bad-evidence', problems: [{ code: 'malformed', detail: '"evidence" must be a list' }] };
    }
    const evidence = c?.evidence ?? [];
    if (evidence.length === 0) return { text, status: 'unsupported', problems: [] };
    const problems = evidence.map((e) => ({ e, r: checkEvidence(root, e, listed, readmeRel) })).filter((x) => !x.r.ok);
    const status = problems.length ? 'bad-evidence' : evidence.every((e) => NOTES_FILE.test(e.file)) ? 'notes-only' : 'supported';
    return {
      text,
      status,
      files: [...new Set(evidence.map((e) => e?.file).filter((f) => typeof f === 'string'))],
      problems: problems.map((x) => ({ ...x.r, quote: typeof x.e?.quote === 'string' ? x.e.quote : '' })),
    };
  });
  return { results };
}

export function parseMarkdown(md) {
  const headings = [];
  const code = [];
  let inFence = false;
  md.replace(/\r\n/g, '\n').split('\n').forEach((line, i) => {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) {
      code.push(line);
      return;
    }
    const h = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (h) headings.push({ level: h[1].length, text: h[2], line: i + 1 });
    for (const m of line.matchAll(/`([^`]+)`/g)) code.push(m[1]);
  });
  return { headings, code };
}

export function parseTemplate(text) {
  const out = [];
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    const h = /^##\s+(.+?)\s*$/.exec(line);
    if (h) out.push({ text: h[1], optional: false });
    else if (out.length && /<!--\s*optional\b/.test(line)) out[out.length - 1].optional = true;
  }
  return out;
}

export function checkStructure(readmeMd, templateText) {
  const tpl = parseTemplate(templateText);
  const { headings } = parseMarkdown(readmeMd);
  const h2 = headings.filter((h) => h.level === 2).map((h) => h.text);
  const names = tpl.map((t) => t.text);
  const outOfOrder = [];
  let highest = -1;
  for (const t of h2) {
    const i = names.indexOf(t);
    if (i < 0) continue;
    if (i < highest) outOfOrder.push(t);
    else highest = i;
  }
  return {
    titleCount: headings.filter((h) => h.level === 1).length,
    missing: tpl.filter((t) => !t.optional && !h2.includes(t.text)).map((t) => t.text),
    extra: h2.filter((t) => !names.includes(t)),
    outOfOrder,
  };
}

export function checkCommands(root, codeStrings) {
  let scripts = null;
  try {
    scripts = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).scripts ?? {};
  } catch {
    scripts = null;
  }
  const problems = [];
  const unchecked = [];
  const seen = new Set();
  const once = (key, fn) => {
    if (!seen.has(key)) {
      seen.add(key);
      fn();
    }
  };
  const needScript = (name, cmd) =>
    once(cmd, () => {
      if (!scripts) problems.push({ cmd, why: 'no readable package.json' });
      else if (!Object.hasOwn(scripts, name)) problems.push({ cmd, why: `no "${name}" script in package.json` });
    });
  for (const s of codeStrings) {
    for (const m of s.matchAll(/\bnpm run(?:-script)? ([\w:.-]+)/g)) needScript(m[1], `npm run ${m[1]}`);
    for (const m of s.matchAll(/\bnpm (test|start)\b/g)) needScript(m[1], `npm ${m[1]}`);
    for (const m of s.matchAll(/(?:^|\s)node\s+([^\s-][^\s]*)/g)) {
      const token = m[1].replace(/^["']|["']$/g, '');
      const cmd = `node ${token}`;
      once(cmd, () => {
        if (/[*?<>$]/.test(token)) {
          unchecked.push({ cmd, why: 'has a wildcard or placeholder, so it cannot be checked' });
          return;
        }
        const rel = path.relative(root, path.resolve(root, token));
        if (escapes(rel) || !existsSync(path.resolve(root, token))) problems.push({ cmd, why: 'file not found in the repo' });
      });
    }
  }
  return { problems, unchecked };
}

const SECRET_PATTERNS = [
  ['private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS access key id', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{36,}/],
  ['Anthropic-style key', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['OpenAI-style key', /\bsk-[A-Za-z0-9]{32,}/],
  ['key, secret or token assignment', /\b(?:api[_-]?key|secret|token|passwd|password)\b["']?\s*[:=]\s*["']?[A-Za-z0-9_\-+/]{16,}/i],
];

// Returns pattern names and line numbers only, never the matched text.
export function scanSecrets(text) {
  const found = [];
  text.replace(/\r\n/g, '\n').split('\n').forEach((line, i) => {
    for (const [name, re] of SECRET_PATTERNS) if (re.test(line)) found.push({ name, line: i + 1 });
  });
  return found;
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--strict-structure') o.strict = true;
    else if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[++i];
  }
  return o;
}

const clip = (s, n = 70) => (s.length > n ? s.slice(0, n) + '...' : s);

export function main(argv) {
  const a = parseArgs(argv);
  if (!a.repo || !a.readme || !a.claims) {
    console.log('Usage: node check-readme.mjs --repo <dir> --readme <file> --claims <file.json> [--template <file>] [--strict-structure]');
    return 2;
  }
  let readme, claimsText, template = null, report, listed = null;
  try {
    readme = readFileSync(a.readme, 'utf8');
    claimsText = readFileSync(a.claims, 'utf8');
    if (a.template) template = readFileSync(a.template, 'utf8');
    if (!statSync(a.repo).isDirectory()) throw new Error('--repo is not a folder');
    if (a.gathered) listed = new Set(JSON.parse(readFileSync(a.gathered, 'utf8')).files.map((f) => f.path));
  } catch (e) {
    console.log(`Could not read an input: ${e.message}`);
    return 2;
  }
  try {
    report = JSON.parse(claimsText);
  } catch {
    console.log('MODEL OUTPUT PROBLEM: the claims report is not valid JSON.');
    return 2;
  }
  const root = path.resolve(a.repo);
  let readmeRel = null;
  try {
    const r = path.relative(realpathSync.native(root), realpathSync.native(path.resolve(a.readme)));
    if (!escapes(r)) readmeRel = r.split(path.sep).join('/');
  } catch {}
  const claims = checkClaims(root, report, listed, readmeRel);
  if (claims.error) {
    console.log(`MODEL OUTPUT PROBLEM: ${claims.error}.`);
    return 2;
  }
  const secrets = [
    ...scanSecrets(readme).map((s) => ({ ...s, where: 'README' })),
    ...scanSecrets(claimsText).map((s) => ({ ...s, where: 'claims report' })),
  ];
  const showQuotes = !secrets.some((s) => s.where === 'claims report');
  const commands = checkCommands(root, parseMarkdown(readme).code);
  const structure = template ? checkStructure(readme, template) : null;

  const by = (s) => claims.results.filter((r) => r.status === s);
  const unsupported = by('unsupported');
  const bad = by('bad-evidence');
  const notes = by('notes-only');
  console.log(`Claims: ${claims.results.length} total, ${by('supported').length} supported by code, ${notes.length} only by notes, ${unsupported.length} unsupported, ${bad.length} with bad evidence`);
  if (unsupported.length) {
    console.log('\nUNSUPPORTED (README problem: nothing in the repo backs these):');
    for (const r of unsupported) console.log(`  - ${clip(r.text)}`);
  }
  if (notes.length) {
    console.log('\nONLY BY NOTES (warning only: the evidence is a markdown or text file, which can repeat the README instead of showing the code):');
    for (const r of notes) console.log(`  - ${clip(r.text)}  [${r.files.join(', ')}]`);
  }
  if (bad.length) {
    console.log('\nBAD EVIDENCE (the tag says whose problem it most likely is):');
    for (const r of bad) {
      console.log(`  - ${clip(r.text)}`);
      for (const p of r.problems) {
        const tag = p.code === 'not-in-gather-list' ? '[gather script or process]' : '[model]';
        console.log(`      ${tag} ${p.code}: ${p.detail}${showQuotes && p.quote ? ` | quote: ${clip(p.quote, 50)}` : ''}`);
      }
    }
  }
  if (commands.problems.length) {
    console.log('\nCOMMANDS (README problem: the README tells readers to run something that is not there):');
    for (const p of commands.problems) console.log(`  - ${p.cmd}: ${p.why}`);
  }
  if (commands.unchecked.length) {
    console.log('\nNOT CHECKED:');
    for (const p of commands.unchecked) console.log(`  - ${p.cmd}: ${p.why}`);
  }
  let structureProblems = 0;
  if (structure) {
    structureProblems = structure.missing.length + structure.extra.length + structure.outOfOrder.length + (structure.titleCount === 1 ? 0 : 1);
    if (structureProblems) {
      console.log(`\nSTRUCTURE (${a.strict ? 'counts as a failure' : 'warning only; add --strict-structure to fail'}):`);
      if (structure.titleCount !== 1) console.log(`  - expected one # title, found ${structure.titleCount}`);
      for (const t of structure.missing) console.log(`  - missing section: ${t}`);
      for (const t of structure.extra) console.log(`  - section not in the template: ${t}`);
      for (const t of structure.outOfOrder) console.log(`  - out of order: ${t}`);
    }
  }
  if (secrets.length) {
    console.log('\nSECRETS (values are not shown):');
    for (const s of secrets) console.log(`  - ${s.name} in ${s.where}, line ${s.line}`);
  }
  const failures = unsupported.length + bad.length + commands.problems.length + secrets.length + (a.strict ? structureProblems : 0);
  const noteTail = notes.length ? `, claims resting on notes only: ${notes.length}` : '';
  console.log(failures ? `\nResult: FAIL (${failures} problem${failures === 1 ? '' : 's'}${noteTail})` : `\nResult: PASS${noteTail ? ` (${noteTail.slice(2)})` : ''}`);
  return failures ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exit(main(process.argv.slice(2)));
}
