# Scenario 1 — The Pull Request Flow

**Duration:** ~25 minutes  
**Difficulty:** Beginner  
**Workflow used:** `basic-ci.yml`

---

## Goal

Experience the complete GitHub PR lifecycle: branch → commit → open PR →
review → merge. Get comfortable with the `gh` CLI and the GitHub web UI.

---

## Background

In GitLab you used Merge Requests; in Jenkins you triggered builds manually.
In GitHub the standard unit of work is a **Pull Request** backed by an
automated CI run that must pass before merging.

---

## Steps

### 1. Clone the repository and set up your environment

```bash
# Clone (replace <org> with the actual GitHub org/user)
git clone https://github.com/<org>/github-workshop.git
cd github-workshop

# Install dependencies
npm ci
```

### 2. Create a feature branch

```bash
# Good habit: always branch from the latest main
git checkout main
git pull origin main

git checkout -b feature/add-greeting-<your-name>
```

### 3. Make a small code change

Open `app/calculator.js` and add a `greet` function at the bottom:

```js
/**
 * Returns a greeting string.
 * @param {string} name
 * @returns {string}
 */
function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = { add, subtract, multiply, divide, greet };
```

### 4. Add a passing test

Open `tests/calculator.test.js` and append:

```js
describe('greet()', () => {
  test('returns a greeting', () => {
    expect(greet('GitHub')).toBe('Hello, GitHub!');
  });
});
```

> Don't forget to import `greet` at the top of the test file.

### 5. Commit and push

```bash
git add app/calculator.js tests/calculator.test.js
git commit -m "feat: add greet function"
git push -u origin feature/add-greeting-<your-name>
```

### 6. Open a Pull Request with the `gh` CLI

```bash
gh pr create \
  --title "feat: add greet function" \
  --body "Adds a greet() helper and a passing test." \
  --base main
```

Or open it in the browser:

```bash
gh pr create --web
```

### 7. Request a review

```bash
# Assign a teammate as reviewer
gh pr edit --add-reviewer <teammate-github-handle>
```

Or use the **Reviewers** panel in the GitHub UI.

### 8. Watch the CI run

```bash
# Stream live output from the most recent run on your PR
gh run watch
```

Look at the **Checks** tab in the GitHub PR page. Notice:
- The `basic-ci.yml` workflow triggers automatically.
- The **multiply** tests still fail (we will fix that in Scenario 2).

### 9. Approve and merge

Once a teammate has reviewed:

```bash
# Merge with a merge commit (default)
gh pr merge --merge

# Or squash all commits into one
gh pr merge --squash
```

---

## Expected outcome

- A PR exists and is merged into `main`.
- You have seen CI run automatically on a PR.
- You are comfortable with `gh pr create`, `gh run watch`, and `gh pr merge`.

---

## Bonus challenges

1. Add a PR description template (`.github/pull_request_template.md`).
2. Set a branch protection rule that requires CI to pass before merging.
3. Try `gh pr checkout <number>` to check out a teammate's PR locally.
