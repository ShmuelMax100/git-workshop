# Scenario 5 — Security Checks in CI

**Duration:** ~25 minutes  
**Difficulty:** Intermediate  
**Workflow used:** `security.yml`

---

## Goal

Intentionally introduce two common security issues into the codebase, watch the
`security.yml` workflow catch them, then fix both issues and get a green run.

---

## Background

The `security.yml` workflow runs three checks:
1. **`npm audit`** — fails on high/critical CVEs in dependencies.
2. **Banned package check** — rejects packages on an internal policy list.
3. **Secret scan** — detects hard-coded credentials in source files.

This mirrors real-world shift-left security: catch issues in CI before they
reach production.

---

## Part A — Hard-coded secret

### 1. Introduce a fake secret

Open `app/index.js` and add a line near the top:

```js
// WORKSHOP: Simulated hard-coded credential — DO NOT do this in real code
const API_KEY = "super_secret_api_key_12345";
```

### 2. Commit and push to a branch

```bash
git checkout -b security/introduce-issues
git add app/index.js
git commit -m "chore: add test credential (intentionally bad)"
git push -u origin security/introduce-issues
gh pr create --title "security: demo issues" --body "Intentional issues for scenario 5." --base main
```

### 3. Watch the security workflow fail

```bash
gh run watch
```

The **Secret Scan** job should fail with an annotation pointing to the line
containing `API_KEY`.

### 4. Fix it — use a GitHub Secret instead

Remove the hard-coded value from `app/index.js`:

```js
// Read from environment variable, set via GitHub Secrets
const API_KEY = process.env.API_KEY;
```

Then go to **Settings → Secrets and variables → Actions** and add:
- Name: `API_KEY`
- Value: (any placeholder value for the workshop)

---

## Part B — Banned package

### 5. Add a banned dependency

```bash
# left-pad is on the banned list in security.yml
npm install left-pad --save
```

Commit the updated `package.json` and `package-lock.json`:

```bash
git add package.json package-lock.json
git commit -m "chore: add left-pad (intentionally banned)"
git push
```

### 6. Watch the dependency audit job fail

The **Banned packages** step should print:

```
::error::Banned package detected: left-pad
::error::Security check failed — remove banned packages before merging.
```

### 7. Fix it — remove the banned package

```bash
npm uninstall left-pad
git add package.json package-lock.json
git commit -m "fix: remove banned left-pad package"
git push
```

---

## Part C — Put it all together

### 8. Verify both fixes

After your last push, watch the security workflow:

```bash
gh run watch
```

All three jobs (`dependency-audit`, `secret-scan`, `security-gate`) should
be green.

---

## Expected outcome

- You introduced two deliberate security issues and saw CI catch them.
- You understand the difference between dependency scanning and secret scanning.
- You know how to use GitHub Secrets instead of hard-coded credentials.
- `security-gate` acts as a single required status check for branch protection.

---

## Bonus challenges

1. Add `left-pad` to the banned list in `security.yml` *before* introducing it,
   then push — see the check fail immediately without even installing it.
2. Use `gh secret set API_KEY` to set the secret from the CLI instead of the UI.
3. Explore GitHub's built-in **Secret scanning** and **Dependabot** features
   in the repository **Security** tab.
