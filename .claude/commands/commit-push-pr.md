---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh:*)
description: Commit changes, push branch, and open a PR
---

## Context
- Branch: !`git branch --show-current`
- Status: !`git status`
- Diff: !`git diff`
- Recent commits: !`git log --oneline -10`

## Your task
1) Propose a concise commit message based on the diff.
2) Create a single commit (unless multiple commits are clearly justified).
3) Push to origin.
4) Open a PR via `gh pr create` with a clear title + bullet summary + verification notes.
5) Ensure PR body includes: what changed, why, how verified, risk/rollback.
