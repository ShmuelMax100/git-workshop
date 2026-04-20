# GitHub CLI (`gh`) Cheat Sheet

Quick reference for the commands used throughout the workshop.

---

## Authentication

```bash
gh auth login          # authenticate with GitHub (browser or token)
gh auth status         # check current auth status
```

---

## Repositories

```bash
gh repo clone <owner>/<repo>          # clone a repo
gh repo view                          # view current repo in browser
gh repo view --web                    # open in browser
```

---

## Pull Requests

```bash
# Create a PR
gh pr create                                    # interactive wizard
gh pr create --title "..." --body "..." --base main
gh pr create --web                              # open creation form in browser
gh pr create --draft                            # open as draft PR

# List & view
gh pr list                                      # all open PRs
gh pr view <number>                             # PR summary in terminal
gh pr view <number> --web                       # open in browser

# Review
gh pr review <number> --approve
gh pr review <number> --request-changes --body "Please fix X"
gh pr review <number> --comment --body "Looks good, one nit"

# Checkout a colleague's PR locally
gh pr checkout <number>

# Edit
gh pr edit <number> --add-reviewer <handle>
gh pr edit <number> --add-label "bug"
gh pr edit <number> --title "new title"

# Merge
gh pr merge <number> --merge        # merge commit
gh pr merge <number> --squash       # squash and merge
gh pr merge <number> --rebase       # rebase and merge
gh pr merge --auto                  # auto-merge when checks pass
```

---

## Actions / Workflow Runs

```bash
# List recent runs
gh run list
gh run list --workflow basic-ci.yml
gh run list --branch feature/my-branch

# Watch a live run (streams output)
gh run watch
gh run watch <run-id>

# View run details
gh run view <run-id>
gh run view <run-id> --log             # full logs
gh run view <run-id> --log-failed      # only failed steps

# Re-run
gh run rerun <run-id>                  # re-run entire workflow
gh run rerun <run-id> --failed         # re-run only failed jobs
gh run rerun --job <job-id>            # re-run a single job

# Download artifacts
gh run download <run-id>
gh run download <run-id> --name coverage-report
```

---

## Secrets

```bash
gh secret set MY_SECRET                        # prompts for value
gh secret set MY_SECRET --body "value"
gh secret list
gh secret delete MY_SECRET
```

---

## Issues

```bash
gh issue create --title "Bug: ..." --body "..."
gh issue list
gh issue view <number>
gh issue close <number>
```

---

## Useful aliases

Add to your shell profile:

```bash
alias gpr="gh pr create --web"
alias grl="gh run list"
alias grw="gh run watch"
```

---

## GitLab → GitHub quick mapping

| GitLab | GitHub equivalent |
|--------|-------------------|
| Merge Request | Pull Request (`gh pr`) |
| `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| Pipeline | Workflow run (`gh run`) |
| `CI_COMMIT_SHA` | `github.sha` |
| `CI_BRANCH` | `github.ref_name` |
| `CI_JOB_TOKEN` | `GITHUB_TOKEN` (automatic) |
| Artifacts | `actions/upload-artifact` |
| Cache | `actions/cache` |
| Environments | `environment:` block in workflow |
| Protected branches | Branch protection rules |
