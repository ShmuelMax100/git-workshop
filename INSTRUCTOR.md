# Instructor Guide — GitHub Workshop (3.5 hours)

This guide is for the person running the workshop. Do not share it with
participants before the session.

---

## Pre-workshop checklist

### 48 hours before

- [ ] Fork or clone this repo into your GitHub org/account.
- [ ] Create a GitHub Team (or list) for participants so you can add reviewers
      and assign PRs easily.
- [ ] Verify branch protection rules are **off** initially (you will
      demonstrate enabling them live).
- [ ] Push the repo with all workflows in place — confirm the Actions tab
      shows the workflows.
- [ ] Test `npm ci && npm test` locally — expect 3 failing multiply() tests.
- [ ] Install `gh` CLI and verify `gh auth status` works.

### Morning of the workshop

- [ ] Share the repository URL with participants.
- [ ] Confirm everyone has a GitHub account.
- [ ] Ask participants to `gh auth login` before the session starts.
- [ ] Have the GitHub Actions tab open in your browser, ready to demo.

---

## Workshop schedule (3.5 hours)

| Time | Duration | Activity |
|------|----------|----------|
| 0:00 | 15 min | Intro + repo tour |
| 0:15 | 25 min | **Scenario 1** — PR Flow |
| 0:40 | 10 min | Debrief + questions |
| 0:50 | 25 min | **Scenario 2** — Fix failing CI |
| 1:15 | 10 min | Debrief + questions |
| 1:25 | 15 min | BREAK |
| 1:40 | 30 min | **Scenario 3** — Debug broken workflow |
| 2:10 | 10 min | Debrief + reveal bug list |
| 2:20 | 35 min | **Scenario 4** — Build a workflow |
| 2:55 | 10 min | Debrief |
| 3:05 | 25 min | **Scenario 5** — Security |
| 3:30 | 10 min | Wrap-up + Q&A |

---

## Intro talking points (15 min)

1. **Why GitHub over GitLab/Jenkins?**
   - Unified hosting: code + CI + security + packages in one place.
   - GitHub Actions marketplace vs. writing everything from scratch.
   - Native `gh` CLI experience.

2. **Repository tour** (open in browser + terminal):
   - `/app` — our "production" code
   - `/tests` — you will see failing tests today (intentional)
   - `/.github/workflows` — four workflows
   - `/scenarios` — your instruction sheets
   - `/docs` — reference material for today and beyond

3. **Quick Actions orientation:**
   - Show the **Actions** tab on the repo.
   - Point out the workflow list on the left.
   - Open one completed run and explain steps → jobs → workflow.

---

## Scenario notes

### Scenario 1 — PR Flow

**Common stumbling block:** participants forget to push before running
`gh pr create`. Watch for the "nothing to compare" error.

**Live demo opportunity:** enable a branch protection rule in real time while
someone's PR is open. Show them that the merge button greys out.

### Scenario 2 — CI Failure

**The bug:** `multiply()` in `app/calculator.js` uses `+` instead of `*`.

**Instructor spoilers (do NOT read out):**
```js
// line 34 — buggy
return a + b;
// fix
return a * b;
```

If a participant gets stuck, ask: "What does the test output tell you the
actual value was vs. the expected value?" Walk them through reading Jest
output.

### Scenario 3 — Debugging

**The three bugs in `broken-ci.yml`:**

| # | Line | Bug | Fix |
|---|------|-----|-----|
| 1 | ~26 | `npm install` | `npm ci` |
| 2 | ~30 | `npm run tset` | `npm run test` |
| 3 | ~38 | `path: reports/` | `path: coverage/` |

Reveal these only **after** participants have tried for 10+ minutes.

**Good teaching moment:** show `gh run view --log-failed` to jump directly to
the error. Most people coming from Jenkins are used to clicking through a web
UI — this CLI shortcut is a crowd pleaser.

### Scenario 4 — Build a Workflow

This is the most open-ended scenario. Participants who finish early can tackle
the bonus challenges. The reference solution is in
`solutions/workflows/my-pipeline-complete.yml`.

**Key concept to reinforce:** the difference between `needs` (dependency) and
`if` (condition). Both can be on the same job.

### Scenario 5 — Security

**The planted issues:**
1. Hard-coded `API_KEY` constant in `app/index.js` (participants add this).
2. `left-pad` in `package.json` (participants `npm install` this).

**Instructor note:** make sure participants *remove* these before the end of
the session so the repo stays clean.

**Bonus talking point:** show the repository's built-in **Security** tab →
Secret scanning and Dependabot alerts.

---

## Tips for running the workshop

- Use `gh run watch` in a visible terminal window throughout — participants
  love watching the live streaming output.
- If the class is large, pair participants so one person drives and the other
  navigates.
- Keep the `/docs` folder open in one browser tab — point to it whenever a
  question about syntax comes up.
- The `$GITHUB_STEP_SUMMARY` feature (Scenario 4 bonus) is a great
  "wow moment" — worth demoing live if time allows.

---

## Common questions

**Q: How do I rerun just one job, not the whole workflow?**
```bash
gh run rerun --job <job-id>
```

**Q: Can I use GitHub Actions for free?**
Yes. Public repos get unlimited minutes. Private repos get 2,000 free
minutes/month on the free plan.

**Q: Is `GITHUB_TOKEN` the same as a Personal Access Token?**
No. `GITHUB_TOKEN` is a short-lived token automatically created for each
workflow run. It is scoped to the current repository and expires when the run
finishes. PATs are long-lived and user-scoped.

**Q: How do I migrate my existing Jenkins pipeline?**
Point them to the Jenkins Importer tool (`gh actions-importer`) and
`docs/github-actions-basics.md`.
