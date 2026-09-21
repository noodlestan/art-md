# Parking Lot: Art MD Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## ACTIONABLE

- **Rename README titles** — Currently read legacy name `# artificial-parser` should be package name `# @art-md/parser`.
- **Reword "Pipeline" Prose** — Review `architecture/` and `_roadmap/` and reword any prose that describes the architecture as a “pipeline”, replacing it with accurate language describing the bidirectional relationship between Markdown, the Art AST, parsing, and serialisation without introducing a new architectural abstraction.

## PENDING

- **Ops: Package Records Dependencies** — add `dependencies` back to package records, generate a dependencies.md file in architecture with graph of internal packages and list of external runtime deps.
- **Conventions: Unit Tests (create)** — Create a proposal for new conventions for unit tests. Draft at `conventions/`. Requires deciding (in the `conventions` project context) how the `typescript` should express briefly that other conventions (examples: "unit tests", "script files") can override some of the settings and how in `unit tests` the scope of application is defined and the overriding or discarding of rules is expressed.
- **Routine: Architecture Files** — There is a draft for 3 different types os files in `architecture/_routines/draft-architecture-file.md` - abstract, deduplicate, compact and publish to `art-domains`. All useful routines (along with other architect tasks) to expose in a skill. Eventually, an abstract slice of reusable code, belongs in the knowledge domain.

## BLOCKERS

- None current.
