# GitHub Workshop — GitLab/Jenkins to GitHub

A hands-on, 3.5-hour workshop for development teams migrating from
GitLab/Jenkins to GitHub. Work through five progressive scenarios using a real
Node.js application and GitHub Actions CI pipeline.

---

## Repository map

```
.
├── app/                        Application code
│   ├── calculator.js           Core functions (contains an intentional bug)
│   └── index.js                Express API server
│
├── tests/                      Test suite
│   ├── calculator.test.js      Unit tests — some PASS, some FAIL (intentional)
│   └── api.test.js             Integration tests — all PASS
│
├── .github/
│   └── workflows/
│       ├── basic-ci.yml        ✅ Working — standard PR pipeline
│       ├── broken-ci.yml       ❌ Broken — debugging exercise
│       ├── advanced-ci.yml     ⚙️  Advanced — matrix, cache, outputs, deploy
│       └── security.yml        🔒 Security — audit, secret scan, banned packages
│
├── scenarios/                  Step-by-step exercise guides
│   ├── scenario-1-pr-flow.md
│   ├── scenario-2-ci-failure.md
│   ├── scenario-3-debugging.md
│   ├── scenario-4-workflow-build.md
│   └── scenario-5-security.md
│
├── solutions/                  Reference solutions (instructor use)
│   ├── code/calculator-fixed.js
│   └── workflows/
│       ├── broken-ci-fixed.yml
│       └── my-pipeline-complete.yml
│
├── docs/                       Reference material
│   ├── cheatsheet.md           gh CLI commands + GitLab/GitHub mapping
│   ├── github-actions-basics.md  Core Actions concepts with analogies
│   └── troubleshooting.md      Common failures + debug tips
│
├── INSTRUCTOR.md               Facilitator guide (schedule, spoilers, tips)
└── README.md                   This file
```

---

## Quick start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| npm | ≥ 9 | bundled with Node |
| Git | any | https://git-scm.com |
| gh CLI | ≥ 2.40 | https://cli.github.com |

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/github-workshop.git
cd github-workshop

# 2. Install dependencies
npm ci

# 3. Run tests locally (expect 3 failures — that is intentional)
npm test

# 4. Start the API server
npm start
# → Calculator API running on port 3000

# 5. Authenticate with GitHub
gh auth login
```

### Verify your setup

```bash
# Should show 3 failing multiply() tests
npm test

# Should return {"status":"ok"}
curl http://localhost:3000/health

# Should list open PRs (or "no open pull requests")
gh pr list
```

---

## Workshop scenarios

Work through the scenarios in order. Each builds on concepts from the previous.

| # | Scenario | Concept | Duration |
|---|----------|---------|----------|
| 1 | [PR Flow](scenarios/scenario-1-pr-flow.md) | Branch → PR → Review → Merge | 25 min |
| 2 | [CI Failure](scenarios/scenario-2-ci-failure.md) | Fix failing tests, read CI logs | 25 min |
| 3 | [Debugging](scenarios/scenario-3-debugging.md) | Debug a broken workflow | 30 min |
| 4 | [Build a Workflow](scenarios/scenario-4-workflow-build.md) | Matrix, cache, job outputs | 35 min |
| 5 | [Security](scenarios/scenario-5-security.md) | Dependency audit, secret scanning | 25 min |

---

## Reference docs

| Doc | What's in it |
|-----|-------------|
| [cheatsheet.md](docs/cheatsheet.md) | `gh` CLI commands, GitLab → GitHub mapping |
| [github-actions-basics.md](docs/github-actions-basics.md) | `on`, `jobs`, `needs`, `secrets`, artifacts, matrix |
| [troubleshooting.md](docs/troubleshooting.md) | Common errors, debug tips, `ACTIONS_STEP_DEBUG` |

---

## Intentional issues in this repo

The following are **by design** — do not fix them until the relevant scenario:

| Location | Issue | Used in |
|----------|-------|---------|
| `app/calculator.js:34` | `multiply()` uses `+` instead of `*` | Scenario 2 |
| `.github/workflows/broken-ci.yml` | Three bugs (wrong commands, bad path) | Scenario 3 |

---

## Running the tests

```bash
npm test             # watch mode
npm run test:ci      # CI mode with coverage report
```

Expected baseline output:

```
PASS  tests/api.test.js         (5 tests)
FAIL  tests/calculator.test.js
  ✓ add() — 3 tests
  ✓ subtract() — 2 tests
  ✗ multiply() — 3 tests FAIL  ← intentional
  ✓ divide() — 2 tests
```

---

## Instructor resources

See [INSTRUCTOR.md](INSTRUCTOR.md) for:
- Full session schedule with timing
- Bug spoilers for each scenario
- Common participant questions and answers
- Live demo tips
