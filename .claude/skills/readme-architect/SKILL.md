---
name: readme-architect
description: Fact-checks a project's README against its real code, or drafts a new README from the code. Use only when the user types /readme-architect check <repo-folder> or /readme-architect generate <repo-folder>. Lists each factual claim with evidence from the repo, and has a script verify that evidence.
argument-hint: check|generate <repo-folder> [readme-file]
disable-model-invocation: true
allowed-tools:
  - Bash(node "${CLAUDE_SKILL_DIR}/scripts/*)
  - PowerShell(node "${CLAUDE_SKILL_DIR}/scripts/*)
---

# readme-architect

Arguments typed after the command: $ARGUMENTS

The first word is the mode. The second is the repo folder (default: the current folder). The third, if given, is the README file (default: the one gather finds).

If the mode is `generate`, do the steps in "Generate mode" at the end of this file instead of the check steps. If the mode is anything other than `check` or `generate`, say what the modes are and stop.

## Your job in check mode, and nothing more

Plain scripts do the listing and the verifying. You do one thing: read the README, list each factual claim in it, and for each claim give evidence copied from the repo, or say there is none. You do not judge whether the README is good, you do not rewrite it, and you do not decide whether a claim is true. The checker decides.

## Steps

1. Create the output with the gather script. The skill folder's path can contain spaces, so the script path is always in double quotes. Use this exact form, in either the Bash or the PowerShell tool:
   `node "${CLAUDE_SKILL_DIR}/scripts/gather.mjs" --repo "<repo-folder>" --out readme-architect-out/gather.json`
   It prints one summary line. If it fails, show the error and stop.

2. Read `readme-architect-out/gather.json`. It lists the kind of project, every file you may open (`files`), key files with their text (`entryFiles`), and what was left out (`skipped`).

3. Read the README (the one named in the arguments, or the `readme` field in gather.json). If there is none, say so and stop.

4. List the claims. A claim is a sentence or bullet in the README that says something that could be true or false about the repo: what it uses, what it does, what a command does, a file or folder that exists, a number, a limit, a requirement. Split a sentence with several facts into one claim per fact. Skip opinions, greetings and calls to action. Do not skip a claim because it looks minor or because you cannot find evidence for it.

5. For each claim, find evidence:
   - Evidence is a file path (exactly as listed in `files`) and a quote copied word for word from that file. Open the file with the Read tool to copy the quote. Never write a quote from memory or paraphrase it.
   - A quote is one line or a short fragment, at least 4 characters, that on its own shows the claim is true.
   - Prefer evidence in the code itself (source files, HTML, config, `package.json`) over notes (any `.md` or `.txt` file), because notes can just repeat the README. Use a notes file for a fact the code cannot show, such as course context or who helped, or as extra evidence next to code. If you looked in the code and found nothing for a claim (a dev server address, a command-line flag, a Node version, a stated limit), look in the notes files in `files` (such as `CLAUDE.md` or `log.md`) before you give an empty list, and cite a quote that states the fact. The checker marks such a claim "only by notes", which is a warning. Never cite the README you are checking.
   - The quote must show the specific thing the claim says. If the claim says "dotted", a quote about a "thin orange strip" does not show it. If the closest quote only shows something nearby, give an empty list instead.
   - For a claim that something is absent ("no UI framework", "no accounts"), look at the dependency list in `package.json` (or the equivalent) and quote the lines that show what is there. If there is no such file, give an empty list.
   - A claim can have several pieces of evidence.
   - If you cannot find evidence after looking in the files that could hold it, give an empty list. An empty list is a correct answer. Do not stretch weak evidence to avoid an empty list.
   - Only open files that appear in `files`. Never open anything in `skipped`, and never open `.env*` files, `*.pem`, `*.key`, `id_rsa*`, or anything under `node_modules`.

6. Write the claims to `readme-architect-out/claims.json` in exactly this shape, and nothing else in the file:
   `{"claims":[{"text":"<the claim, in your words>","evidence":[{"file":"<path>","quote":"<exact quote>"}]}]}`
   It must be valid JSON. Escape double quotes and backslashes inside quotes.

7. Run the checker, again with the script path in double quotes. Use this exact form, with the template named in gather.json's `templateFile` (leave out `--template` if it is null). Run it as this one command and nothing else: do not add `; echo`, `&&`, a pipe or a redirect after it, because the pre-approval only matches a command that starts with the script path and a longer command can be refused (this happened in run 4). The exit code is shown to you by the tool:
   `node "${CLAUDE_SKILL_DIR}/scripts/check-readme.mjs" --repo "<repo-folder>" --readme "<readme-file>" --claims readme-architect-out/claims.json --gathered readme-architect-out/gather.json --template "${CLAUDE_SKILL_DIR}/templates/<templateFile>"`

8. Show the checker's output to the user exactly as printed. Then add at most three sentences: how many claims you listed, and that the checker proves only that evidence exists, not that it supports the claim, so the user should read the evidence lines for the claims that matter.

## Generate mode

Your job here: write a README draft from the template and the gathered facts, and list each factual sentence in it as a claim with evidence. The same checker then verifies the evidence. You do not decide whether the draft is true, and you do not write anything the repo gives no evidence for.

1. Run gather exactly as in check mode step 1. In generate mode the third argument, if given, is ignored.
2. Read `readme-architect-out/gather.json`. Read the template file named in `templateFile` from `${CLAUDE_SKILL_DIR}/templates/`. If `templateFile` is null, say the kind of project was not recognised and stop.
3. Write the draft to `readme-architect-out/README.generated.md`. Never write into the repo being described, and never overwrite its own README.
   - Use the template's headings, in the template's order, spelled exactly as in the template. Leave out a section marked `optional` unless the repo's code or notes state something for it. Remove every comment.
   - Put the project name in the `#` heading, taken from `package.json` or the repo folder name.
   - Every factual sentence or bullet needs evidence, found the same way as in check step 5: a file path exactly as listed in `files` and a quote copied word for word with the Read tool. Prefer code over notes. Never use the repo's existing README as a source for facts, because the point is to build the text from the code.
   - If the repo has no evidence for a section, write `Not found in the repo.` in it. Do not guess and do not fill space.
   - Do not write opinions or marketing words. Short plain sentences. Each bullet states one fact.
   - Every `npm run` command you show must exist in `package.json`.
4. List the claims. Each factual sentence or bullet in the draft is a claim, with its evidence, in the same JSON file and shape as check step 6, written to `readme-architect-out/claims.json`. `Not found in the repo.` is not a claim.
5. Run the checker as one command with nothing after it, on the draft:
   `node "${CLAUDE_SKILL_DIR}/scripts/check-readme.mjs" --repo "<repo-folder>" --readme readme-architect-out/README.generated.md --claims readme-architect-out/claims.json --gathered readme-architect-out/gather.json --template "${CLAUDE_SKILL_DIR}/templates/<templateFile>"`
6. Show the checker's output exactly as printed, and say where the draft is. Then add at most three sentences: how many claims you listed, that the checker proves only that evidence exists and not that it supports the claim, and that the user should read the draft before using any of it. Do not copy the draft over the repo's README.

The rules below apply to both modes.

## Rules

- Do not edit `claims.json` after the checker has run, and do not run the checker a second time to get a better result. If the user wants a second pass, they will ask.
- Do not fix the README in check mode, and in generate mode do not change the draft after the checker has run.
- Do not print the contents of any secret-looking file, even by accident. If something you read looks like a key or token, do not repeat it.
- If a script exits with an error, show the message and stop. Do not work around it.
- Do not claim the README is accurate. Report what the checker reported.
