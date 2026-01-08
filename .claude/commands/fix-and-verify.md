---
allowed-tools: Bash(npm run lint), Bash(npm run build), Bash(git diff:*)
description: Fix issues then verify until clean
---

1) Inspect current changes: !`git diff`
2) Fix the problem with minimal edits.
3) Run `/verify`
4) Summarize: root cause, fix, verification results.
