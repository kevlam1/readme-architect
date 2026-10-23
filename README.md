# readme-architect

A Claude Code skill that fact-checks a project's README against the project's real files, and can draft a new README from them. Artifact 3 of TCSS 490 ("AI Inside It").

A model does part of the work every time it runs. Plain Node scripts do the rest and check the model's work.

## What it does

- `/readme-architect check <repo-folder> [readme-file]` lists every factual claim in a README. For each claim the model gives evidence: a file path and a short quote copied word for word, or "no evidence found". A script then checks the evidence.
- `/readme-architect generate <repo-folder>` writes a README draft from the repo's files, with the same evidence for every sentence, and the same script checks it. The draft goes to `readme-architect-out/README.generated.md` and is never written into the repo it describes.
- It runs only when I type the command, and the only things it may run without asking are the scripts in the skill folder.

## What the model does, and what the code checks

**The model is responsible for:**
- Check mode: reading the README and the facts the gather script collected, listing the claims, and giving each one evidence or none.
- Generate mode: writing each section of the README from the gathered facts, with evidence for every sentence and "Not found in the repo." where the repo has nothing.

**Plain code is responsible for** (no model, tested in Node):
- `gather.mjs`: lists the files, reads `package.json` and the entry files, and skips `.env*`, keys, `node_modules`, anything in `.gitignore` and anything that looks like a secret. It also picks the README template from the kind of project (web app, static site, library or command-line tool, Claude Code skill).
- `check-readme.mjs`: checks that each cited file exists, that each quote is in that file word for word, that each `npm run` command exists in `package.json`, that the README's headings match the template, and that nothing in the output looks like a secret. It never prints a secret's value.

**How a failure is told apart:** a cited file or quote that does not exist means the model invented it. A real file that gather never listed is tagged `[gather script or process]` instead of `[model]`.

## What it cannot do

- **It proves the evidence exists, not that it supports the claim.** A quote can be real and still not show what the claim says. I read the report myself. In the midi-companion run the model named five claims whose evidence it called weak, and the checker passed them.
- **"Unsupported" does not mean "wrong".** It means the model found no proof in the repo. Some are only true on the author's machine ("in sync on my computer"), and some are opinions.
- **The model can miss claims.** The checker only checks the claims the model listed, so a claim it skipped is never checked.
- **It handles one project at the top of the folder.** A repo with separate `backend/` and `frontend/` folders and no top-level `package.json` (like Cardex and PokeGuess) gets no template, and its `npm run` commands would be flagged as problems. Supporting that needs changes to both scripts.
- **Secrets:** the gather script leaves them out of what it hands the model, but that is not a guarantee. Claude Code can still open files with its own tools. I have not tested whether a deny rule stops that.
- **Each run costs.** It uses my Claude Code access, with no API key. The result files estimate $0.87 (55 claims) to $2.11 (188 claims) at list price. Those are estimates, not a bill.

## Try it

Needs Node.js (built and tested on Node 24) and Claude Code. There is nothing to install, because the scripts use only Node built-ins.

```
node scripts/test-check.mjs     # 33 tests for the checker
node scripts/test-gather.mjs    # 12 tests for the gather script
```

To run the skill from this folder, in Git Bash (the `MSYS_NO_PATHCONV=1` stops Git Bash from rewriting the leading `/`):

```
MSYS_NO_PATHCONV=1 claude -p "/readme-architect check ../midi-companion" --add-dir ../midi-companion --permission-mode acceptEdits --output-format json > readme-architect-out/result.json
```

Then read `readme-architect-out/claims.json` yourself. `readme-architect-out/` is gitignored.

## What I ran it on

- The portfolio README: 55 claims, 52 supported, 3 unsupported.
- The midi-companion README, twice: 134 claims with 9 unsupported, then 188 claims with 17 unsupported.
- Generate mode: one small fixture repo only. It has not run on a real project.

The full record, including where the model was wrong, is in `log.md`.

## Built with

- Claude Code skill (`.claude/skills/readme-architect/`)
- Node.js scripts, no dependencies
