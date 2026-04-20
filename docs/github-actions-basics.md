# GitHub Actions — Core Concepts

A concise reference for developers coming from Jenkins or GitLab CI.

---

## Anatomy of a workflow file

```
.github/
  workflows/
    my-pipeline.yml   ← one file = one workflow
```

Every workflow file has this top-level structure:

```yaml
name: <display name in the UI>

on: <trigger(s)>

jobs:
  <job-id>:
    runs-on: <runner>
    steps:
      - <step>
      - <step>
```

---

## `on` — Triggers

Controls when the workflow runs.

```yaml
on:
  push:
    branches: [main, 'release/**']
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'   # every Monday at 06:00 UTC
  workflow_dispatch:        # manual trigger from UI / CLI
  workflow_call:            # called by another workflow (reusable)
```

**GitLab analogy:** `only:` / `rules:` in `.gitlab-ci.yml`  
**Jenkins analogy:** `triggers {}` block in `Jenkinsfile`

---

## `jobs` — Parallel units of work

Jobs run in **parallel by default**. Each job:
- Gets a fresh VM (or container).
- Has its own filesystem — files do not persist between jobs unless you use
  artifacts.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    runs-on: ubuntu-latest
    steps: [...]
```

**GitLab analogy:** individual jobs in `.gitlab-ci.yml`  
**Jenkins analogy:** `stage {}` blocks (parallel stages)

---

## `needs` — Job dependencies

Force a job to wait for one or more other jobs to succeed.

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    needs: lint          # waits for lint to succeed
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: [lint, test]  # waits for BOTH
    runs-on: ubuntu-latest
    steps: [...]
```

**GitLab analogy:** `needs:` or `stages:` ordering  
**Jenkins analogy:** `stage` dependencies in declarative pipeline

---

## `runs-on` — Runners

Selects the machine that runs the job.

| Value | Machine |
|-------|---------|
| `ubuntu-latest` | Ubuntu (most common) |
| `windows-latest` | Windows Server |
| `macos-latest` | macOS |
| `self-hosted` | Your own runner |

---

## `steps` — Sequential commands

Steps run **in order** inside a job. A failed step stops the job (unless you
add `continue-on-error: true`).

```yaml
steps:
  # Action (pre-built, reusable)
  - name: Checkout code
    uses: actions/checkout@v4

  # Shell command
  - name: Run tests
    run: npm test

  # Command with environment variables
  - name: Deploy
    env:
      TOKEN: ${{ secrets.MY_TOKEN }}
    run: ./deploy.sh
```

---

## Actions (`uses`)

Actions are reusable building blocks — like Jenkins shared libraries, but
hosted on GitHub Marketplace.

```yaml
- uses: actions/checkout@v4           # check out the repo
- uses: actions/setup-node@v4         # install Node.js
  with:
    node-version: 20.x
- uses: actions/cache@v4              # cache files between runs
- uses: actions/upload-artifact@v4    # save files as artifacts
- uses: actions/download-artifact@v4  # restore saved artifacts
```

Always pin to a specific version tag (`@v4`) or commit SHA, never `@latest`.

---

## `secrets` — Sensitive values

Secrets are encrypted, never appear in logs.

**Setting a secret:**
- UI: Settings → Secrets and variables → Actions → New repository secret
- CLI: `gh secret set MY_SECRET`

**Using a secret in a workflow:**
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

**`GITHUB_TOKEN`** — automatically provided to every workflow run. Grants
read/write access to the repository. No setup required.

```yaml
- name: Create release
  env:
    GH_TOKEN: ${{ github.token }}
  run: gh release create v1.0.0
```

**GitLab analogy:** CI/CD variables (masked)  
**Jenkins analogy:** Credentials store

---

## Artifacts

Artifacts persist files between jobs or for download after the run.

```yaml
# Upload
- uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/
    retention-days: 7

# Download (in a later job)
- uses: actions/download-artifact@v4
  with:
    name: coverage-report
    path: ./coverage
```

**GitLab analogy:** `artifacts:` block  
**Jenkins analogy:** `archiveArtifacts`

---

## Passing outputs between jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.get-version.outputs.version }}
    steps:
      - id: get-version
        run: echo "version=1.2.3" >> "$GITHUB_OUTPUT"

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

---

## Conditional execution (`if`)

```yaml
# Run only on main branch
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: ./deploy.sh

# Run even when previous steps fail
- name: Cleanup
  if: always()
  run: ./cleanup.sh

# Skip on fork PRs (no secrets available)
- name: Publish
  if: github.event.pull_request.head.repo.full_name == github.repository
  run: npm publish
```

---

## Matrix builds

Run the same job with different configurations.

```yaml
strategy:
  fail-fast: false   # keep running other entries if one fails
  matrix:
    node-version: [18.x, 20.x, 22.x]
    os: [ubuntu-latest, windows-latest]

runs-on: ${{ matrix.os }}
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

**GitLab analogy:** `parallel: matrix:`  
**Jenkins analogy:** `matrix` directive

---

## Caching

Speeds up workflows by reusing installed packages across runs.

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

- `key` — exact match; used to save and restore.
- `restore-keys` — partial match fallbacks (ordered, first match wins).

---

## Step summary (`$GITHUB_STEP_SUMMARY`)

Write Markdown to display rich output on the workflow run summary page.

```yaml
- name: Report
  run: |
    echo "## Test Results" >> $GITHUB_STEP_SUMMARY
    echo "| Suite | Status |" >> $GITHUB_STEP_SUMMARY
    echo "|-------|--------|" >> $GITHUB_STEP_SUMMARY
    echo "| unit  | ✅ pass |" >> $GITHUB_STEP_SUMMARY
```

---

## Contexts — useful built-in variables

| Expression | Value |
|-----------|-------|
| `github.sha` | Full commit SHA |
| `github.ref_name` | Branch or tag name |
| `github.actor` | User who triggered the run |
| `github.event_name` | `push`, `pull_request`, etc. |
| `runner.os` | `Linux`, `macOS`, `Windows` |
| `job.status` | `success`, `failure`, `cancelled` |
