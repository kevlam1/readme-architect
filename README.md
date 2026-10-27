# readme-architect

A Claude Code skill that fact-checks a project's README against the project's real files, and can draft a new README from them. Artifact 3 of TCSS 490 ("AI Inside It").

A model does part of the work every time it runs. Plain Node scripts do the rest and check the model's work.

## What it does

- `/readme-architect check <repo-folder> [readme-file]` lists every factual claim in a README. For each claim the model gives evidence: a file path and a short quote copied from the file (extra spaces and line breaks don't matter), or "no evidence found". A script then checks the evidence.
- `/readme-architect generate <repo-folder>` writes a README draft from the repo's files, with the same evidence for every sentence, and the same script checks it. The draft goes to `readme-architect-out/README.generated.md` and is never written into the repo it describes.
- It runs only when I type the command, and the only commands it pre-approves are the scripts in the skill folder.

## What the model does, and what the code checks

**The model is responsible for:**
- Check mode: reading the README and the facts the gather script collected, listing the claims, and giving each one evidence or none.
- Generate mode: writing each section of the README from the gathered facts, with evidence for every sentence and "Not found in the repo." where the repo has nothing.

**Plain code is responsible for** (no model, tested in Node):
- `gather.mjs`: lists the files, reads `package.json` and the entry files, and skips `.env*`, keys, `node_modules`, anything in `.gitignore` (lines starting with `!` are counted but not applied) and any text file whose first 200 KB looks like it holds a secret (it records only the line numbers). It also picks the README template from the kind of project (web app, static site, library or command-line tool, Claude Code skill).
- `check-readme.mjs`: checks that each cited file exists, that each quote is in that file (extra spaces and line breaks are ignored), that each `npm run` command exists in `package.json`, that the README's headings match the template, and that nothing in the output looks like a secret. It never prints a secret's value.

**How a failure is told apart:** a cited file or quote that does not exist means the model invented it. A real file that gather never listed is tagged `[gather script or process]` instead of `[model]`.

## What it cannot do

- **It proves the evidence exists, not that it supports the claim.** A quote can be real and still not show what the claim says. I read the report myself. In the midi-companion run the model named five claims whose evidence it called weak, and the checker passed them.
- **"Unsupported" does not mean "wrong".** It means the model found no proof in the repo. Some are only true on the author's machine ("in sync on my computer"), and some are opinions.
- **The model can miss claims.** The checker only checks the claims the model listed, so a claim it skipped is never checked.
- **It handles one project at the top of the folder.** A repo with separate `backend/` and `frontend/` folders and no top-level `package.json` (like Cardex and PokeGuess) gets no template, and its `npm run` commands would be flagged as problems. Supporting that needs changes to both scripts.
- **Secrets:** the gather script leaves them out of what it hands the model, but that is not a guarantee. It only looks at the first 200 KB of each text file, and it only knows a few secret shapes (private key blocks, AWS, GitHub, Anthropic and OpenAI-style keys, and `api_key`, `secret`, `token` or `password` assignments with a long value). Claude Code can still open files with its own tools. The repo has a `.claude/settings.json` with `Read` deny rules for `.env` and key files, written from the Claude Code docs, which call such rules best-effort: they cover its file tools and shell commands like `cat`, not a script that opens the file itself. I have not tested them. My test run was blocked.
- **Each run costs money and takes minutes.** It uses my Claude Code access, with no API key. The result files estimate $0.87 and about 90 seconds for 55 claims, and $2.11 and about 5 minutes for 188 claims, at list price. Those are estimates, not a bill. The test files and the checker alone take seconds and cost nothing.

## Try it

Needs Node.js (tested on Node 24). There is nothing to install.

```bash
# See the checker catch problems in a README (no model, no cost)
node .claude/skills/readme-architect/scripts/check-readme.mjs --repo test-fixtures/sample-repo --readme test-fixtures/readmes/bad.md --claims test-fixtures/claims/bad.json --template test-fixtures/templates/web-app.md
```

It lists the problems (a claim with no evidence, quotes that are not in the files, commands that do not exist) and ends with `Result: FAIL (5 problems)` and exit code 1. Use `good.md` and `good.json` instead of `bad.md` and `bad.json` to get `Result: PASS`.

```bash
# Run the skill on a project next to this folder (uses a model; Git Bash; Claude Code signed in)
mkdir -p readme-architect-out
MSYS_NO_PATHCONV=1 claude -p "/readme-architect check ../your-project" --add-dir ../your-project --permission-mode acceptEdits --output-format json > readme-architect-out/result.json
```

- The report is in the `result` field of `result.json`. Read the evidence in `readme-architect-out/claims.json` too.
- A run took about 1.5 to 5 minutes. The `mkdir` is needed because the output folder is gitignored. `MSYS_NO_PATHCONV=1` stops Git Bash from rewriting the `/`. `-p` skips Claude Code's trust prompt, so only use it on folders you trust.
- I have only run it this way. I have not typed it into an interactive Claude Code session or copied the skill into another project.

```bash
# Tests
node scripts/test-check.mjs     # 37 tests
node scripts/test-gather.mjs    # 14 tests
```

## What I ran it on

- The portfolio README: 55 claims, 52 supported, 3 unsupported.
- The midi-companion README, twice: 134 claims with 9 unsupported, then 188 claims with 17 unsupported.
- This README, once: 74 claims, 30 supported by code, 43 resting only on notes, 1 unsupported. I fixed three wording overclaims afterward and did not run it again.
- Generate mode: one small fixture repo only. It has not run on a real project.

The full record, including where the model was wrong, is in `log.md`.

## Built with

- Claude Code skill (`.claude/skills/readme-architect/`)
- Node.js scripts, no dependencies
