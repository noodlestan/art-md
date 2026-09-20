# Plan: Integrate Knowledge

**Id:** `integrate-knowledge`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Integrate knowledge and learnings from milestone execution back into briefings, guides, architecture docs, and records.

**Description:** After the refactoring and conventions iterations, create the missing primitives package architecture, refresh the root architecture documents to reflect the moved contracts and changed constructs-vs-parser semantics, and restore/update the ADR set.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

::READ `$DOMAINS/plans/structures/iteration.art` (Structure) — Define the iteration container for planned changes.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Integrate repository learnings, design decisions, and architectural updates back into documentation following the refactoring and conventions iterations.

## Context

### Upstream Work

| Kind      | Path                                                                        | Role                                                       |
| --------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Milestone | `_roadmap/3-now/milestone-consolidate/milestone.md`                         | Defines this plan as phase 2 of the Consolidate milestone. |
| Plan      | `_backlog/1-done/2026-09-15-plan-refactor-constructs/plan.md`               | Source of the constructs 3-layer refactor.                 |
| Plan      | `_backlog/1-done/2026-09-16-plan-integrate-feedback-and-follow-ups/plan.md` | Source of the processor/integrator normalization.          |
| Plan      | `_backlog/1-done/2026-09-18-plan-apply-conventions-recommendations/plan.md` | Source of the noodlestan conventions adoption.             |

### Knowledge

- ::READ `architecture/index.md` (Knowledge) — Architecture index.
- ::READ `_guide.md` (Knowledge) — System guide.
- ::READ `architecture/_routines/draft-architecture-file.md` (Knowledge) — Architecture document drafting routine (audience, include/exclude guidelines).
- ::READ `libs/constructs/architecture/index.md` (Knowledge) — Constructs package knowledge (updated).
- ::READ `libs/parser/architecture/index.md` (Knowledge) — Parser package knowledge (updated).
- ::READ `libs/serializer/architecture/index.md` (Knowledge) — Serializer package knowledge (updated).

## Scope

### Out of Scope

- Code implementation changes.
- Package records and deployment records.
- `_guide.md` knowledge references (except the primitives architecture link).

### Packages

- Package: Repository Architecture — `architecture/`
- Package: Primitives — `libs/primitives/` (architecture knowledge only)

### Deployments

None.

## Execution Context

Execution occurs in `$PROJECT` on branch `building`.

## Items:

| Iteration / Instructions                                                                                              | Status  |
| --------------------------------------------------------------------------------------------------------------------- | ------- |
| Iteration: Create Primitives Architecture `./plan-integrate-knowledge/instructions/create-primitives-architecture.md` | `DONE`  |
| Iteration: Update Architecture Documents `./plan-integrate-knowledge/instructions/update-architecture-documents.md`   | `DONE`  |
| Iteration: Update Architecture ADRs `./plan-integrate-knowledge/instructions/update-architecture-adrs.md`             | `READY` |

### Iteration: Create Primitives Architecture

**Id:** `create-primitives-architecture`

**Status:** `DONE`

**Report:** `./plan-integrate-knowledge/instructions/create-primitives-architecture__report.md`

**Purpose:** Create the missing `libs/primitives/architecture/` knowledge so the primitives package is documented like its siblings (constructs, parser, serializer).

**Description:** Create `index.md`, `api.md`, and `implementation.md` for `@art-js/primitives`, kept simple and link-don't-copy — the visit context API and implementation details are already described from the parser and constructs perspectives and must be referenced, not duplicated.

**Instructions:** `./plan-integrate-knowledge/instructions/create-primitives-architecture.md`

**Changes:**

- Create `libs/primitives/architecture/index.md` — package purpose, documents table, layout (`src/constructs`, `src/document`, `src/parser`), links to sibling package knowledge.
- Create `libs/primitives/architecture/api.md` — public surface: types (`ConstructBase`, `ContainerConstructBase`, `ArtDocument`, `MdastNode`, `Point`, `Position`, `ParserVisitContext`, `ParserSource`, `OnBeforeConstruct`) and functions (`createArtDocument`, `createParserVisitContext`, `nodePosition`, `sectionDepth`), with contract references to the constructs/parser/serializer `api.md` docs.
- Create `libs/primitives/architecture/implementation.md` — shallow and link-heavy: brief description of the visit context mechanics (`createParserVisitContextBase`: `captureChildConstruct`, `childContext`, `parent`, `onBeforeConstruct`), linking to `libs/parser/architecture/parser.md` (builder perspective) and `libs/constructs/architecture/parsers.md` (construct perspective) for the details.
- Update `libs/primitives/_guide.md` — replace "This package does not maintain a dedicated architecture reference" with a link to the new architecture index.

**Dependencies:**

- None.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ----------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `add-primitives-architecture` | $PROJECT / `building`          | `AUTONOMOUS` | `f81418c` | `COMMITTED` |

##### Commit: `add-primitives-architecture`

**Repository:** Art JS

**Hash:** `f81418c`

**Status:** `COMMITTED`

**Message:**

```
knowledge(primitives): Add primitives architecture knowledge.

- Create `architecture/index.md`, `api.md`, `implementation.md`.
- Link architecture index from `_guide.md`.
```

### Iteration: Update Architecture Documents

**Id:** `update-architecture-documents`

**Status:** `DONE`

**Report:** `./plan-integrate-knowledge/instructions/update-architecture-documents__report.md`

**Purpose:** Refresh the root architecture documents to reflect the refactored package set, moved contracts, and changed constructs-vs-parser semantics.

**Description:** Update `components.md`, `index.md`, `overview.md`, and `principles.md` following the `draft-architecture-file.md` briefing guidelines (audience, include/exclude) captured in the instructions.

**Instructions:** `./plan-integrate-knowledge/instructions/update-architecture-documents.md`

**Changes:**

- `architecture/components.md` — update the four core package sections: Primitives (owns `ArtDocument`, `ConstructBase`, `ParserVisitContext`, `MdastNode`, `Point`, `Position`, parser helpers), Constructs (contract layer: factories, `ConstructProcessor`/`ConstructIntegrator`, `ConstructSerializer`, open registry, concrete constructs), Parser (entry `parse(markdown)`, `ParserConfig`, processor dispatch → default construct), Serializer (entry `serialize(document)`, registry dispatch). Fix stale contract names and entry points. Leave planned/scaffolded package sections (Validator, Program, Bundler, Bin, Dev Server, Watcher, Language Server, Tools, Spec) untouched.
- `architecture/index.md` — move the Principles section to `principles.md`; add Primitives to the Package Architecture References table.
- `architecture/overview.md` — eliminate "## Supporting Packages" (move the primitives bullet into the pipeline section); rename "## Md-Art-Md Roundtrip" to "## Art MD"; replace "is the glue of the ecosystem" with the actual purpose of constructs (contract layer binding parser and serializer); update contract names (`ConstructProcessor`/`ConstructIntegrator`/`ConstructSerializer`), entry points (`parse`, `serialize`), and the dependency claim (parser and serializer DO depend on primitives).
- `architecture/principles.md` — move the four principles from `index.md` (Composition Over Hardcoding, Open Registry, Separation of Concerns, Natural Fallback); add the "Runtime Config and Context Injection" principle (pipeline configured via factories; context injected into hooks; config injection is a future direction).

**Dependencies:**

- Iteration: Create Primitives Architecture — the primitives docs must exist so `index.md` and `overview.md` can link to them.

#### Commits:

| ID                          | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| --------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `refresh-architecture-docs` | $PROJECT / `building`          | `AUTONOMOUS` | `bd42f45` | `COMMITTED` |

##### Commit: `refresh-architecture-docs`

**Repository:** Art JS

**Hash:** `bd42f45`

**Status:** `COMMITTED`

**Message:**

```
knowledge(art-js): Refresh ecosystem architecture docs after refactor.

- Update `components.md`, `index.md`, `overview.md`, `principles.md`.
```

### Iteration: Update Architecture ADRs

**Id:** `update-architecture-adrs`

**Status:** `READY`

**Purpose:** Restore and update the ADR set to capture the design decisions from the refactoring iterations.

**Description:** Rename the restored ADR files to `.md`, create `architecture/adr/art-md.md` capturing the art-md pipeline decisions lifted from the package api/implementation knowledge, and trim the existing ADRs following the WIP comments.

**Instructions:** `./plan-integrate-knowledge/instructions/update-architecture-adrs.md`

**Changes:**

- Rename the restored ADR files to `.md` extension: `architecture/adr/compiler.art` → `compiler.md`, `language.art` → `language.md`, `configuration.art` → `configuration.md` (`_research.md` is already `.md`).
- Create `architecture/adr/art-md.md` with decisions lifted from the package api/implementation knowledge:
  - **Decision: MD Substrate MDAST** — trimmed and reworded from the old "Compiler Based on Unified" (in `architecture/adr/compiler.art`): with mdast, art-md becomes a thin layer for classifying and nesting nodes; the unified-js ecosystem provides everything needed for markdown extensions, HTML conversion, and even solid-mdast-renderer (https://github.com/bigmistqke/solid-mdast-renderer). Note: the old decision proposed building directly on micromark; the implemented parser builds on mdast (`mdast-util-from-markdown`).
  - **Decision: Visitor Architecture** — the parser walks the mdast tree with `unist-util-visit`; constructs claim nodes via processors in order; the builder stays construct-agnostic.
  - **Decision: Context Pattern** — `ParserVisitContext` stack (`captureChildConstruct`, `childContext`, `parent`, `onBeforeConstruct`) injected into hooks; constructs mutate the context to enter/leave capturing mode.
  - **Decision: Constructs Package Structure** — three independent slices: factories, parsers, serializers; one folder per construct per slice.
  - **Decision: Parser/Serializer Independent from Constructs** — construct-agnostic pipeline; wiring happens through config factories; neither names a concrete construct.
  - **Decision: Natural Block Fallback** — unrecognised markdown is preserved as `NaturalBlock`/`NaturalExpression` rather than dropped; the parser classifies, it does not validate.
  - **Decision: Tags Parsing** — `Tag` has no parser factory; tags are extracted by owning constructs' processors via the shared `extractTags` helper.
- Trim the existing ADRs (`compiler.md`, `language.md`, `configuration.md`) following the WIP comments added by the user — these cover a much bigger scope than art-md alone and are restored from an old copy; superseded/scaffold state must not remain in the repo.

**Dependencies:**

- None — the ADR files have been restored by the user.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ------------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `restore-and-update-adrs` | $PROJECT / `building`          | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `restore-and-update-adrs`

**Repository:** Art JS

**Message:**

```
knowledge(art-js): Restore and update ADR set.

- Rename ADR files to `.md`; create `art-md.md`.
- Trim existing ADRs following WIP comments.
```

## Work

### Next

Delegate the plan: execute the READY iteration (`update-architecture-adrs`) via a worker agent. `create-primitives-architecture` and `update-architecture-documents` are DONE.

### Blockers

None.

## Coordination

### Not In Scope

- Code edits.
- Package records and deployment records.
- `_guide.md` knowledge references (except the primitives architecture link).

### Evidence

- `libs/primitives/architecture/` created and linked from `libs/primitives/_guide.md`.
- Root architecture documents reflect the refactored contracts and package set.
- ADR set restored and updated.

### Decisions

- Primitives architecture is simple and link-don't-copy: visit context API/implementation details live in the parser and constructs knowledge and are referenced, not duplicated.
- Root architecture docs are updated in one iteration; ADRs are updated in a separate iteration.
- The art-md ADR (`architecture/adr/art-md.md`) captures the pipeline decisions lifted from the package api/implementation knowledge (MD substrate MDAST, visitor architecture, context pattern, constructs 3-slice structure, parser/serializer independence, natural block fallback, tags parsing).
- The restored ADR files are renamed to `.md` and trimmed following the WIP comments; superseded/scaffold state is not kept in the repo.

### Follow Ups

- None.
