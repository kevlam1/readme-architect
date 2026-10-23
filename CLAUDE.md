# CLAUDE.md: readme-architect (TCSS 490 Artifact 3)

Read this file first. My shared preferences are in `../CLAUDE.md` (the `TCSS 490` folder, loaded for every artifact, not in git). Keep this file under 200 lines and move anything long into `docs/`.

## What this project is
- Artifact 3 of TCSS 490, "AI Inside It". **Direction and name chosen on 2026-10-22:** a README fact-checker and generator, built as a Claude Code skill plus plain Node scripts, named `readme-architect`. The folder was `temporaryname` and is now renamed `readme-architect`. There are six local commits and no GitHub repo yet. Create `kevlam1/readme-architect` before the card links to anything, because the URL can't change afterward.
- Due **Sunday, October 25, 2026 at 11:59 PM** on Canvas. About 8 to 12 hours, one person, one week. This folder was set up on 2026-10-22, so time is short: keep the first version small.
- Status (2026-10-22): the four README templates are drafted (`library-cli.md` not yet reviewed by me; the other three were changed to match my own READMEs). The checker (`check-readme.mjs`, 33 tests) and the gather script (`gather.mjs`, 12 tests) are written and tested on a fixture repo, and gather has also run on midi-companion. The check-mode `SKILL.md` is written, and ran end to end once on the Portfolio README (entry 9 in `log.md`: 55 claims, 52 supported, 3 unsupported, 0 bad evidence, with a miss and a weakness found by checking by hand). Generate mode is built in `SKILL.md` and ran once on the fixture repo (entry 12), not yet on a real project. The checker now separates claims backed by code from claims backed only by notes (entry 10). Check mode has also run on midi-companion's README twice, the second time with 188 claims and 17 unsupported (entry 13). Next: create the GitHub repo, then the portfolio card and the demo.

## What the spec asks for (read from `../Unit 3/Artifact 3- AI Inside It.pdf` on 2026-10-22)
- A model does some of the work **every time it runs**: it reads, decides, writes, or calls tools.
- Shapes that fit: a Claude Code skill, slash command or hook that fixes something in my own workflow; an MCP server that gives Claude a tool or data source I use; a script that runs Claude Code headless (`claude -p`) as one step in a pipeline; an app that calls a model through an API; or Artifact 2 extended with a model inside it.
- **Cost:** the Claude access from the course covers Claude Code, not the Claude API, which bills separately for every call. The first three shapes run on the access I have. The API shape may cost money, and the spec says to ask an instructor before choosing an option that needs a paid key.
- Keep the model's part **small and clear**, so that when something goes wrong I can tell whether it was the model or my code. Write down exactly what the model is responsible for and what the surrounding code checks (the next section).
- Keep a log in the repo. No required format.
- Done means: a model does real work inside it every time it runs, the repo has a log of plans and changes, and its card is on my portfolio (a title, a link to the repo or a short demo video, and a few sentences of reflection). Then I submit the same portfolio link on Canvas.
- The learning goals: decide which part of a task the model does and which part plain code does, and weigh cost, latency, reliability and security.
- Not yet read: the reading the spec names ("Tools on Top of LLMs") and the other two Unit 3 PDFs (`how-machines-learn.pdf`, `llms-under-the-hood.pdf`).

## What the model does, and what the code checks
Chosen 2026-10-22, nothing built yet. Two modes share one checker. **Check mode is the core and is built first.** Generate mode is built last and is the first thing cut if time runs short. The spec says writing this split down is a good idea, and `README.md` should say the same.
- The model is responsible for:
  - Check mode: read an existing README and the facts the gather script collected, list every factual claim, and give each one evidence (a file path and a short verbatim quote) or "no evidence found".
  - Generate mode: write each section of a README template from the gathered facts, with the same evidence for every claim, and "not found" where the repo has nothing.
- Plain code is responsible for (gather, template picking and the check script are written and tested):
  - Gather (`.claude/skills/readme-architect/scripts/gather.mjs`): list the files, read `package.json` and entry points, and skip `.env*`, keys, `node_modules`, anything in `.gitignore` and any file or summary that looks like it holds a secret, so the facts handed to the model leave secrets out. This is not a guarantee: Claude Code can still open files with its own tools. Test whether a permission deny rule or the skill's tool restrictions stop that, and write down what was found.
  - Pick the template by kind of project (web app, library or CLI, Claude Code skill or tool, static site) from files such as `package.json`, `index.html` and `SKILL.md`. I can override the pick. Templates live in `.claude/skills/readme-architect/templates/`, so the skill folder is self-contained and can be copied to another project.
  - Check (`.claude/skills/readme-architect/scripts/check-readme.mjs`): each cited file exists, each quote is in that file word for word, each `npm run` command exists in `package.json`, the README's headings match the template and its order, and nothing in the output looks like a secret.
- How a failure is told apart: a cited file or quote that does not exist means the model invented it. A real file that never appeared in the gather output means my gather script is wrong, or the model read around it. The checker's `--gathered` option tags that case `[gather script or process]` instead of `[model]`. A small fixture repo with known contents separates the two in tests.
- Known limit: the checker proves the evidence exists, not that it supports the claim. I read the report myself, and `README.md` must say so.
- What a run costs, and where any key lives: no paid key, no new dependency. It runs on my Claude Code access and the scripts use only Node built-ins. There is nothing to store.

## First session (in this order, and ask me before moving on)
1. Use plan mode. Say the idea back in your own words before building.
2. Pick the shape from the list above. A skill, MCP server or headless script needs no hosting and no paid key. Say what it costs before building.
3. Pick the real name, then rename this folder. **Do it before creating the GitHub repo or any hosting**: the repo name and URL end up on the portfolio card and can't change afterward.
4. Create the GitHub repo (`kevlam1/<name>`), add it as `origin`, and commit the setup files. Only when I ask.
5. Fill in the section above, the Goal and stack in this file, and add an entry to `log.md`.

## Files
- `CLAUDE.md`: this file.
- `log.md`: the build log, in my first-person voice (see "The log protocol").
- `README.md`: what it is, including what the model does and what the code checks.
- `docs/todo.md`: open items.
- `.gitignore`: already ignores `node_modules/`, `dist/`, `.env*`, `.idea/`, `scratch*`, `CLAUDE.local.md` and `.claude/settings.local.json`.
- `.claude/skills/readme-architect/templates/`: `web-app.md`, `static-site.md`, `library-cli.md` and `claude-skill.md`. `web-app.md` and `static-site.md` use the heading names and order of Kevin's midi-companion and Portfolio READMEs (checked 2026-10-22: both match with nothing missing, extra or out of order). `claude-skill.md` follows this repo's own `README.md` (checked 2026-10-22: only the project-specific "What I ran it on" is extra). `library-cli.md` has no README of Kevin's to copy. Optional sections are marked with an `optional` comment, and the evidence each section needs is written in comments. The tests use their own copy in `test-fixtures/templates/`, so editing these does not break them.
- `.claude/skills/readme-architect/scripts/check-readme.mjs`: the checker. Takes `--repo`, `--readme`, `--claims` (a JSON report from the model: `{"claims":[{"text":"...","evidence":[{"file":"...","quote":"..."}]}]}`), and optionally `--template`, `--gathered` (the JSON from gather) and `--strict-structure`. Exit 0 pass, 1 findings, 2 bad input. It never prints a secret's value. A claim is "supported by code" if at least one cited file is not `.md`, `.markdown`, `.txt` or `.rst`; if all are, it is "only by notes", which is a warning and does not fail the run. A claim that cites the README under test is bad evidence (`cites-the-readme`).
- `.claude/skills/readme-architect/SKILL.md`: check mode and generate mode. Run as `/readme-architect check <repo-folder> [readme-file]` or `/readme-architect generate <repo-folder>`. Generate writes `readme-architect-out/README.generated.md` and `claims.json` and runs the same checker on the draft; it never writes into the repo it describes. Manual only (`disable-model-invocation: true`), and the only tools it pre-approves are `node` scripts inside the skill folder. The model's steps: run gather, read the README, list claims with evidence, write `readme-architect-out/claims.json`, run the checker, show the output unchanged. It may not edit the claims or re-run to get a better result. `readme-architect-out/` is gitignored.
- `.claude/skills/readme-architect/scripts/gather.mjs`: `node gather.mjs --repo <dir> [--out <file>]` prints (or writes) JSON: detected kind and template, file list, `package.json` summary, up to 8 entry files (each cut at 20,000 characters), and what was skipped and why. It does not follow symlinks and does not run git. `.gitignore` lines starting with `!` are counted, not applied.
- `scripts/test-check.mjs` and `scripts/test-gather.mjs`: tests. `test-fixtures/`: a sample repo with known contents, a good and a bad README, and a good and a bad claims report.
- No `package.json` yet. Copy from `../midi-companion/` when needed (see "Reuse").

## Run and check
- Tests: `node scripts/test-check.mjs` and `node scripts/test-gather.mjs` (Node 24, no install). Checker by hand: `node .claude/skills/readme-architect/scripts/check-readme.mjs --repo test-fixtures/sample-repo --readme test-fixtures/readmes/bad.md --claims test-fixtures/claims/bad.json --template .claude/skills/readme-architect/templates/web-app.md`.
- Run the skill headless from this folder, in Git Bash: `MSYS_NO_PATHCONV=1 claude -p "/readme-architect check ../Portfolio" --add-dir ../Portfolio --permission-mode acceptEdits --output-format json > readme-architect-out/runN-result.json`. Without `MSYS_NO_PATHCONV=1`, Git Bash rewrites the leading `/` and the skill does not start. A run on a 55-claim README took about 90 seconds, and the result file estimates $0.87 at list price (default model `claude-opus-5-5`). That is an estimate, not a bill: `claude auth status` on 2026-10-22 showed sign-in through claude.ai on the TCSS 490 team plan, and no API key is set. The runs use the course allowance, and I do not know its limits, so do not repeat runs without a reason. Check the result file's `permission_denials`, then read `readme-architect-out/claims.json` yourself.
- Check what you build by running it, and say what you checked and what you could not. For a web page, drive headless Chrome as described in `../CLAUDE.md`, and look at a screenshot.
- If a model is called, try a few real inputs, record its actual output in the log (wrong answers too), and check its output with code where you can. Never say it works from one good run.

## Hard rules
- No keys, tokens or secrets in the repo, not even in the log or README. Use environment variables and a gitignored `.env`. My repos are public.
- Do not use a paid API key without asking me. Say what a run would cost first.
- No new dependency without showing me its license and asking.
- Do not commit, push, force-push or rewrite history unless I ask. No `Co-Authored-By` line or any Claude attribution in commit messages or pull requests.
- Lowercase file names for new files (`CLAUDE.md` and `README.md` keep their standard names).
- Before using any API field, file format, tool schema or library feature, print the raw data or the docs and show me.
- Start from a clean `git status` and tell me if it is not clean.

## The log protocol
- Add to `log.md` directly, in my first-person voice, matching the existing entries, and say what you added so I can review the diff. Never rewrite past entries without asking. List your own mistakes. Do not claim you tested something you did not.
- Keep the structure of `../midi-companion/log.md`, so the `/logs/` page script can read it: a title and tool lines, then `## What I set out to build`, then numbered `## N. Title (YYYY-MM-DD)` sections with bold labels (`**What I asked for**`, `**What changed**`, `**What I checked**`, `**Decisions**`), then `## Where AI misread me, or I had to correct course` and `## Decisions and abandoned ideas`. No other `##` headings: the script stops on them.
- For this artifact, also log what the model actually did on real inputs, and where it was wrong.

## Reuse from `../midi-companion/`
- `scripts/make-logs-page.mjs`, `log-summaries.mjs` and `logs-template.html` build a `/logs/` page from `log.md`, for the card's build-log button. They need somewhere to serve static files, so decide first where the page lives (a hosted site, GitHub Pages, or just link `log.md` on GitHub). If copied, change the template's title, intro and links, which are about MIDI Companion.
- The layout of that repo's `CLAUDE.md`, and its `scripts/test-*.mjs` approach (test logic that has no browser code in plain Node).
- Once a card links to a URL, never move or rename it.

## Open questions
- Name: Kevin confirmed `readme-architect` on 2026-10-22, and the folder is renamed. The GitHub repo is not created yet.
- Template sections: drafted by Claude on 2026-10-22 from the Portfolio and midi-companion READMEs. Kevin has not reviewed them yet. On 2026-10-22 Kevin let Claude change them, and `web-app.md` and `static-site.md` now use his own headings ("Highlights", "About", "Tech"). Not supported yet: a repo with `backend/` and `frontend/` folders and no top-level `package.json`, like Cardex and PokeGuess (README text read through the GitHub API, not cloned). `gather.mjs` and `checkCommands` read only the top-level `package.json`, so such a repo gets no template and its `npm run` commands would be flagged. That needs script changes, so it is left undone.
- Test repos Cardex and PokéGuess are at `github.com/ChristianDedios23/Cardex` and `github.com/ChristianDedios23/PokeGuess`. Kevin built both with a friend, and they live under the friend's account (Kevin's statement, 2026-10-22; not checked). If cloned, put each in its own new empty folder outside this repo, and do not run anything from inside them. Do not describe them on the card as Kevin's alone.
- Skill layout, read 2026-10-22 from `https://code.claude.com/docs/en/skills` and from real skills under `C:\Users\kevin\.claude\plugins\`: a folder `.claude/skills/<name>/` holding `SKILL.md` (YAML frontmatter, then Markdown instructions), plus optional `scripts/`, `references/`, `assets/` folders. All frontmatter fields are optional per the docs, `description` is recommended. Bundled scripts are run through `${CLAUDE_SKILL_DIR}`. `disable-model-invocation: true` makes it run only when I type `/readme-architect`. `allowed-tools` pre-approves tools for that turn. Also read from the same page (through a summarizing tool, so re-check a field before relying on it): arguments arrive as `$ARGUMENTS` (or `$0`, `$1`), and if the text has no placeholder Claude Code appends `ARGUMENTS: ...`; `allowed-tools` takes `Bash(<command> *)` patterns and may use `${CLAUDE_SKILL_DIR}`; a project skill's `allowed-tools` applies even in a folder you have not trusted, so keep it narrow; keep `SKILL.md` under 500 lines; a skill folder that did not exist when the session started needs a restart to load. Verified in the third headless run (no permission denials): `allowed-tools` as a YAML list with `Bash(node "${CLAUDE_SKILL_DIR}/scripts/*)` and `PowerShell(node "${CLAUDE_SKILL_DIR}/scripts/*)`. The script path has to be in double quotes in the command because the folder name has a space, and the quote is part of the rule. The model may use either shell tool on Windows. The unquoted form failed in the second run.
- Where does the card link? Leaning to the repo plus `log.md` on GitHub, since a skill has no website of its own. A demo video is optional.
- The spec says "You are free to extend Artifact 2 by putting a model inside it", but Kevin believes that is not allowed. It does not matter now because this is a new project. Ask an instructor if it ever does.
- No paid key is needed, so there is no instructor question on cost.

## Where the idea came from
- The portfolio's placeholder "README.md Architect" (see `../Portfolio/docs/ARTIFACT_PLANS.md`, which lists other ideas too). On 2026-10-22 it was sharpened: the checker is the core, since asking Claude to write a README can already be done without this project. The value is per-claim evidence that code verifies, secrets left out of what the script hands the model (not a hard block, see above), and the same README structure every time.
- Dropped: a MIDI practice coach (builds on Artifact 2) and a log-entry drafter (the course says my logs must be in my words).
