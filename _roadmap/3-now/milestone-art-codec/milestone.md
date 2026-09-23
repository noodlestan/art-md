# Milestone: Art Codec

**ID:** `art-codec`

**Status:** `DONE`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Implement the codec and source contracts for document-level parsing and serialisation, with operation contexts, so that the parser and serializer can operate on content sources and the CLI can be configured via a codec.

**Description:** Declare the source and codec contracts in `@art-md/primitives`, implement the `@art-md/codec` package with `createArtCodec()`, add operation contexts (`ParseContext`, `SerializeContext`) and overloaded entry points to the parser and serializer, and update the architecture knowledge.

## Mandatory Reading

::READ `$DOMAINS/roadmaps/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

This section lists the path variables used throughout the Milestone file and its downstream work items. All file references in the Milestone and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path               | Purpose                       |
| ------------ | --------------------------- | ----------------------------- |
| `$WORKSPACE` | Current working directory   | Workspace root directory.     |
| `$PROJECT`   | `checkouts/art-md-planning` | Planning checkout for Art MD. |

## Summary

Implement the codec and source contracts in `@art-md/primitives` and the `@art-md/codec` package, add operation contexts and overloaded entry points to the parser and serializer, and update the architecture knowledge, so that document-level parsing and serialisation can be configured via a codec and operate on content sources.

## Attachments

This section lists the files attached to this Milestone.

- `./milestone__design.md` (Design) — Design: Art Codec and Source Contracts.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Milestone.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Milestone.

| Kind         | Path                                  | Role                                                              |
| ------------ | ------------------------------------- | ----------------------------------------------------------------- |
| Architecture | `$PROJECT/architecture/components.md` | Planned packages: Codec and Source (Source superseded by design). |
| Architecture | `$PROJECT/architecture/overview.md`   | Ecosystem overview: parse and serialise directions.               |
| ADR          | `$PROJECT/architecture/adr/art-md.md` | Adopted decisions on parser, serializer, and constructs.          |
| Parking Lot  | `$PROJECT/_roadmap/_parking-lot.md`   | Roadmap WIP tracker.                                              |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Milestone.

- `write-milestone` — Writes this milestone. Required for Planning Work Item.
- `write-plan` — Writes the downstream plans. Required for Planning Work Item.
- `render-template` — Renders milestone and plan artefacts. Required for Drafting, Refining.

### Domains

This section lists all domains involved in the Milestone.

| Domain / Path                                 | Description                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Coordinates long-horizon work across projects by capturing milestones.      |
| Domain: Plans `$DOMAINS/plans/index.md`       | Structures high-level implementation plans with delegatable instructions.   |
| Domain: Work `$DOMAINS/work/index.md`         | Defines the abstract work-item model shared by planning domains.            |
| Domain: Packages `$DOMAINS/packages/index.md` | Represents publishable libraries and CLIs, their grouping and publications. |

### Resource Kinds in Scope

This section lists the kinds of resources included in the work scope of the Milestone.

| Kind    | Domain   | Structure Record Path                      |
| ------- | -------- | ------------------------------------------ |
| Package | Packages | `$DOMAINS/packages/structures/package.art` |

### Workflows

This section lists all workflows involved in the Milestone.

| Workflow / Path                                                      | Purpose                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Roadmapping `$DOMAINS/roadmaps/workflows/roadmapping/workflow.art`   | Organize roadmap creation and maintenance and coordination of downstream work items.    |
| Planning Work `$DOMAINS/work/workflows/planning-work/workflow.art`   | Create and manage work items lifecycle, collecting operational instructions.            |
| Executing Work `$DOMAINS/work/workflows/executing-work/workflow.art` | Organizes work execution in order to produce completed, verified outcomes and feedback. |

### Workflow Operations

This section lists all workflow operations involved in the Milestone.

| Workflow / Operation / Path                                                                                         | Purpose                                                       |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Planning Work / Planning Work Item `$DOMAINS/work/workflows/planning-work/planning-work-item/operation.art`         | Draft, refine, and validate work items.                       |
| Planning Work / Writing Commit Message `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art` | Write standardized commit messages.                           |
| Executing Work / Setting Up `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`                       | Prepare the execution environment.                            |
| Executing Work / Verifying Completion `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`   | Confirm the work item is completed and satisfies its outcome. |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.

## Scope

This section describes the working scope coordinated by the Milestone.

Changes in 4 packages in `$PROJECT`: `@art-md/primitives` gains the source and codec contracts and the operation contexts; `@art-md/codec` is created with the configured implementation and `createArtCodec()`; `@art-md/parser` and `@art-md/serializer` gain overloaded entry points accepting operation contexts. No new `@art-md/source` package is created — source contracts live in primitives. The detailed design is captured in the `./milestone__design.md` attachment.

### (Scope) Package: Primitives

**Record:** `$PROJECT/libs/primitives/_records/package.art`

**Role:** Hosts the source and codec contracts and the operation contexts.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/primitives/`
- `canonicalName` — `@art-md/primitives`

**Changes:**

- Add `source/` with `ArtContentSource`, `ArtDocumentSource`, and `createArtDocumentSource()`.
- Add `codec/` with the `ArtCodec` contract.
- Add `parser/context/` `ParseContext` and `createParseContext()`.
- Add `serializer/context/` `SerializeContext` and `createSerializeContext()`.

**Dependencies:**

- None.

### (Scope) Package: Codec

**Record:** To be created at `$PROJECT/libs/codec/_records/package.art`

**Role:** Owns the configured codec implementation and `createArtCodec()`.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/codec/`
- `canonicalName` — `@art-md/codec`

**Changes:**

- Scaffold the package (package.json, records, `_guide.md`, README, CHANGELOG).
- Implement `ArtCodecConfig`, `PartialArtCodecConfig`, and `createArtCodec()`.
- Implement the overloaded `parse`/`serialize` API.

**Dependencies:**

- Package: Primitives — the `ArtCodec` contract must exist first.

### (Scope) Package: Parser

**Record:** `$PROJECT/libs/parser/_records/package.art`

**Role:** Gains overloaded entry points accepting raw markdown or `ParseContext`.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/parser/`
- `canonicalName` — `@art-md/parser`

**Changes:**

- Change `parse` to accept either raw markdown or `ParseContext`; the raw-string overload creates the context internally.

**Dependencies:**

- Package: Primitives — `ParseContext` must exist first.

### (Scope) Package: Serializer

**Record:** `$PROJECT/libs/serializer/_records/package.art`

**Role:** Gains overloaded entry points accepting an `ArtDocument` or `SerializeContext`.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/serializer/`
- `canonicalName` — `@art-md/serializer`

**Changes:**

- Change `serialize` to accept either an `ArtDocument` or `SerializeContext`; the direct-document overload creates the context internally.

**Dependencies:**

- Package: Primitives — `SerializeContext` must exist first.

## Execution Context

Execution occurs from `$WORKSPACE/`; package work is performed in the Art MD checkout `$PROJECT` (checkout `checkouts/art-md-building`) on branch `building`, under `$PROJECT/libs/`.

---

## Phases

This section describes the ordered phases used to organise downstream work, identifying blocking dependencies across resources of different owners.

| Index | Name                               | Status |
| ----- | ---------------------------------- | ------ |
| #1    | Spec                               | `DONE` |
| #2    | Primitives Contracts               | `DONE` |
| #3    | Parser and Serializer Entry Points | `DONE` |
| #4    | Codec Package                      | `DONE` |
| #5    | Knowledge                          | `DONE` |

### Phase: 1 — Spec

**Goal:** Create `architecture/codec.md` as the implementation spec along with `milestone__design.md` with all implementation details.

**Description:** Write the implementation spec capturing the design: contracts in primitives, codec package, operation contexts, overloaded entry points, and dependency direction. Lock down details in `milestone__design.md`.

**Status:** `DONE`

**Dependencies:**

- None.

### Phase: 2 — Primitives Contracts

**Goal:** Declare the source and codec contracts and operation contexts in `@art-md/primitives`.

**Description:** Add `source/`, `codec/`, `parser/context/` (`ParseContext`), and `serializer/context/` (`SerializeContext`) to primitives.

**Status:** `DONE`

**Dependencies:**

- Phase 1 — Spec: the spec must exist before implementation.

### Phase: 3 — Parser and Serializer Entry Points

**Goal:** Change parser and serializer entry points to accept operation contexts and config and remove the dependency on the internal config along with the dependency on constructs. Will require updating `cli/pipeline-tests` to (temporarily) assemble the config before invoking parse serialize with markdown and config.

**Description:** `parse` accepts raw markdown or `ParseContext`; `serialize` accepts an `ArtDocument` or `SerializeContext`.

**Status:** `DONE`

**Dependencies:**

### Phase: 4 — Codec Package

**Goal:** Create the `@art-md/codec` package.

**Description:** Scaffold the package and implement `ArtCodecConfig`, `PartialArtCodecConfig`, `createArtCodec()`, and the overloaded `parse`/`serialize`. Rename `cli/pipeline-tests` to `cli/codec-test` and make the test scripts use the `codec` packages as opposed to parser and config directly.

**Status:** `DONE`

**Dependencies:**

- Phase 2 — Primitives Contracts: the `ArtCodec` contract must exist first.

- Phase 2 — Primitives Contracts: the operation contexts must exist first.

### Phase: 5 — Knowledge

**Goal:** Update knowledge resources to reflect the codec and source contracts.

**Description:** Update `_records/project.art`, README, root `_guide`, `architecture/components.md`, `architecture/overview.md`, `architecture/adr/codec.md`, and the primitives architecture; ensure `architecture/codec.md` matches the implementation.

**Status:** `DONE`

**Dependencies:**

- Phase 3 — Codec Package: knowledge reflects the implemented package.
- Phase 4 — Parser and Serializer Entry Points: knowledge reflects the changed entry points.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the milestone.

| Phase | Resource / Record                                                                                                            | Status |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1     | Plan: Create Codec Spec `$PROJECT/_backlog/1-done/plan-create-codec-spec/plan.md`                                            | `DONE` |
| -     |                                                                                                                              |        |
| 2     | Plan: Implement Primitives Contracts `$PROJECT/_backlog/3-now/plan-implement-primitives-contracts/plan.md`                   | `DONE` |
| -     |                                                                                                                              |        |
| 3     | Plan: Update Parser and Serializer Entry Points `$PROJECT/_backlog/3-now/plan-update-parser-serializer-entry-points/plan.md` | `DONE` |
| -     |                                                                                                                              |        |
| 4     | Plan: Implement Codec Package `$PROJECT/_backlog/3-now/plan-implement-codec-package/plan.md`                                 | `DONE` |
| -     |                                                                                                                              |        |
| 5     | Plan: Update Codec Knowledge `$PROJECT/_backlog/3-now/plan-update-codec-knowledge/plan.md`                                   | `DONE` |

---

## Work

### Next

This section states the immediate action needed to advance the Milestone.

Delegate the READY plans: `implement-primitives-contracts`, `update-parser-serializer-entry-points`, `implement-codec-package`, `update-codec-knowledge`.

### Blockers

This section lists the impediments to progress and the work items they involve.

- None.

---

## Operating Instructions

### Setting Up

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

Run from the workspace root:

```bash
npm ci # to install workspace dependencies.
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Coordination

### Not In Scope

- **Implementing concrete content sources** — `FSContentSource`, `MemoryContentSource` are examples of the pattern; their implementation is future work.
- **CLI integration** — the `@art-md/bin` CLI is configured via the codec later; not part of this milestone.
- **Validator** — `@art-md/validator` remains PLANNED.

### Evidence

- None yet.

### Findings

- None.

### Decisions

- **Contracts in primitives** — source contracts (`ArtContentSource`, `ArtDocumentSource`) and the `ArtCodec` contract live in `@art-md/primitives`; `@art-md/codec` owns the implementation and `createArtCodec()`.
- **Operation contexts** — `ParseContext` and `SerializeContext` carry `uri: string` — the document source identifier; parser and serializer entry points accept them via overloads.
- **Dependency direction** — ContentSource → operation Context → Codec → ArtDocument; `ArtDocumentSource` composes an `ArtContentSource` and an `ArtCodec`.

### Knowledge to Update

- **`architecture/codec.md`** — create as the implementation spec (Phase 1).
- **`architecture/adr/codec.md`** — establish context, use cases, purpose and principles; dependency direction.
- **`architecture/components.md`** — update planned packages (remove Source; describe codec contract in primitives).
- **`architecture/overview.md`** — describe the dependency direction.
- **`libs/primitives/architecture/index.md` and `api.md`** — document the new contracts.
- **`_records/project.art`** — add the Codec package resource.
- **`README.md`** — add the codec package to the packages table.
- **`_guide.md`** — add the Codec project.

### Follow Ups

- Decide whether concrete content sources (`FSContentSource`, `MemoryContentSource`) are implemented in a follow-up milestone.
- Move the plan drafts from `_roadmap/6-plan/` to `_backlog/3-now/` when actionable.

### Feedback

- None.
