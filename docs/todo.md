# Open work (as of 2026-10-22)

- [ ] Due Sunday Oct 25 at 11:59 PM on Canvas: the artifact, as my portfolio link with the Artifact 3 card filled in. The weekly quiz, reflection and learning-group minutes are separate deliverables due the same night.
- [ ] Read the new `README.md` (drafted 2026-10-22) and fix anything that is not true or not in my voice.
- [ ] Review the templates in `.claude/skills/readme-architect/templates/`. Claude changed `web-app.md`, `static-site.md` and `claude-skill.md` to match my own READMEs (log entry 14), and `library-cli.md` is still the first draft.
- [x] Rename the folder from `temporaryname` to `readme-architect`.
- [x] Create the GitHub repo `kevlam1/readme-architect`, add it as `origin`, and push (2026-10-22).
- [x] Decide where the build log lives: the card's build-log button links to `log.md` on GitHub (decided 2026-10-22). No `/logs/` page.
- [ ] Fill in the Artifact 3 card in a session started in `../Portfolio`: title, repo link, build-log link, and a few sentences of reflection in my own words. Log it in the Portfolio's `log.md` too.
- [ ] Test the `Read` deny rules in `.claude/settings.json` against a fake `.env` (made-up value, in a temp folder added with `--add-dir`) and write down what was found. Claude's attempt on 2026-10-23 was refused by the harness because the command named a `.env` path, so run it yourself from this folder: ask a one-turn `claude -p` to read that file with the Read tool, with `cat` and with `node -e`. The docs say the third should get through, since only the OS sandbox is a hard block.
- [ ] Optional: run generate mode on a real project (midi-companion), about $1 or more at list price.
- [x] Re-run check mode once with the widened notes rule: done on this repo's own README (log entry 19). It does not show whether the rule helps on other READMEs.
- [ ] Decide whether `SKILL.md` should count as code, not notes, in the checker's "only by notes" warning (15 of the 43 notes-only claims in entry 19 cite it).
- [ ] Optional: a "can't be verified from a repo" group in the checker's report.
- [ ] Read "Tools on Top of LLMs" (named in the spec).
- [ ] Demo for the card: an animated illustration made by Claude, labeled as an illustration and using only real numbers from `readme-architect-out/run6-result.json`. Lowest priority; do it after the card text.
