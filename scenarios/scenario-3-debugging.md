# Scenario 3 — Debugging a Broken Workflow

**Duration:** ~30 minutes  
**Difficulty:** Intermediate  
**Workflow used:** `broken-ci.yml`

---

## Goal

The `broken-ci.yml` workflow has three bugs. You will trigger it, read the
logs, identify each bug, and fix the workflow file so it runs cleanly.

---

## Background

Misconfigured CI is one of the most common pain points when migrating from
Jenkins (where you could SSH into the agent and poke around) to GitHub Actions
(where all you have is log output). This scenario builds the log-reading muscle
you will use every day.

Key GitHub Actions debugging tools:
| Tool | How to use |
|------|-----------|
| Step logs | Click any step in the Actions UI |
| `ACTIONS_STEP_DEBUG` | Set repo secret to `true` for verbose output |
| `gh run view --log-failed` | CLI shortcut to see only failing steps |
| `echo "::error::message"` | Emit a red annotation in the log |

---

## Steps

### 1. Trigger the broken workflow

Push any change to a branch and open a PR (or use `workflow_dispatch`):

```bash
git checkout -b debug/fix-broken-ci
# Make a trivial change
echo "# debug" >> README.md
git add README.md
git commit -m "chore: trigger broken-ci for debugging exercise"
git push -u origin debug/fix-broken-ci
gh pr create --title "debug: fix broken-ci" --body "Debugging exercise." --base main
```

### 2. Watch the run fail

```bash
# Get the run ID of the most recent run
gh run list --workflow broken-ci.yml

# Stream output for that run
gh run watch <run-id>

# Or jump straight to the failed steps
gh run view <run-id> --log-failed
```

### 3. Read the logs — find the bugs

Open the workflow run in the GitHub UI. Expand each failed step.

**Bug hunt checklist — fill in as you find them:**

| # | Step name | Symptom | Root cause | Fix |
|---|-----------|---------|-----------|-----|
| 1 | Install dependencies | | | |
| 2 | Run tests | | | |
| 3 | Upload test results | | | |

> Hints are at the bottom of this file. Try without them first!

### 4. Open `broken-ci.yml` in your editor

```bash
open .github/workflows/broken-ci.yml
```

Fix each bug you found. Refer to the table in Step 3.

### 5. Commit and push the fix

```bash
git add .github/workflows/broken-ci.yml
git commit -m "fix: correct three bugs in broken-ci workflow"
git push
```

### 6. Verify the run is green

```bash
gh run watch
```

All three steps should now have a green checkmark.

---

## Enable step debug logging (bonus)

If a step produces confusing output, enable debug mode:

1. Go to **Settings → Secrets and variables → Actions → Secrets**.
2. Create a secret: `ACTIONS_STEP_DEBUG` = `true`.
3. Re-run the workflow — every step now emits verbose `::debug::` lines.

```bash
# Re-run the last failed run from the CLI
gh run rerun <run-id> --failed
```

---

## Expected outcome

- You can navigate GitHub Actions logs efficiently.
- You found and fixed all three bugs in `broken-ci.yml`.
- You know how to enable step debug logging.

---

## Hints (read only after trying on your own)

<details>
<summary>Bug 1 hint</summary>

Compare `npm install` vs `npm ci`. Which one is recommended for CI because it
uses `package-lock.json` and guarantees a reproducible install?

</details>

<details>
<summary>Bug 2 hint</summary>

The error message will say something like `missing script: tset`. Look very
carefully at the script name. Is it spelled correctly?

</details>

<details>
<summary>Bug 3 hint</summary>

The upload step says "No files were found with the provided path: `reports/`".
Does that directory get created anywhere in the workflow? What directory does
Jest actually write output to?

</details>
