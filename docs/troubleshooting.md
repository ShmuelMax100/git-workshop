# Troubleshooting GitHub Actions

A practical reference for common failures encountered during the workshop
(and in real projects).

---

## 1. Enable step debug logging

The single most useful thing you can do when a run is confusing.

**Method A — Repository secret (persists across runs):**
1. Settings → Secrets and variables → Actions → New repository secret
2. Name: `ACTIONS_STEP_DEBUG`, Value: `true`

**Method B — Re-run with debug (one-time):**
1. On the failed run page, click **Re-run jobs → Re-run all jobs**.
2. Check the **Enable debug logging** checkbox.

**CLI:**
```bash
gh run rerun <run-id> --debug
```

With debug enabled, each step emits verbose `##[debug]` lines including
exact commands, environment variables (secrets are still masked), and timing.

---

## 2. Reading logs efficiently

```bash
# See only the failed steps across the whole run
gh run view <run-id> --log-failed

# Full log for every step
gh run view <run-id> --log

# Interactive job/step browser
gh run view <run-id>
```

In the GitHub UI:
- Each step has a ▶ expand arrow — click it.
- Search within a log with `Ctrl+F` / `Cmd+F`.
- "Raw logs" link at the top right gives the plain text version.

---

## 3. Common error messages and fixes

### `npm: command not found`
The runner does not have Node.js. Add the setup step:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20.x
```

### `missing script: <name>`
The script in `package.json` does not match what `npm run` is calling.
Double-check spelling. Run `npm run` (no arguments) to list all defined scripts.

### `No files were found with the provided path`
The path given to `actions/upload-artifact` does not exist.
Check: Did the step that creates the directory actually run? Did it use the
correct path name?

### `Error: Process completed with exit code 1`
A shell command returned non-zero. The step above will have the actual error.
Scroll up — GitHub shows the last ~100 lines by default.

### `Resource not accessible by integration`
The `GITHUB_TOKEN` lacks permission for the operation. Add explicit permissions:
```yaml
permissions:
  contents: write     # for creating releases
  pull-requests: write
```
Or check Settings → Actions → General → Workflow permissions.

### `Context access might be invalid`
An expression like `${{ needs.build.outputs.version }}` references an output
that does not exist. Check:
1. The `outputs:` block is defined at the job level (not step level).
2. The step that sets the output has an `id:` field.
3. The `echo "key=value" >> "$GITHUB_OUTPUT"` syntax is correct.

### `Cache not found for input keys`
Not an error — the cache simply wasn't populated yet. The job will run
normally and save the cache for next time. After the first run this
message disappears.

---

## 4. Secrets are not being injected

**Symptoms:** your `${{ secrets.MY_SECRET }}` appears as an empty string.

**Common causes:**
- The secret is not set in the repository (Settings → Secrets and variables).
- The workflow is running from a **forked** repository PR — forks do not
  receive repository secrets by default (security feature).
- The secret name has a typo (names are case-sensitive).

**Check:**
```yaml
- name: Debug secret presence
  run: |
    if [ -z "$MY_SECRET" ]; then
      echo "::warning::MY_SECRET is empty"
    else
      echo "MY_SECRET is set (length: ${#MY_SECRET})"
    fi
  env:
    MY_SECRET: ${{ secrets.MY_SECRET }}
```

---

## 5. Workflow is not triggering

Check the `on:` block:
- Is the branch name correct? (`main` vs `master`)
- Is the event type correct? (`push` vs `pull_request`)
- Did you commit the workflow file to the **branch that triggers it**?

```bash
# Check which workflows are registered in the repo
gh workflow list

# Check recent runs (if no runs appear, the trigger didn't fire)
gh run list --limit 10
```

---

## 6. Job is stuck in "Queued" state

- GitHub-hosted runners have concurrency limits per account/plan.
- Self-hosted runners may all be busy or offline.
- Check Settings → Actions → Runners.

---

## 7. Matrix job fails — want to see all results

By default `fail-fast: true` cancels the remaining matrix entries when one
fails. To see all results:

```yaml
strategy:
  fail-fast: false
  matrix:
    node-version: [18.x, 20.x, 22.x]
```

---

## 8. Useful annotations in logs

Emit these from shell scripts to create visible markers in the UI:

```bash
echo "::error::Something went wrong"          # red X
echo "::warning::This is a warning"           # yellow !
echo "::notice::FYI information"              # blue i
echo "::error file=app.js,line=10::Bad code"  # links to source file
```

---

## 9. Quick diagnostic checklist

When a run is failing and you're not sure where to start:

- [ ] Is the failure in a **step** (command error) or a **job** (dependency/permission)?
- [ ] Did you read the **full step log** — not just the last line?
- [ ] Does the failure reproduce **locally** (`npm test`)?
- [ ] Is this a **secrets / permissions** issue (running on a fork PR)?
- [ ] Is the workflow **even triggering** (`gh run list`)?
- [ ] Did you enable **debug logging** and re-run?

---

## 10. GitLab/Jenkins migration gotchas

| Issue | Explanation |
|-------|-------------|
| Environment variables reset between steps | Each step is a new shell process. Use `$GITHUB_ENV` to persist values: `echo "KEY=value" >> "$GITHUB_ENV"` |
| No SSH into the runner | Use `tmate` action for interactive debugging (dev only) |
| Artifacts don't auto-pass between jobs | Upload in job A with `upload-artifact`, download in job B with `download-artifact` |
| `GITHUB_TOKEN` has limited scope by default | Add `permissions:` block to the workflow |
| Workflow file must be on the default branch to appear in the UI | Merge the workflow file to `main` first |
