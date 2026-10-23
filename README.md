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
- **Secrets:** the gather script leaves them out of what it hands the model, but that is not a guarantee. It only looks at the first 200 KB of each text file, and it only knows a few secret shapes (private key blocks, AWS, GitHub, Anthropic and OpenAI-style keys, and `api_key`, `secret`, `token` or `password` assignments with a long value). Claude Code can still open files with its own tools. I have not tested whether a deny rule stops that.
- **Each run costs money and takes minutes.** It uses my Claude Code access, with no API key. The result files estimate $0.87 and about 90 seconds for 55 claims, and $2.11 and about 5 minutes for 188 claims, at list price. Those are estimates, not a bill. The test files and the checker alone take seconds and cost nothing.

## Try it

Needs Node.js (built and tested on Node 24). The scripts use only Node built-ins, so there is nothing to install. Step 2 also needs Claude Code, signed in. I ran it through my course plan and have not tried it with an API key.

### 1. See the checker work (no model, no cost, about a second)

The checker is the plain-code half. This runs it on a small test project, with a README and a list of claims that are wrong on purpose:

```
node .claude/skills/readme-architect/scripts/check-readme.mjs --repo test-fixtures/sample-repo --readme test-fixtures/readmes/bad.md --claims test-fixtures/claims/bad.json --template test-fixtures/templates/web-app.md
```

It exits with code 1 and prints this (checked on 2026-10-22):

```text
Claims: 5 total, 2 supported by code, 0 only by notes, 1 unsupported, 2 with bad evidence

UNSUPPORTED (README problem: nothing in the repo backs these):
  - It has a dark mode.

BAD EVIDENCE (the tag says whose problem it most likely is):
  - It is built with Webpack.
      [model] quote-not-found: package.json | quote: "webpack": "^5.0.0"
  - A script seeds the sample data.
      [model] file-missing: scripts/seed.mjs | quote: export function seed()

COMMANDS (README problem: the README tells readers to run something that is not there):
  - npm run test: no "test" script in package.json
  - node scripts/seed.mjs: file not found in the repo
...
Result: FAIL (5 problems)
```

Change `bad` to `good` in the `--readme` and `--claims` file names and it prints `Result: PASS` and exits with code 0.

### 2. Run the skill on a real project (uses a model)

In Git Bash, from this folder. `../your-project` is a placeholder for your own project's folder:

```
mkdir -p readme-architect-out
MSYS_NO_PATHCONV=1 claude -p "/readme-architect check ../your-project" --add-dir ../your-project --permission-mode acceptEdits --output-format json > readme-architect-out/result.json
```

What each part does:
- `mkdir -p readme-architect-out` makes the output folder. It is gitignored, so a fresh clone does not have it, and the `>` at the end fails without it.
- `MSYS_NO_PATHCONV=1` stops Git Bash from rewriting the leading `/` of `/readme-architect`. Without it the skill does not start.
- `claude -p "..."` runs Claude Code once and prints the response ("Print response and exit", per `claude --help`). The text in quotes is the skill command: `check` is the mode, and the folder is the project to check. It finds the project's README itself, or you can add the README's file name after the folder. Claude Code's help warns that `-p` skips the workspace trust dialog, so only use it in folders you trust.
- `--add-dir ../your-project` gives the run access to that other folder. It is not needed when the project is this folder (use `.`).
- `--permission-mode acceptEdits` is one of Claude Code's permission modes. The help lists the choices but does not describe them. I used it so the run could write its output files without stopping to ask, and my runs finished with no permission denials.
- `--output-format json > readme-architect-out/result.json` saves the run as one JSON file. The report is in its `result` field, next to an estimated cost (`total_cost_usd`) and `permission_denials`.

Runs so far took between about 1.5 and 5 minutes.

### 3. Read the result

The report has the same sections as in step 1:
- The first line counts the claims. "Supported by code" means a cited file that is not a note (`.md`, `.txt`) contains the quote. "Only by notes" means every cited file is a note, which is only a warning.
- **UNSUPPORTED** claims got no evidence. That does not mean the README is wrong.
- **BAD EVIDENCE** is a cited file or quote that does not exist. `[model]` means the model made it up. `[gather script or process]` means the file exists but the gather script never listed it.
- **COMMANDS** and **STRUCTURE** check the README's commands and headings. The checker exits with 0 for a pass, 1 for findings and 2 for bad input.

The checker proves a quote exists, not that it supports the claim, so open `readme-architect-out/claims.json` and read the evidence for the claims that matter.

I have only run the skill this way (`claude -p`, from this folder). I have not typed it into an interactive Claude Code session, and I have not tried copying the skill into another project.

### Tests for the scripts

```
node scripts/test-check.mjs     # 35 tests for the checker
node scripts/test-gather.mjs    # 14 tests for the gather script
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
