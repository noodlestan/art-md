# Parking Lot: Art MD Roadmap

WIP tracker for the roadmap, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope). Decisions live in the ADRs (`architecture/records/adr/`); the work sequence lives in `_architect.md`.

## ACTIONABLE

- Create Milestone for `bin/parse` and `bin/serialize`.
- **TagReference** — WIP in `expressions/tag.art`: backticked `#<identifier>` reference for use in instructions.
- **Grammar constructs WIP** — from `art-js/spec/grammar/_wip.md`: Procedure, Procedure Block, Workflow, Directives, Semantics, and Artificial Meta-Syntax.
- **Spec templates and files WIP** — `art-js/spec/_wip.md` has `### Template <!-- WIP -->` and `### File <!-- WIP -->`.

## PENDING

- **Primitive spec: valueType, value, and per-projection forms** — candidate directions undecided: (1) strip primitives to `valueType` + `value` and formalise the TS code-block expression; (2) remove `valueType`/`value` until the parser can bootstrap the expression form; (3) resolve the `art` overload question first (if `art` is the source-code expression, it is not a projection). Legacy `#### Art / Generation / Interpretation` sections in `primitives/*.art` are pre-projection-era dead prototypes.
- **Primitive spec cleanup** — legacy `#### Art: Inline/Block`, `#### Generation`, `#### Interpretation` sections in `primitives/*.art` (pre-projection era).
- **Spec routines reference** — from `art-js/spec/routines/_wip.md`: Reference section (Processing Input, Invoking Commands/Routines/Templates, General Statement Rules, Rules for Formatting Statements).

## BLOCKER

- None current.

## FOLLOW-UPS (not in scope)

- None.
