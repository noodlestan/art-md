# Parking Lot: Art MD Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **PENDING** (waiting), **BLOCKERS** (blocking work), **FOLLOW-UPS** (not in scope). Done items, answered questions, removed blockers, are deleted from the parking lot (tracked in plans if applicable).

## ACTIONABLE

- **Publish `@art-md/constructs@0.0.4`** — kind-free release; the whiteboard gate (`ART_JS` delegation of `implement-record-model`) pins it. Prereqs: push the integrate commit `848781b` (main is 1 ahead), bump `libs/constructs` to `0.0.4`, run `npm run ci`, release.
- **Ops: Unit-test conventions missing** — `_guide.md` points at `./node_modules/@noodlestan/conventions-unit-tests/art/index.md`; the package is not installed (`ls node_modules/@noodlestan/` has no `conventions-unit-tests`). Install it or fix the guide reference.

## PENDING

- **Ops: Package Records Dependencies** — add `dependencies` back to package records, generate a dependencies.md file in knowledge with graph of internal packages and list of external runtime deps.
- **Routine: Knowledge Files** — There is a draft for 3 different types os files in `knowledge/_routines/draft-architecture-file.md` - abstract, deduplicate, compact and publish to `art-domains`. All useful routines (along with other architect tasks) to expose in a skill. Eventually, an abstract slice of reusable code, belongs in the knowledge domain.

## BLOCKERS

- None current.
