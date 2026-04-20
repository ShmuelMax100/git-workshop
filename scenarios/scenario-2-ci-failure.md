# Scenario 2 — Debugging a Failing CI Run

**Duration:** ~25 minutes  
**Difficulty:** Beginner–Intermediate  
**Workflow used:** `basic-ci.yml`

---

## Goal

Open a PR and watch CI fail because of a buggy function. Read the test output
in GitHub Actions logs, find the root cause in the source code, push a fix,
and watch CI go green.

---

## Background

The `multiply()` function in `app/calculator.js` contains an intentional bug.
Three tests in `tests/calculator.test.js` are already written to catch it — but
they fail right now. Your job is to diagnose and fix the issue.

This mirrors a common real-world situation: a CI pipeline fails on a PR, you
need to read the logs, understand what broke, and push a fix.

---

## Steps

### 1. Create a branch

```bash
git checkout main && git pull origin main
git checkout -b fix/multiply-bug
```

### 2. Run the tests locally first

```bash
npm test
```

You will see output similar to:

```
FAIL tests/calculator.test.js
  multiply()
    ✕ multiplies two positive numbers
    ✕ multiplies by zero
    ✕ multiplies two negative numbers
```

### 3. Open `app/calculator.js` and find the bug

Look at the `multiply` function. What is wrong?

```js
// HINT: look carefully at the operator being used
function multiply(a, b) {
  return a + b;   // ← something is wrong here
}
```

### 4. Fix the bug

Change the function so it actually multiplies:

```js
function multiply(a, b) {
  return a * b;
}
```

### 5. Verify locally

```bash
npm test
```

All tests should now pass:

```
PASS tests/calculator.test.js
  add()      ✓ 3 tests
  subtract() ✓ 2 tests
  multiply() ✓ 3 tests    ← now green
  divide()   ✓ 2 tests
```

### 6. Commit and push

```bash
git add app/calculator.js
git commit -m "fix: correct multiply operator (+ → *)"
git push -u origin fix/multiply-bug
```

### 7. Open a PR and watch CI

```bash
gh pr create \
  --title "fix: correct multiply operator" \
  --body "Fixes a bug where multiply() used addition instead of multiplication." \
  --base main

gh run watch
```

### 8. Inspect the green run

In the **Actions** tab:
1. Click the completed workflow run.
2. Open the **Run tests with coverage** step.
3. Observe the coverage summary — note the `coverage/` artifact available for download.

---

## Expected outcome

- You opened a PR with a failing CI run.
- You read the failure output in GitHub Actions.
- You fixed the source code and CI turned green.
- You understand how failing tests block a PR.

---

## Bonus challenges

1. Add a fourth `multiply()` test case before pushing the fix — watch CI fail
   again, then pass once you push the fix.
2. Enable the **Require status checks to pass before merging** branch
   protection rule. Try to merge with failing tests.
3. Download the coverage artifact and open `index.html` in your browser.
