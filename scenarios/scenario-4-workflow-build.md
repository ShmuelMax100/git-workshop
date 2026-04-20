# Scenario 4 — Build a Workflow from Scratch

**Duration:** ~35 minutes  
**Difficulty:** Intermediate–Advanced  
**Reference:** `advanced-ci.yml` (study it, but build your own)

---

## Goal

Write a new GitHub Actions workflow file from scratch. By the end you will have
a working pipeline that uses a matrix, caching, job dependencies, and passes
data between jobs.

---

## Background

The `advanced-ci.yml` file shows you the destination. In this scenario you
build towards it step by step — the same way you would author a workflow on a
real project.

---

## What you are building

A workflow named **"My Pipeline"** that:

1. **Job: `lint`** — runs a simple format check.
2. **Job: `test`** — matrix across Node 18 and 20; caches `node_modules`;
   uploads coverage; exposes the Node version as a job output.
3. **Job: `report`** — runs after `test`; reads the output and prints a
   step summary.

---

## Steps

### 1. Create the file

```bash
touch .github/workflows/my-pipeline.yml
```

### 2. Add the trigger block

```yaml
name: My Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

### 3. Add the `lint` job

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: npm
      - run: npm ci
      - name: Lint (mock)
        run: echo "Lint passed."
```

### 4. Add the `test` job with a matrix

```yaml
  test:
    needs: lint
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    outputs:
      # expose the last matrix entry's output (for illustration)
      node: ${{ steps.out.outputs.node }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ matrix.node-version }}-${{ hashFiles('package-lock.json') }}
      - run: npm ci
      - run: npm run test:ci
      - id: out
        run: echo "node=${{ matrix.node-version }}" >> "$GITHUB_OUTPUT"
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-${{ matrix.node-version }}
          path: coverage/
```

### 5. Add the `report` job

```yaml
  report:
    needs: test
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Print job summary
        run: |
          echo "## Pipeline Result" >> $GITHUB_STEP_SUMMARY
          echo "Test status: **${{ needs.test.result }}**" >> $GITHUB_STEP_SUMMARY
```

### 6. Commit and push

```bash
git add .github/workflows/my-pipeline.yml
git commit -m "feat: add my-pipeline workflow"
git push
```

### 7. Watch all three jobs run

```bash
gh run watch
```

In the GitHub UI, switch to **Graph view** (the icon next to the run name) to
see the job dependency graph.

### 8. Verify the cache is working

Trigger the workflow a second time. In the `test` job, look for:

```
Cache restored from key: Linux-node-20.x-<hash>
```

That means the second run skips downloading packages and reuses the cache.

---

## Expected outcome

- You have a working `my-pipeline.yml` with lint → test → report.
- You understand how `needs`, `matrix`, `cache`, and `outputs` work together.
- You can read the job dependency graph in the GitHub UI.

---

## Bonus challenges

1. Add a fourth job `deploy` that only runs on `push` to `main` and depends
   on both `lint` and `test`.
2. Add a `fail-fast: false` setting to the matrix and break one Node version
   intentionally. Watch the other version still complete.
3. Use `$GITHUB_STEP_SUMMARY` to write a Markdown table with test results.
