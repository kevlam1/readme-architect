# Build log: Artifact 3 (readme-architect)

**AI:** Claude Code | **Editor:** IntelliJ IDEA Ultimate | **Host:** GitHub only (public repo `kevlam1/readme-architect`, no hosting)
**Stack:** A Claude Code skill (`SKILL.md`) plus plain Node scripts, no dependencies (Node 24).

---

## What I set out to build

Artifact 3 is "AI inside it": a model has to do part of the work every time it runs. I have until Sunday 25 October. I built readme-architect, a Claude Code skill plus plain Node scripts that fact-checks a README against the project's real files, and can also draft one. The model lists each claim and gives evidence (a file and a word-for-word quote), and scripts check that the evidence exists.

I started with no idea and the placeholder name `temporaryname`. I rewrote this section and the two lines at the top on 2026-10-22, once the project was built. The numbered entries below are left as they were, so they show what I knew at each point.

---

## 1. Setting up the folder and the Claude files (2026-10-22)

**What I asked for**
- Asked Claude Code to make Artifact 3's folder and all the setup it needs, the same way my Portfolio's and MIDI Companion's were set up, using what it knows from the shared `CLAUDE.md`, the Portfolio and MIDI Companion. I have no idea for the artifact yet, so the name is `temporaryname`.
- Asked whether there is anything else I should consider before it continues.

**What changed**
- Claude read the Portfolio's notes and found a placeholder idea for Artifact 3 and its due date. Then it read the real Artifact 3 page (`Unit 3/Artifact 3- AI Inside It.pdf`), which I had put in the course folder that day. I had only told it to look in the Portfolio folder, and it said so before it opened the PDF.
- Created `temporaryname/` with `CLAUDE.md`, `log.md` (this file), `README.md`, `docs/todo.md` and a `.gitignore`, and ran `git init` on the `main` branch. There is no remote and nothing is committed.
- `CLAUDE.md` follows the layout of my Portfolio's (read first, what the project is, files, run and check, hard rules, the log protocol). It adds what the Artifact 3 page says: due Sunday 25 October at 11:59 PM, the shapes that fit, the Claude API costing money so I have to ask an instructor before using a paid key, and a section that has to say what the model does and what the code checks.
- The lessons from MIDI Companion went into the repo's rules (no secrets, check by running it, never say a test passed that was not run), plus a "First session" list: choose the shape, pick the real name before creating the GitHub repo, then fill in the model's job.
- No code, no GitHub repo and no hosting yet.

**What I checked**
- `CLAUDE.md` is 73 lines, well under the 200 I set as the limit. No file has an email, phone number or IP address in it.
- `.gitignore` really ignores `.env`, `node_modules/`, `dist/`, `scratch*`, `CLAUDE.local.md`, `.claude/settings.local.json`, `.idea/` and `*.log`, and does not ignore `.env.example` or the files I want to keep. Claude tested this with `git check-ignore`.
- Claude ran a throwaway copy of MIDI Companion's build-log page script on this log (in Temp, deleted afterward). It built a page with every word of this log on it, so the log's structure works for a `/logs/` page later.
- Not checked: anything about the idea itself, since there isn't one yet.

**Decisions**
- Named the folder `temporaryname` until the idea is chosen.
- Not creating the GitHub repo yet. The repo name and URL go on the portfolio card and can't change afterward, so the name has to be picked first.

---

## 2. Choosing the idea (2026-10-22)

**What I asked for**
- Told Claude I was lost after Artifact 2 and asked for ideas.
- Asked in plain words what README Architect does, and why that beats just telling Claude or another AI to update the README.
- Asked what the "fact-checker" and "original" versions were. I liked both. I asked for the generating part to follow a README format, because READMEs I got from Claude and ChatGPT before were all structured differently, and said the format might vary by kind of project.
- Gave Claude permission to update `CLAUDE.md` and `log.md` as it sees fit during our chats.

**What changed**
- Claude read the ideas in `Portfolio/docs/ARTIFACT_PLANS.md` and offered three: README Architect with a checker script, a MIDI practice coach, and a log-entry drafter. It advised against the drafter because my logs have to be in my words.
- I said I'm not allowed to add AI to an old artifact and resubmit it. Claude re-read the spec with `pdftotext`, and it says "You are free to extend Artifact 2 by putting a model inside it." So what I said and what the PDF says disagree. It doesn't matter for this project, and I'll ask an instructor if it ever does.
- Claude was honest that it is basically a README maker. The benefit over a plain request is per-claim evidence that a script verifies, secrets filtered out before the model reads anything, and the same process every time. The limit is that the checker proves the evidence exists, not that it supports the claim.
- The direction: check mode first (the model pulls out each claim in an existing README and finds its evidence, and a script verifies it), then generate mode (the model writes a README from a template, and the same checker runs on it). Generate mode is cut first if time runs short. The template is picked by kind of project, detected by code.
- Claude filled in the model/code split, the status and the open questions in `CLAUDE.md`, and corrected a line that said the spec "asks for" that split (it says it is "a good idea").
- Nothing is built. No repo, no rename, no code.

**What I checked**
- Claude read the READMEs and file lists of midi-companion and the Portfolio (read-only). They are structured differently from each other, which is the problem the template is for. It compared only the Portfolio's project-structure tree to the tracked files, by eye, and found a match. It did not check any README claim against the code, and its midi-companion file listing was cut at 60 lines. So I have found no errors, but I have not shown the READMEs are accurate.
- Re-read the spec text (`pdftotext`) to check what it says about extending Artifact 2.
- Not checked: Cardex and PokéGuess (they are not in the course folder), how a Claude Code skill file is laid out, and whether the checker will catch anything real.

**Decisions**
- Going with the README fact-checker and generator. Leaning to the name `readme-architect`, but I have not confirmed it, so the folder is not renamed and there is no GitHub repo.
- No paid API key and no new dependency: it runs on Claude Code, with plain Node scripts.
- The card will probably link the repo and `log.md` on GitHub, since a skill has no website.

---

## 3. Name, test repos, and whether it is a website (2026-10-22)

**What I asked for**
- Asked whether this would be a website, whether it should be, and whether people download it.
- Said `readme-architect` is fine as the name, and that Claude can draft the README templates ("sure, I guess").
- Gave Claude the links to Cardex and PokeGuess, which I built with a friend. They are under the friend's GitHub account, not mine.
- Told Claude to update `CLAUDE.md` and `log.md` as it sees fit.

**What changed**
- Claude said it should not be a website. It is a tool you run inside Claude Code against a project folder, and the checker half is plain Node scripts. A page that calls a model would need the paid API, hosting and a stored key, and would pull the project away from the model/code split the course grades. People would most likely copy the skill folder from the GitHub repo into `.claude/skills/`. Claude said it had not verified that.
- Claude noticed the two repo links were under a different account and asked about it, because my notes call them "my repos".
- `CLAUDE.md` now says the name is final, lists the two test repos, and says not to describe them on the card as mine alone. I did not rewrite entry 2, which still says the name wasn't confirmed.

**What I checked**
- Nothing new in the code. Claude has not opened Cardex or PokeGuess, and has not checked where a skill file goes. Both are next, and the skill format gets printed from the docs before any skill file is written.
- Claude did not check that I built the repos with a friend. That is what I told it.

**Decisions**
- The name `readme-architect` is final. The folder is not renamed and there is no GitHub repo yet. Rename first, then create the repo.
- No website. The card will link the repo and `log.md` on GitHub, with an optional short demo video of a real report.
- When testing on Cardex and PokeGuess, clone each into its own new empty folder outside this repo and do not run anything from inside it.

---

## 4. Reading how a Claude Code skill is laid out (2026-10-22)

**What I asked for**
- Said to continue, and asked Claude to rename `temporaryname` to the real name.

**What changed**
- Claude did not rename the folder. This session is running inside it, so renaming it would leave the session pointing at a folder that no longer exists. It will be done between sessions, before the GitHub repo exists.
- Claude read real skill files already on my machine (`example-skill` and `skill-development` under `.claude/plugins/`) and the official skills page (`code.claude.com/docs/en/skills`), instead of answering from memory. The format: a folder `.claude/skills/<name>/` with a `SKILL.md` (frontmatter, then instructions) and optional `scripts/`, `references/` and `assets/` folders. Scripts run through `${CLAUDE_SKILL_DIR}`. `disable-model-invocation: true` makes it run only when I type the command.
- That changed the plan: the scripts and templates will live inside the skill folder (`.claude/skills/readme-architect/`), not at the repo root, so the skill can be copied as one folder. `CLAUDE.md` is updated to match.
- No skill file or script has been written yet.

**What I checked**
- The `SKILL.md` format and the `name` and `description` fields match in both sources. The fuller field list came from the docs page through a summarizing tool, and its last 12,696 characters were not read, so a field gets re-checked in the docs before I use it.
- Not checked: that a skill in `.claude/skills/` actually loads and runs in my setup. That is the first test once there is a skill to run.

**Decisions**
- Scripts and templates go inside the skill folder.
- Run it only when I type the command (`disable-model-invocation: true`), so it never runs on its own. This still needs to be confirmed when the skill is written.

---

## 5. Drafting the README templates (2026-10-22)

**What I asked for**
- Said to continue. Earlier I had said Claude could draft the templates, and that the template might differ by kind of project.

**What changed**
- Claude wrote four templates in `.claude/skills/readme-architect/templates/`: `web-app.md` (modeled on midi-companion), `static-site.md` (modeled on the Portfolio), `library-cli.md` and `claude-skill.md` (this project).
- Each one is a skeleton README: a fixed list of `##` headings in a fixed order, with a comment under each heading saying what evidence that section needs. Sections that don't apply to every project are marked `optional`.
- The heading names are the same across kinds ("What it does", "Features", "Built with", "Run it locally", "Credits"), which is what stops each README coming out structured differently. It also means they differ from my existing READMEs, which use "Highlights", "About" and "Tech".

**What I checked**
- Nothing about whether the templates work. No script reads them yet, and I have not reviewed them.
- The section lists come from reading the Portfolio and midi-companion READMEs, not from testing against any repo. The detection rule for each kind (for example "package.json and index.html means web app") is a first guess and is not written in code.

**Decisions**
- Four kinds for now. A repo that fits none of them is reported as "kind not recognized", and I can override the pick. Another kind is added when a real repo needs one.
- The templates stay as plain Markdown, so I can edit them without touching code.

---

## 6. The fixture repo and the checker (2026-10-22)

**What I asked for**
- Said to continue.

**What changed**
- Claude made a tiny sample project in `test-fixtures/sample-repo/` (a `package.json`, an `index.html` and a `main.js`) whose contents are known exactly: two npm scripts (`dev`, `build`), a localStorage key, nanoid for ids, and no dark mode, no test script and no seed script.
- It made a good README and a bad README for that project, and a good and a bad claims report. The bad ones contain mistakes planted on purpose: a README claim with no evidence, a quote that isn't in the file, a cited file that doesn't exist, `npm run test` with no such script, `node scripts/seed.mjs` with no such file, a missing section, an extra section and a section out of order.
- It wrote the checker, `.claude/skills/readme-architect/scripts/check-readme.mjs`, in plain Node with no dependencies. Given a repo, a README and the model's claims report, it checks that every cited file exists, every quote is in that file (extra spaces and line breaks ignored), the `npm run` and `node` commands in the README's code exist, the headings match a template, and no secret is in the README or the report. Its output separates "README problem" from "model problem", and it never prints a secret's value.
- It wrote `scripts/test-check.mjs` with 29 tests.

**What I checked**
- Ran `node scripts/test-check.mjs`: 29 passed. All passed on the first run, so Claude also ran the checker by hand on the bad fixture and read its report. It matched what was planted: 1 unsupported claim, 2 bad pieces of evidence, 2 missing commands, 1 wildcard command it could not check, and 3 structure warnings.
- Checked that the tests left no temporary folders in Temp. I did not check that the test harness can show a failure, since nothing failed.
- Not checked: the model has not run on anything yet. The checker has only seen the fixture. It has not seen a real README or a real model's output, and real ones will be messier.

**Decisions**
- Structure problems (missing, extra or out-of-order sections) are only warnings unless I pass `--strict-structure`. My existing READMEs came before the templates, so they would all fail, and the claim checks matter more in check mode. Generate mode should use strict.
- The checker can only check the claims the model gives it. If the model skips a claim in the README (like "with dark mode" in the bad README's first line), nothing flags it. I need to test how many claims the model misses on a real README, and say so in the README.
- It cannot yet tell "the model made it up" from "my gather script missed a real file", because there is no gather script. That comes next.

---

## 7. The gather script (2026-10-22)

**What I asked for**
- Said to continue.

**What changed**
- Claude wrote `.claude/skills/readme-architect/scripts/gather.mjs`. Given a repo folder it prints JSON for the model: what kind of project it is (and so which template), every file with its size, a summary of `package.json`, up to eight entry files, and a list of what it skipped and why.
- It leaves out `.env*`, key files, `node_modules`, `.git`, anything my `.gitignore` ignores, and symlinks. If an entry file or the `package.json` summary looks like it holds a secret, it is withheld and only the line numbers are reported. It reads the files itself and does not run git, so a cloned repo can't make it run anything.
- Claude also changed the checker: with `--gathered gather.json`, a cited file that exists on disk but that gather never listed is tagged `[gather script or process]` instead of `[model]`. That is how I tell "the model made it up" from "my script missed it".
- Wrote `scripts/test-gather.mjs` with 11 tests. They build throwaway repos in Temp with a fake `.env`, a fake key file and a made-up token built at runtime, so no secret-looking text is stored in the repo.

**What I checked**
- Ran both test files: 29 and 11 passed. Then Claude ran gather on the real midi-companion repo and read the result instead of trusting the tests. It said web-app (right, `package.json` plus `index.html`), listed 97 files, skipped `.git/`, `node_modules/`, `dist/`, `songs/` and `.idea/` (all correct against that repo's `.gitignore`), and found `README.md`.
- That run showed a limit the tests did not: `src/main.ts` is cut at 20,000 characters, so the model will have to open the other source files itself to quote them. Gather can't hand over the whole project.
- Not checked: that a permission rule stops Claude Code from opening a `.env` itself, and symlink skipping (creating symlinks on Windows needs extra permission, so it has no test). Gather only handles simple `.gitignore` lines, so a repo with `!` rules may list files git would ignore.

**Decisions**
- Gather does its own folder walk and does not call git, because I will run it on repos I did not write.
- Kept the template pick inside gather (a few plain rules) so the model never chooses the structure. An unrecognized repo gets `kind: unknown` and no template.

---

## 8. Writing the skill's instructions (2026-10-22)

**What I asked for**
- Said to continue.

**What changed**
- Before writing the skill file, Claude went back to the official skills page for the parts it had not read: how arguments reach a skill, how `allowed-tools` is written, and the end of the page. Two things from it shaped the file. A project skill's `allowed-tools` applies even in a folder I have not trusted, so the skill only pre-approves `node` scripts inside its own folder. And the page says to keep `SKILL.md` under 500 lines.
- Claude wrote `.claude/skills/readme-architect/SKILL.md`. It only does check mode. Typing `/readme-architect check <folder>` runs it, and it never runs on its own. The model's job is written as steps: run gather, read the README, list each claim with a file and an exact quote copied from the file (or an empty list when there is none), write `claims.json`, run the checker, and show the checker's output unchanged. It is told not to edit the claims after the checker runs, not to re-run to get a better result, and not to say the README is accurate.
- Generate mode is not built. The skill says so and stops if asked.
- Gather got an `--out <file>` option, so the skill never needs a shell redirect. The output folder `readme-architect-out/` is in `.gitignore`.

**What I checked**
- Ran all tests: 29 checker tests and 12 gather tests pass. `git check-ignore` confirms the output folder is ignored.
- Ran `claude plugin validate .claude/skills`, which Claude Code provides: "Validation passed". That only shows the frontmatter parses.
- Not checked: that the skill loads and runs. A skills folder that did not exist when a session started needs a restart to load, so it can't run in this session. Also not checked: that the `Bash(node ${CLAUDE_SKILL_DIR}/scripts/*)` rule matches. The docs show the same idea for a script path and for `python3 *`, but not this exact form, so it may still prompt me. And the model has still not run on any README.

**Decisions**
- First real run goes on one README, with the result logged as it comes, including wrong answers. I will not tune the instructions to make a first run look better and log only the second.
- Output goes to `readme-architect-out/` in whatever folder the command runs from, not into the repo being checked.

---

## 9. The first real run: check mode on the Portfolio README (2026-10-22)

**What I asked for**
- Said yes to running it on the Portfolio README, and asked whether Claude would run it or I would. Claude ran it, as a headless `claude -p` session from this folder. It took three tries.

**What changed**
- **Try 1 did nothing.** Git Bash rewrote the `/` in `/readme-architect` into `C:/Program Files/Git/readme-architect`, so the model got plain text and no skill started. The model said so and refused to pretend, which was right. My mistake. Fixed with `MSYS_NO_PATHCONV=1`.
- **Try 2 started the skill and stopped at the first command.** The model used the PowerShell tool, and `SKILL.md` only pre-approved a Bash rule. My command examples also had the script path unquoted, and the folder name `TCSS 490` has a space. Two bugs of mine in `SKILL.md`. The model followed the "show the error and stop" rule and did not work around it.
- Claude read the permissions docs for the real syntax: PowerShell has its own `PowerShell(...)` rules, and a rule matches the command text the model writes, so the quote has to be in the rule. It quoted the script paths and pre-approved both shells. Validation still passed.
- **Try 3 ran all the way through** (10 turns, 90 seconds, no permission denials). Gather classed Portfolio as a static site and listed 19 files. The model listed 55 claims and wrote `claims.json`. The checker's report: 52 supported, 3 unsupported, 0 with bad evidence, plus 4 structure warnings (my README uses "About" and "Tech" where the template says "What it does" and "Built with").

**What I checked**
- Re-ran the checker myself on the model's `claims.json` with the same arguments. The output matches what the model showed, so it did show it unchanged.
- Nothing else in this repo changed during the run except my own `SKILL.md` edit, and Portfolio was not changed by it (its `docs/TODO.md` shows modified, but dated 2026-10-16).
- **No invented evidence this run.** All 52 quotes exist word for word in the files cited, which is what the checker proves.
- **Wrong answer 1:** for "index.html has all its CSS in one style element" the model gave no evidence, but it is true: `index.html` has exactly one line with `<style`. A real miss, and the checker can't catch it, since it only checks evidence the model hands over.
- **Not sure:** "index.html has its scripts at the bottom" got no evidence. The first `<script>` is on line 1590 of 2729 and `</body>` is the last line. I did not check whether the markup ends before line 1590, so I can't call it right or wrong.
- **Defensible:** "every animation turns off for reduced-motion visitors" got no evidence. `index.html` mentions `prefers-reduced-motion` on 10 lines, but I can't tell that it covers every animation, and neither can a single quote.
- **A bigger problem: 30 of the 55 claims are backed only by `CLAUDE.md`, `log.md` or `docs/`**, my own project notes, and only 16 by code files (6 by both). Those notes can simply repeat the README, so "supported" is weaker than it sounds. Some claims can't be shown in code at all (the course name, "built with help from ChatGPT"), but others can: "smooth wheel scrolling uses Lenis" cites a notes file even though `index.html` loads Lenis, and the model cited that code for a different claim.
- **Weak quotes:** "CLAUDE.md holds project rules" cites only the heading `## Hard rules`. "images/ holds the card images" cites image paths mentioned in `index.html`, which doesn't show the files are in that folder.
- **Stale claim:** "tested on a real phone" is backed by a real quote from `log.md`, but `log.md` also says in several places that the later redesign and opening animation were not tested on a real phone. The model said this in its closing message, not in the report. I checked `log.md` and it is right.
- I did not count the claims the model skipped. I read through the README and did not spot any, but that is not a systematic count.
- Cost and time, from the run's own result file: try 3 used about $0.87 and 90 seconds, tries 1 and 2 about $0.20 and $0.18. These are list-price figures for `claude-opus-5-5`, the default model. I don't know how they count against my Claude Code access.

**Decisions**
- The report must separate "backed by code" from "backed only by notes". Otherwise "52 supported" overstates it. Next change to the checker.
- This is one run on one README. It says nothing yet about how often the model misses claims or invents evidence.

---

## 10. Telling code evidence from notes evidence (2026-10-22)

**What I asked for**
- Said to continue with what needed doing. The next item was the fix for the biggest problem in entry 9: "52 supported" included 30 claims backed only by my own notes.

**What changed**
- The checker now sorts each claim by where its evidence is. If at least one cited file is not a markdown or text file, the claim is "supported by code". If every cited file is `.md`, `.markdown`, `.txt` or `.rst`, it is "only by notes". The report prints a count for each and lists the notes-only claims with their files. Notes-only is a warning and does not fail the run, but the result line now says how many claims rest on notes only, so a PASS can't hide them.
- A claim that cites the README being checked is now bad evidence, because a README can't prove itself.
- `SKILL.md` now tells the model to prefer code over notes, to use notes only for facts the code can't show (course context, who helped), and never to cite the README.
- Four new tests (33 in total for the checker).

**What I checked**
- All tests pass: 33 for the checker and 12 for gather. The skill still validates.
- Replayed the model's claims from the Portfolio run through the new checker. No new model run was needed, since the claims were already on disk. It now reports 55 claims: 22 supported by code, 30 only by notes, 3 unsupported, 0 bad evidence. That matches the counts I made by hand in entry 9. I saved those run files as `run3-claims.json` and `run3-gather.json` so the next run doesn't overwrite them.
- Not checked: the new `SKILL.md` wording has not been run, so I don't know if the model will actually choose code over notes. That is a question for the next real run.
- This only tells code from notes by file extension. A `.js` file that just repeats the README would still count as code. It does not read what the evidence says.

**Decisions**
- Notes-only stays a warning, not a failure. Some README claims (the course name, who helped) can only be backed by notes.
- Next: run it on midi-companion's README, which makes many more specific claims, and see whether the model uses more code evidence now.

---

## 11. Second real run: check mode on the midi-companion README (2026-10-22)

**What I asked for**
- Asked how to test the check on midi-companion, then whether Claude would run it for me. Claude explained the command first, then ran it as one headless `claude -p` session from this folder, in a new session so the skill was loaded.

**What changed**
- Nothing in the code for the run itself. Afterwards, two edits to `SKILL.md`: step 7 now says to run the checker as one command with nothing added after it, and step 5 now has two new evidence rules (see Decisions).

**What I checked**
- The run finished (42 turns, about 4 minutes). The result file estimates $1.85 at list price, about double the Portfolio run. Again an estimate, not a bill, and I don't know how it counts against my Claude Code access.
- The checker's report: 134 claims, 121 supported by code, 4 only by notes, 9 unsupported, 0 bad evidence. Structure warnings: my README uses "Highlights" where the template has "What it does" and "Features". That is the heading mismatch I already knew about.
- The code-versus-notes change from entry 10 worked this time: 121 of 134 claims are backed by code, against 22 of 55 for Portfolio. I don't know how much of that is the new `SKILL.md` wording and how much is that this README makes more specific claims.
- **A permission denial.** The model added `; echo "exit $?"` after the checker command, and the tool refused it because the pre-approval did not cover the longer command. The model then ran the checker without the suffix. So the checker ran once for real, and the denial did not change the result, but it shows the model can improvise the command.
- **Weak evidence the checker passed.** "Dotted guides show while dragging the control bar" cites a comment about "a thin orange strip", which does not show "dotted". The model said so itself. The checker can't catch it: it only proves the quote exists.
- **A miss by the model.** "It uses no UI framework" got no evidence, but `package.json` lists only `tone`, `@tonejs/midi`, `typescript` and `vite`, so there was something to cite.
- **Correctly unsupported:** "Running locally needs Node.js; built on Node 24" appears only in the README itself. I grepped `package.json` and found no Node version.
- **Could not tell:** whether "sustain pedal marks inside a song are ignored" and the speaker-delay claim are right. `src/main.ts` handles a MIDI pedal and a space-bar pedal, and the code reads `baseLatency` and `outputLatency`, but I did not trace either claim through the code.
- **Not checked:** the other five unsupported claims, the "See-through header" and "font files" citations the model called weak, and most of the 121 supported claims. This is a spot check, not a review of the 134.
- Some quotes came from Grep output, not from the Read tool as the skill says. The quotes still exist in the files.
- This run overwrote `claims.json` and `gather.json` from the Portfolio run. The Portfolio copies are still saved as `run3-claims.json` and `run3-gather.json`. The folder is gitignored.

**Decisions**
- Fix the denial by tightening `SKILL.md`, not by widening the permission rule.
- Two new evidence rules in `SKILL.md`: a quote must show the specific thing claimed (a nearby quote is not enough, give none), and for "no X" claims the model should cite the dependency list. Neither has been run yet, so I don't know if the model follows them. That needs another run, which costs about $1.85 at list price, so I won't repeat it without a reason.
- Next: decide whether there is time for generate mode, or whether to spend the time on the README, the card and the demo. The due date is Sunday, October 25.

---

## 12. Generate mode (2026-10-22)

**What I asked for**
- Claude suggested skipping generate mode to save time for the README, the card and the demo. I decided to add it anyway ("add generate").

**What changed**
- Only `SKILL.md`. It now has a "Generate mode" section: gather, pick the template, write a draft to `readme-architect-out/README.generated.md` with the template's headings in order, give every factual sentence evidence, write `Not found in the repo.` where there is none, list the claims in `claims.json`, and run the same checker on the draft. The draft never goes into the repo it describes. The model may not use the repo's existing README as a source. No checker or gather changes, so the 33 and 12 tests are untouched.
- The description and argument hint now mention both modes.

**What I checked**
- One real run on the fixture repo (`test-fixtures/sample-repo`: `index.html`, `main.js`, `package.json`): 10 turns, 32 seconds, no permission denials, about $0.31 at list price (an estimate). The checker said 13 claims, 13 supported by code, 0 unsupported, PASS.
- I read the draft against the three fixture files myself. Every sentence is true of them. The headings match the template's order, "Credits" says `Not found in the repo.` (the fixture has no license), and the optional "Known limits" was left out. The `npm run` commands match `package.json`.
- **One weak spot:** "Loads saved todos from localStorage" and "Adds a todo from a piece of text" are true of the functions `loadTodos` and `addTodo`, but nothing in the fixture calls them, so they are not features the page has. The model flagged this itself for `addTodo` and kept the wording to what the function does. The checker can't see this.
- **Not checked:** generate mode on a real project, a larger README, or a repo with secrets. One small run says nothing about how often it invents things. The rule against using the existing README as a source is only an instruction. The checker would not catch it if the model cited `README.md` of the repo, because it only rejects the file under test, which is the draft here.

**Decisions**
- Draft goes to the output folder, never over a real README. I copy from it by hand if I like it.
- Next: run generate on midi-companion (about $1 or more) to compare its draft with my README, or stop here and move to the README, the card and the demo.

---

## 13. Second midi-companion run, and reading the unsupported claims (2026-10-22)

**What I asked for**
- Asked how to test the slash command on midi-companion. I pasted a Git Bash command into PowerShell and got an error, so I asked Claude to run it. Claude ran it through its own Bash tool. Then I asked it to go through the unsupported claims, and whether other users would have to do the same.

**What changed**
- Only `SKILL.md`, step 5, the evidence rules. The notes-file rule is wider now: if the model looked in the code and found nothing, it should look in the notes files (`CLAUDE.md`, `log.md`) before leaving the evidence empty. Not re-run yet, so I don't know if the model follows it.

**What I checked**
- The run finished: 47 turns, about 5 minutes, no permission denials, empty stderr. The result file estimates $2.11 at list price (an estimate, not a bill), more than the $1.85 of entry 11.
- The checker's report: 188 claims, 167 supported by code, 4 only by notes, 17 unsupported, 0 bad evidence. Entry 11 had 134 claims and 9 unsupported, so the model listed more claims this time. I don't know why: the README may have changed, or the model split sentences more finely.
- The "no UI framework" miss from entry 11 is fixed: that claim now cites the dependency list in `package.json`.
- The model told me about five weak passes. "Dotted guides" is the same one as entry 11, so the rule I added there did not stop it. The others: "everything is remembered" cites one `setItem` line, "see-through" cites `backdrop-filter`, "needs Node.js" cites the `build` script, and "a track switched off leaves the falling notes, the sound, and what Learn waits for" only has a quote about the falling notes.
- I searched the code and notes for the 17 unsupported claims. This was text searches, not reading whole files.
  - 7 are stated in my `CLAUDE.md` or `log.md` (Synthesia-style, port 5173, `--host`, http blocks the folder picker, copyrighted arrangements, speaker delay not reported, sync only tested on my PC). The model left them empty. `SKILL.md` told it to use notes only for facts the code cannot show, and it treated the port and the flag as code facts. That is the reason for the edit above.
  - 3 have real code the model did not cite (the phone layout media queries, the metronome's Free mode, the drawing's binary search).
  - 4 I found no support for (Node 24, sustain marks inside a song being ignored, crossing hands needing a track switch, and Black and Charcoal being for light backgrounds).
  - 3 I did not check (the other hand lighting its keys, tooltips in the theme color, and the keys working without Web MIDI).
- Two README lines may be worth a look: the Black and Charcoal sentence, since `colors.ts` says those colors are left out of the Theme row because they are too dark for an accent on a dark page, which is not the same thing, and "speaker delay isn't corrected for", since `piano.ts` does use `baseLatency` (20 ms if missing). I have not traced either one.
- I told Claude my README is true because I finished the project last week. That is my statement. The checker only shows that evidence exists, and it did not confirm it.
- **Not checked:** most of the 167 supported claims, and whether the model missed claims that are in the README.
- The model broke two rules in `SKILL.md`: some quotes came from Grep output, not the Read tool, and the run overwrote `claims.json` and `gather.json` from the earlier run. Those files are gitignored.

**Decisions**
- Other users will still have to read the report. The checker can't tell whether a quote supports its claim. What it saves them is reading 17 flagged claims instead of 188. The README has to say so.
- Not changing the checker to add a separate "can't be verified from a repo" group (opinions, "tested on my PC") for now. It is a bigger change and the due date is Sunday, October 25.
- Not repeating the run to test the new `SKILL.md` rule, because each run costs about $2 at list price and I don't know my allowance. I will only run it again if I have a reason.
- Next: the README, the card and the demo.

---

## 14. Updating the templates to my headings (2026-10-22)

**What I asked for**
- I said Claude could update the templates and add good changes, even from Cardex and PokeGuess, and to try sub-templates for projects that don't fit but a similar one would, or skip that if it was too much.

**What changed**
- `web-app.md` now uses my midi-companion headings and order: Highlights, Known limits (optional), Run it locally, Deploy (optional, new), Built with, Credits. Its comments also say that a Node version needs an `engines` line or a notes file, a dev server address needs a notes file or config, and environment variable names must come from the code, because gather skips `.env` files.
- `static-site.md` now uses my Portfolio headings: About, Features, Tech, Project structure, Run it locally, Deploy (optional), Credits.
- `claude-skill.md` now follows this repo's own README: What it does, What the model does and what the code checks, What it cannot do (optional), Try it, then Built with, Project structure and Credits, all optional. I told Claude to choose, and it changed the template to fit the README, since this README is the only skill example I have.
- `library-cli.md` is unchanged. I have no README of that kind to copy.
- `test-fixtures/templates/web-app.md` is a copy of the old template, and `scripts/test-check.mjs` now reads that copy, so changing a real template can't break a test.
- `CLAUDE.md` (the template line and the open question) and `README.md` (one new limit) describe the new state.

**What I checked**
- Both test files pass (33 and 12), after the change.
- With the checker's own structure function: midi-companion's README against `web-app.md` and the Portfolio README against `static-site.md` both come out with nothing missing, extra or out of order. The old templates did not.
- I read the Cardex and PokeGuess READMEs through the GitHub API (not cloned, nothing run). Both are full-stack apps with `backend/` and `frontend/` folders, and both have Deploy or Deployment sections. That is where the optional Deploy section came from.
- **Not checked:** how the model uses the new headings in a real run. I did not re-run the skill.
- My own README did not match the old `claude-skill.md` (missing "How to use it", "Project structure", "Credits"; extra "What it cannot do", "Try it", "What I ran it on", "Built with"), so I had the template changed. Against the new one, only "What I ran it on" is extra, which is about this project's own runs and can't be in a template.

**Decisions**
- Skipped the sub-template idea (for example a full-stack kind). I read `gather.mjs` and `checkCommands`: both look only at the top-level `package.json`, so a repo like Cardex gets `kind: unknown` and no template, and its `npm run` commands would be flagged. A full-stack template needs changes in both scripts and in their tests. That is too much before Sunday, so it is written down as a limit.
- Both of my READMEs call the first section by different names ("Highlights" and "About", "Built with" and "Tech"). The templates follow each one, so the two kinds are not consistent with each other. That is my inconsistency, not the templates'.

---

## 15. Commits, the GitHub repo and the card plan (2026-10-22)

**What I asked for**
- After the templates, I said the folder was renamed already and asked Claude to add multiple commits, because one would look odd. I made the empty GitHub repo myself (`kevlam1/readme-architect`) and gave Claude the link. Then I asked for the build log and the card plan: the artifact link is the repo, the build log would live on the portfolio, and the demo would be an animated illustration made by Claude. Claude pointed out that the log is in this repo, and I chose option 1 (link to `log.md` on GitHub). Last, I asked for a prompt for the Portfolio session and for this log entry.

**What changed**
- `README.md`: the placeholder is now a real README (what it does, the model/code split, what it cannot do, how to try it, what I ran it on). `docs/todo.md`: rewritten from the "choose the idea" list to the real open items. I did not log either change before this entry.
- Eight commits on `main`, all by me as the git user and with no attribution line: setup; templates; checker with tests and fixtures; gather script; skill instructions; README and log; the `CLAUDE.md` and todo fix after the rename; and the card links decision.
- `CLAUDE.md` and `docs/todo.md` now record the card links and the demo rules.

**What I checked**
- Before the first commit, Claude searched the 22 files for emails, addresses and key patterns. It found only the made-up test keys (built in pieces) and the checker's own pattern list. `readme-architect-out/` stayed out because it is gitignored.
- The repo was public and empty before the push. After a plain push (no force), GitHub's `main` had the same hash as mine, its tree listed the 8 top-level items, and its commit list showed the messages. GitHub's "contents" endpoint kept saying the repo was empty, which I think was a cached answer. I did not open the repo page in a browser.
- The repo link and the `log.md` link both returned HTTP 200 (a request from a script, not a browser).
- **Not checked:** the portfolio's card code, which I have not touched, and the card itself, which does not exist yet. Nothing in the card has been seen on a screen.

**Decisions**
- Card links: the artifact link is the repo, and the build-log button is `log.md` on GitHub. I did not make a `/logs/` page, so the MIDI Companion scripts are not copied. A portfolio copy of the log would go stale after any later edit. I may still make one at the end if there is time and I want it to match the other cards.
- The demo is an animated illustration shown on the portfolio. It has to say it is an illustration, not a real run, and use only real numbers from `run6-result.json` (188 claims, 167 by code, 4 only by notes, 17 unsupported).
- The reflection on the card is mine to write. Claude is not to write it.
- Commit dates are all today. Claude split the history by what each part does and did not backdate anything, because it was one session.
- Next: fill in the card from a session started in the Portfolio folder (Claude wrote me a prompt for it), then the illustration.

---

## 16. Cleaning up stale text (2026-10-22)

**What I asked for**
- Asked why the log still said `temporaryname`, and told Claude to go through the log and the other files in the repo for anything out of date.

**What changed**
- `log.md`: the two lines at the top (host and stack) and the "What I set out to build" section were rewritten to describe the finished project, with a line saying so. Entries 1 to 12 are untouched on purpose: they say `temporaryname` because that was the folder's name when I wrote them, and changing them would make the log say things that did not happen. The entry 13 title said "Third midi-companion run" and is now "Second" (see below).
- `CLAUDE.md`: "nothing built yet" in the model/code section, the `.gitignore` list (it was missing `*.log`, `*.local` and `readme-architect-out/`), the "First session" heading (marked done), the `/logs/` page scripts (marked not used here), and the template-review line.
- `docs/todo.md`: the template review item, the commit count, and a duplicate card item.

**What I checked**
- I searched all files except the saved runs and the fixtures for old phrases ("temporaryname", "not decided", "not started", "not renamed", "placeholder", "has not reviewed"). The ones left in `log.md` entries 1 to 12 are history. The `temporaryname` in `scripts/test-check.mjs` is a made-up quote used by a test, and the word "placeholder" in `check-readme.mjs` is about command placeholders, not this project. Both are fine.
- I checked the saved result files: run 4 was midi-companion (134 claims) and run 6 was midi-companion (188 claims). So entry 13 was the second midi-companion run, not the third.
- `README.md` and `SKILL.md` had nothing out of date that I could find. I read the README's claims against what I know of the repo, but I did not run the checker on it.
- **Not checked:** the "Not yet read" line in `CLAUDE.md` about "Tools on Top of LLMs" and the other Unit 3 PDFs. Only I know whether I have read them.

**Decisions**
- Past entries stay as written. Only the summary parts that describe the project as it is now were rewritten.

---

## 17. Checking the finished artifact from a clean clone (2026-10-22)

**What I asked for**
- Asked Claude to check again whether the artifact is good or still needs updates.

**What changed**
- `README.md` only. The example command now starts with `mkdir -p readme-architect-out` and uses `../your-project` as a placeholder. A sentence says I have only run the skill from this folder with `--add-dir`, not copied into another project. The cost bullet now has run times.

**What I checked**
- Claude cloned the public repo into a new temp folder, ran both test files from outside it (33 and 12 passed), and then deleted the folder and the files it made there. The clone has 22 files and `SKILL.md` is 80 lines, well under 500.
- **The README's example command failed on a fresh clone** ("No such file or directory"), because `readme-architect-out/` is gitignored and so is not in a clone, and the shell opens the `>` file before the tool starts. `gather.mjs --out` does create a missing folder (checked), so the skill is fine and only the README command was wrong.
- The checker's no-model parts (headings, commands, secrets) pass on the README. The only warning is the "What I ran it on" section, which is expected.
- The run times in the README come from the saved result files: run 3 took 90 seconds, run 4 took 245, run 6 took 297.
- **Not checked:** the spec's "weigh latency" goal was only partly covered before this, and I did not run the skill again. I did not test whether a deny rule stops Claude from reading a `.env` file (still on the todo list), and I did not run generate mode on a real project.
- **My email is in every commit.** All 9 commits carry my personal Gmail address as the author, so it is public on the GitHub repo. It is not in any file. I have not changed any history.

**Decisions**

---

## 18. A secret could stay on the list of files to open (2026-10-22)

**What I asked for**
- Asked whether the artifact itself is good, if it was tested at its current version, and whether Claude could be sure it needs no fixes or upgrades.

**What changed**
- `gather.mjs`: it now reads the first 200 KB of every text file (not images, audio, fonts or other binaries) and takes any file that looks like it holds a secret off the `files` list, recording the line numbers only. Before, only entry files and the `package.json` summary were scanned, and a flagged file even stayed on the `files` list as well as on `skipped`. A `package.json` whose summary is withheld is now also taken off the list. I did not touch `check-readme.mjs`.
- `scripts/test-gather.mjs`: one test changed (the secrets test expected the flagged file to stay on the list) and two added, 14 tests now. One of them documents a known limit: a secret after the first 200 KB of a file is not seen.
- `README.md` and `CLAUDE.md`: the test count, and the wording about what gather skips.

**What I checked**
- File timestamps against the last real run (run 6): both scripts were last changed before it, so run 6 used the current checker and gather. `SKILL.md` and three templates (`web-app`, `static-site`, `claude-skill`) were changed after it, so no model run has used them yet. Run 5 (generate mode, the fixture repo) used the old `web-app.md`.
- A throwaway repo in Temp with made-up secrets in a `.env`, an `id_rsa`, a gitignored file, a source file and the README. Gather left out the first three and `node_modules`, and no secret value appeared in its output or in the checker's report. The source file with a token-shaped string stayed on the list. That is the gap I then fixed.
- After the fix: 14 gather tests and 33 checker tests pass. I compared the old and new gather on midi-companion, the Portfolio, this repo and the fixture: same files, same skipped lists, same kinds, same entry files, so the fix did not hide any legitimate file.
- **Not checked:** the fix with a model run. No model run was needed to test it, since gather is plain code, but the skill has not been run since this change. Also not checked: secrets of a shape the scanner does not know, secrets after the first 200 KB of a file, and files Claude Code opens with its own tools, which is still the untested deny rule.

**Decisions**
- Fixed it in the code, not by telling the model more firmly not to open the file.
- Claude cannot promise the artifact needs no fixes. What is tested at its current version: the two scripts. What is not: `SKILL.md`'s widened notes rule, the three changed templates with a model, generate mode on a real project, and the deny rule.

---

## 19. The tool checks its own README (2026-10-22)

**What I asked for**
- Asked whether this repo's README was made by its own skill command. It was not: Claude wrote it by hand, and the skill had never run on it. I told Claude to run the tool on its own README.

**What changed**
- Only `README.md`, after the run: three sentences were made more exact, and a line about this run was added under "What I ran it on" (see below). I did not run the skill a second time.
- `docs/todo.md` and `CLAUDE.md`: the re-run item is checked off and the status mentions this run.

**What I checked**
- Claude copied the old `claims.json` and `gather.json` to `run6-claims.json` and `run6-gather.json` first, because the skill overwrites them. Then it ran `/readme-architect check . README.md` headless from this folder. 14 turns, 144 seconds, about $1.05 at list price (an estimate), no permission denials, no error. The template was `claude-skill.md`.
- The checker's report: 74 claims, 30 supported by code, 43 only by notes, 1 unsupported, 0 bad evidence. The only structure warning is "What I ran it on", which is about this project's own runs and is not in the template.
- The one unsupported claim is "The test files and the checker alone take seconds and cost nothing". Nothing in the repo states it. Claude timed both test files afterwards: about 1.2 seconds together. I kept the sentence.
- **Most of the notes-only claims are real facts, but weak evidence.** 15 of the 43 cite `SKILL.md`, which counts as notes because it ends in `.md`, though for a skill it is the instructions that make the behavior. The rest cite `CLAUDE.md` and `log.md`, which are my own notes, so a number like "33 tests" is backed only by a line that says 33 tests. Claude ran both test files earlier in this session and got 33 and 14, so those numbers are right, but the checker cannot show it.
- **Claude's spot check of the evidence:** "It runs only when the user types the command" cites `disable-model-invocation: true`, which fits. "The only things it may run without asking are the scripts" cites the two pre-approval lines in `SKILL.md`, which show what is allowed but not that nothing else is, so I changed the sentence to "the only commands it pre-approves". The model itself said "word for word" was slightly too strong because the checker ignores extra spaces and line breaks (`check-readme.mjs` line 11), and that "anything in `.gitignore`" was too strong because `!` lines are counted and not applied. Claude confirmed the first in the code, and the second was already in `CLAUDE.md`. Both sentences are fixed.
- **Not checked:** most of the 30 code-backed claims, and whether the model missed claims. The widened notes rule from entry 13 was used for the first time here, but this README's claims are mostly about the project itself, where notes are the natural source. So this run does not show whether the rule helps on a different README.
- The model said it counted the `test(...)` calls itself instead of running the tests, which fits with its numbers matching.

**Decisions**
- Did not change the checker to treat `SKILL.md` as code. It is a one-line change, but it changes what the "only by notes" warning means, and I have not decided whether `SKILL.md` counts as code when it only tells a model what to do.
- Added a line to the README's "What I ran it on" saying the tool ran once on its own README and that I fixed wording afterward without re-running it.

---

## 20. Better guidance in the templates' "run it" sections (2026-10-22)

**What I asked for**
- Asked whether the "Try it" section in this repo's README was comprehensive or intuitive enough. Claude said no. I then said it should consider updating the template guide, and Claude took that to mean the comments inside each template that tell the model what a section must contain.

**What changed**
- The comment under the run or use section of all four templates: `claude-skill.md` ("Try it"), `web-app.md` and `static-site.md` ("Run it locally"), and `library-cli.md` ("Usage"). They now say to start with the quickest way to see it work, to give one plain sentence per command or flag, to say what the reader will see only if a file in the repo shows it, and to use placeholders for paths that belong to the reader. The skill template also lays out the order: a no-model way to see it work first, then the real slash command with its arguments explained, then where the output goes. No headings changed.
- I did not change this repo's own README. Its "Try it" does not follow the new guidance yet.

**What I checked**
- Every comment is still on one line, and the checker reads all four templates the same way as before: the midi-companion README matches `web-app.md` and the Portfolio README matches `static-site.md`, with nothing missing, extra or out of order, and this README still differs from `claude-skill.md` only by the extra "What I ran it on". Both test files still pass (33 and 14).
- The no-model example that the new guidance asks for exists: running the checker on the bad fixture README prints 5 problems and exits with code 1. Claude ran that command and read the output.
- **Not checked:** how the model follows the longer comments. I did not run generate mode again, so I don't know whether it produces a better "Try it". The comments also ask the model to explain what each flag does "from SKILL.md or a notes file", which depends on those files saying it.

**Decisions**
- Kept the evidence rule: the model may describe what a run prints only if a file in the repo shows it. That is why the new guidance does not ask for sample output on its own.
- Next: rewrite this README's "Try it" to follow the new guidance. I have not decided whether to test the interactive way of running the skill first.

---

## 21. Rewriting "Try it", and the checker failing its own README (2026-10-22)

**What I asked for**
- Said yes to rewriting this README's "Try it" with the new template guidance, and to committing in logical commits.

**What changed**
- `README.md`, "Try it": now three steps and the tests. 1) the checker on the bad test project, with no model and no cost, and the output it printed; 2) the real run, with each part of the long command explained; 3) how to read the report. The old version started with the tests and left the flags unexplained.
- `check-readme.mjs`, `parseMarkdown`: a code fence labeled `text` or `output` is no longer read as commands to check. Before, every line in any fence was treated as a command.
- `scripts/test-check.mjs`: two new tests (35 now). One checks that `text` and `output` fences are skipped while `bash` and unlabeled ones are still read, and one that a `text` fence ends at its closing fence.
- `README.md` and `CLAUDE.md`: the test count and a line about the fence rule.

**What I checked**
- The flags in the long command were checked against `claude --help`, not memory: `-p` is "Print response and exit", `--output-format json` is a "single result", and `--add-dir` gives tool access to additional directories. The help lists `acceptEdits` as a choice but does not say what it does, so the README says only why I used it. The help also warns that `-p` skips the workspace trust dialog, so the README says to use it only in folders I trust.
- I ran both step 1 commands and pasted the real output: the bad files give 5 problems and exit 1, and the good files give `Result: PASS` and exit 0.
- **The checker failed this README on its first try.** The pasted output had lines like `npm run test: no "test" script`, and the checker read them as commands the README tells readers to run, so it reported 2 problems. That was a real false alarm, found by running the tool on its own README. I fixed the checker, not the README.
- After the fix: 35 checker tests and 14 gather tests pass, and this README passes the checker's free checks (exit 0; the only warning is the "What I ran it on" section, which is expected). On midi-companion's and the Portfolio's READMEs and the two fixture READMEs, the parser reads exactly the same lines as before, and only this README's changed (73 code lines down to 57).
- **Not checked:** the interactive way of running the skill. Every real run so far was `claude -p`. I did not run the skill again with the model after the README or the checker changed.

**Decisions**
- Fixed the checker instead of removing the example output, because showing what a tool prints is normal in a README for a command-line tool. The cost is a new rule that a fence labeled `text` or `output` is not checked, so a wrong command inside such a fence would not be caught.

---

## 22. Cutting "Try it" back down (2026-10-22)

**What I asked for**
- Looked at PokeGuess's "Run locally" (one short code block with a few `#` comments, then three links) and told Claude it was doing too much for a how-to guide.

**What changed**
- `README.md`, "Try it": from about 70 lines with three subsections down to about 25. It is now two short code blocks (the checker on the bad test project, then the real run), a few plain notes, and the tests. The step on how to read the report and the flag-by-flag list are gone.
- The guidance comments in the four templates: shortened to say that the run section should be one short code block with a `#` comment on each command. The evidence rules stayed, so the model still can't say what a run prints unless a file in the repo shows it.
- Entries 20 and 21 describe the longer version and are left as written.

**What I checked**
- The README still passes the checker's free checks (exit 0, only the expected "What I ran it on" warning), and the commands in its code blocks all exist. The templates still parse the same way: midi-companion matches `web-app.md` and the Portfolio matches `static-site.md` exactly. Every template comment is still on one line. Both test files pass (35 and 14).
- **Not checked:** how the model follows the shorter guidance, since I did not run generate mode again. And I did not re-run the real command from the README; it is the same one my earlier runs used.

**Decisions**
- Kept two things that a stranger would trip on without them: the `mkdir`, and the note that `MSYS_NO_PATHCONV=1` is for Git Bash. Left out what each flag means. The "What it cannot do" section already says what the checker does not prove.

---

## 23. Last audit: the checker could still print a secret (2026-10-23)

**What I asked for**
- After updating the portfolio card, asked Claude whether the artifact still needs improvements or updates, to say honestly if it is good, and to make sure no secret can leak into a README, with boundaries to check it.

**What changed**
- `check-readme.mjs`: anything it prints from the README or the claims (claim text, commands, notes and detail text) now goes through a `hide()` function, and a line that looks like a secret is shown as `[hidden: looks like a secret]`. It checks the whole text before it is cut to 70 characters, so a cut-off start of a token is not shown either.
- `scripts/test-check.mjs`: one new test (36 now). A made-up token in a claim and a made-up password in a `node` command must not appear in any part of the output, not even five repeated characters of them.
- `.claude/settings.json` (new): `Read` deny rules for `.env`, `.env.local`, other `.env.*` files that are not examples, `*.pem`, `*.key`, `*.p12`, `*.pfx` and `id_*` key files. `.env.example` is left readable because the checker allows it as evidence.
- `README.md`, `CLAUDE.md`, `docs/todo.md`: the test count, the secrets paragraph, and the todo item for the deny-rule test.

**What I checked**
- **The leak was real.** I built a throwaway repo with a made-up GitHub token inside a README sentence and the same sentence as an unsupported claim. The SECRETS section said "values are not shown", but the UNSUPPORTED list printed the whole token. After the fix the output was clean, and the new test fails against the old checker and passes against the new one.
- Before the fix I had also read through the code: quotes were already hidden when the claims report had a secret, but claim text and README commands were not.
- 36 checker tests and 14 gather tests pass. Tracked files hold no secret-shaped strings except the checker's own patterns and the made-up test values.
- The deny-rule syntax comes from the Claude Code permissions page (read 2026-10-23, saved copy): `//**/.env` anchors to the whole filesystem and `Read` rules are best-effort. They cover Claude's file tools and shell commands like `cat`, not a script that opens the file itself, and only the OS sandbox is a hard block.
- **Not checked:** whether my deny rules work. Claude tried a one-turn headless test with a fake `.env` in a temp folder, but the harness refused the command ("Access to a sensitive path is not allowed"). Claude did not work around it, deleted the temp folder, and the rules stay untested. Also not checked: secret shapes the scanner does not know, and secrets after the first 200 KB of a file.

**Decisions**
- Fixed the printing in the checker and did not rely on the README text saying "never prints". That sentence was false until today.
- Kept the deny rules even though they are untested, because they are one small file, they only deny files the checker already rejects, and the README says plainly that they are untested and best-effort.

---

## 24. Run 8 on midi-companion: a path bug in SKILL.md (2026-10-27)

**What I asked for**
- After I added the Piano sound setting to midi-companion, I asked Claude to run readme-architect on its README to see if anything in it was wrong. Then I told it to fix everything the run found.

**What changed**
- `.claude/skills/readme-architect/SKILL.md`, steps 3 and 7: gather.json's `readme` is relative to the repo folder, but the checker reads `--readme` from the folder the run is started in. Step 7 now says to join the repo folder and the README name into one path (`<readme-path>`) and to use that in the checker command.
- `scripts/test-check.mjs`: one new test (37 now). It reads `SKILL.md` and fails if step 7 passes the README name without the join, or if step 3 stops telling the model to join it.
- `README.md`, `CLAUDE.md`: the test count, 36 to 37.
- midi-companion's `README.md`, the Known limits line about crossing hands: it said the Tracks popup could fix a wrong hand guess. The popup can only switch tracks off, so the line now says that.

**What I checked**
- **The bug was real.** In the first part of the run, the checker's COMMANDS and STRUCTURE sections read readme-architect's own README, because `README.md` also exists in this folder. Claude re-ran just the checker with the correct path and said so. The model's own list of claims was not affected.
- The run finished with exit code 0: 199 claims, 177 backed by code, 10 only by notes, 12 with no evidence, 0 bad evidence. Claude's own estimate of the cost was about $2.50, which is only an estimate.
- Claude went through the 12 unsupported claims against midi-companion's real files by hand. Only one was a real README error (the crossing-hands line above).
- The new test passes on the fixed `SKILL.md` and fails when I put the old `SKILL.md` back, so it does catch this bug. 37 checker tests and 14 gather tests pass.
- **Not checked:** I did not run the skill again after the fix, so I have not seen it build the joined path on its own. The test only checks the wording of `SKILL.md`, not what the model does with it.

**Decisions**
- Fixed `SKILL.md` and not the checker. The checker cannot tell a wrong README from a right one when both exist in the current folder, so a checker-side fallback would hide the mistake.
- Did not re-run the skill just to test the fix, because a run costs real money and my own notes say not to repeat runs without a reason.

---

## Where AI misread me, or I had to correct course

**Claude**
- **Couldn't read the spec at first (Claude's slip):** its PDF reader needs a tool that isn't installed here (`pdftoppm`). It did not install anything. It found `pdftotext`, which comes with Git for Windows, and read the text with that.
- **Overstated the spec (Claude's slip, entry 2):** `CLAUDE.md` said the spec "asks for" a written model/code split. The spec says it is "a good idea". Claude noticed on re-reading the PDF and fixed the line.
- **Two small tool slips in entry 2:** a file search used a parameter that doesn't exist and failed, and one `log.md` edit assumed two sections were next to each other when entry 1 sat between them. Both failed without changing anything, and Claude redid them correctly.
- **Overclaimed the secrets protection (Claude's slip, entry 5):** Claude said a script would filter secrets out "before the model reads anything", and wrote that the model "never sees secrets" in `CLAUDE.md`. The script only controls what it hands over. Claude Code can still open files itself, so that is not a guarantee. When I asked whether my API key was safe, Claude corrected the wording and made testing a deny rule a to-do. This project uses no API key.
- **Started the first run in Git Bash (Claude's slip, entry 9):** Git Bash rewrote `/readme-architect` into a Windows path, so the skill never started and the run cost about $0.20 for nothing. The model refused to fake it. Fixed with `MSYS_NO_PATHCONV=1`.
- **Two bugs in `SKILL.md` (Claude's slip, entry 9):** the example commands left a script path with a space unquoted, and the pre-approval covered Bash only while the model used PowerShell. The second run stopped at its first command because of it (about $0.18).
- **Left room for the model to change the checker command (Claude's slip, entry 11):** `SKILL.md` said "use this exact form" but did not say to add nothing, so the model appended `; echo "exit $?"` and the tool refused it. Fixed in `SKILL.md`; not re-run yet.
- **Weak evidence got through (the model's slip, entry 11):** "dotted guides" was backed by a comment about an orange strip, and "no UI framework" got no evidence although `package.json` shows it. Added two rules to `SKILL.md`; not re-run yet.
- **Gave me the wrong shell's command (Claude's slip, entry 13):** Claude told me to run a Git Bash command (`MSYS_NO_PATHCONV=1 claude ...`) and I ran it in PowerShell, which does not understand that prefix, so I got a long error. Claude owned it and ran the command itself through its Bash tool.
- **Left evidence empty although my notes had it (the model's slip, entry 13):** seven of the 17 unsupported claims are stated in `CLAUDE.md` or `log.md`. The model's own rule told it to use notes only for facts the code cannot show. Widened the rule in `SKILL.md`; not re-run yet.
- **Said "log.md link" and confused me (Claude's slip, entry 15):** I asked where the build log would live, and Claude offered "link to log.md on GitHub" without saying that the log was already in this repo. I thought it meant the portfolio's own `log.md`, so I asked if it wasn't living on the portfolio. Claude explained and I chose option 1.
- **Left the README and todo rewrite out of the log (Claude's slip, entry 15):** both were rewritten after entry 13 and were not logged until entry 15.
- **"It never prints a secret's value" was false (Claude's slip, entry 23):** the README and `CLAUDE.md` said it, and the checker's own test only covered a secret in the README with clean claims. A secret inside a claim's text was printed in full. I found it in the final audit with a throwaway repo, and fixed it in the code.
- **Two small slips in that audit (Claude's slip, entry 23):** a cleanup command stopped halfway because the shell was still inside the folder it tried to delete, and the deny-rule test command named a `.env` path, which the harness refused. I re-ran the cleanup by hand and did not retry the test.
- **Wrote far too much for a how-to guide (Claude's slip, entries 20 and 21):** "Try it" grew into three subsections with a flag-by-flag list and a guide to reading the report, and the template guidance asked for the same. I pointed at PokeGuess's short "Run locally" and Claude cut both back (entry 22).
- **The new README example failed the tool's own check (Claude's slip, entry 21):** Claude pasted the checker's output into the README, and the checker read the `npm run test` and `node scripts/seed.mjs` lines in that output as commands to run, so the README failed with exit 1. Claude had run the free checks only after writing the section. It fixed the checker to skip fences labeled `text` or `output`.
- **Three sentences in the README claimed more than the code does (Claude's slip, entry 19):** "word for word" (the checker ignores extra spaces), "anything in `.gitignore`" (`!` lines are not applied), and "the only things it may run without asking" (the evidence only shows what is pre-approved). The model flagged the first two when the tool ran on its own README, and Claude found the third in the spot check. All three are fixed in the README.
- **Gather left secret-bearing files on the list the model may open (Claude's slip, entry 18):** the README said gather skips "anything that looks like a secret", but only entry files and the `package.json` summary were scanned, and even a flagged file stayed on the `files` list. Found by a test with made-up secrets in a throwaway repo, and fixed in the code.
- **Two small slips while fixing it (Claude's slip, entry 18):** a new test expected one line number where the scanner returned two (the code now de-duplicates), and a cleanup command deleted the "before" gather files I needed for a comparison. I redid the comparison with the committed version of gather.
- **The README's example command did not work on a fresh clone (Claude's slip, entry 17):** Claude wrote it with a `>` into a folder that is gitignored, and it also pointed at `../midi-companion`, which nobody else has. I only found out when Claude cloned the repo and ran it.
- **Gave the checker a path that only worked from the wrong folder (Claude's slip, entry 24):** `SKILL.md` passed gather's `readme` value (`README.md`) to the checker unchanged, and the checker read it from the current folder, so on the midi-companion run two sections were checked against this repo's own README. Fixed in `SKILL.md` and covered by a new test.
- **Wrong run count in a title (Claude's slip, entry 16):** entry 13 was titled "Third midi-companion run", but midi-companion had been checked twice (runs 4 and 6). Claude only caught it when I asked it to go through the log, and fixed the title.

**My own mistakes**
- Nothing yet.

---

## Decisions and abandoned ideas

- Considered copying the build-log page scripts from MIDI Companion now. Left them out for now: the page needs somewhere to be served, and the shape of the project isn't chosen yet.
- Considered a MIDI practice coach (code reads a MIDI file, a model writes practice advice). Dropped: it leans on Artifact 2's idea, the output is hard to check, and MIDI files of real songs are copyrighted.
- Considered a tool that drafts my log entries from the git diff. Dropped: my logs have to be in my words.
- Considered a `/logs/` page on the portfolio built from this log, like Artifact 2's. Left it out for now (entry 15): it is a copy that goes stale, and the card can link straight to `log.md` on GitHub.
- Considered sub-templates, such as a full-stack kind for repos like Cardex and PokeGuess. Skipped (entry 14): gather and the command check only read the top-level `package.json`, so it needs script changes.
