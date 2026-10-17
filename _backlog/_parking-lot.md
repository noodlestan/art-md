# Parking Lot: Art MD Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **PENDING** (waiting), **BLOCKERS** (blocking work), **FOLLOW-UPS** (not in scope). Done items, answered questions, removed blockers, are deleted from the parking lot (tracked in plans if applicable).

## Ongoing

- **Participate in the Art Records Whiteboard (owned by `ART_JS`)** — board at `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`; this project is the highest priority. Our blocking plan `plan-drop-kind-and-reword-claims` is `DONE` and `@art-md/constructs@0.0.4` is published — the chain is unblocked; next touchpoint: `ART_JS` delegates `implement-record-model` (gate lifted 2026-10-17).

---

## ACTIONABLE

- **Ops: Unit-test conventions missing** — `_guide.md` points at `./node_modules/@noodlestan/conventions-unit-tests/art/index.md`; the package is not installed (`ls node_modules/@noodlestan/` has no `conventions-unit-tests`). Install it or fix the guide reference.

## PENDING

- **Ops: Package Records Dependencies** — add `dependencies` back to package records, generate a dependencies.md file in knowledge with graph of internal packages and list of external runtime deps.
- **Routine: Knowledge Files** — There is a draft for 3 different types os files in `knowledge/_routines/draft-architecture-file.md` - abstract, deduplicate, compact and publish to `art-domains`. All useful routines (along with other architect tasks) to expose in a skill. Eventually, an abstract slice of reusable code, belongs in the knowledge domain.

## BLOCKER

None.

---

## Follow-ups

None.
