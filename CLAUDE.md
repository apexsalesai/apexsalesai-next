# Claude Code Team Rules (Repo Memory)

## Non-negotiables
- Always produce a PLAN before edits for any non-trivial change (use Plan mode).
- Always run verification after changes: typecheck + tests (or the project's equivalent).
- Keep edits minimal and consistent with existing patterns.

## Workflow
- Package manager: use `npm`.
- Prefer small, reviewable commits. Avoid drive-by refactors.

## Code style rules
- Prefer `type` over `interface` when appropriate.
- Never introduce `enum` - use string literal unions instead.
- Avoid widening types; keep types precise.

## Verification commands
- Lint: `npm run lint`
- Build: `npm run build`

## "Claude mistakes" log (append-only)
- If Claude does X wrong, add a bullet here describing what to do instead.
