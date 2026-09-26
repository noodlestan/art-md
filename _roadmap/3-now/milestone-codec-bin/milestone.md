# Milestone: Codec Bin

**ID:** `codec-bin`

**Status:** `PLANNING`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Build the Art MD CLI binaries (`art-codec`, `art-parse`, `art-serialize`) so that parsing and serialising are exposed as consistent, composable command-line tools following the established Art Work CLI patterns.

**Description:** Create the target CLI package exposing three entry points — `bin/codec` (with `parse`/`serialize` commands), `bin/parse`, and `bin/serialize` — exported from `package.json` as `art-codec`, `art-parse`, and `art-serialize`; all three share the same commander builder utilities and the same `doParse`/`doSerialize` implementations, with the `codec` bin reimplementing nothing; then consolidate repeated code between the codec and artwork bins into `@art-lib`.

## Mandatory Reading

::READ `$DOMAINS/roadmaps/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

This section lists the path variables used throughout the Milestone file and its downstream work items. All file references in the Milestone and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                 | Purpose                                                     |
| ------------ | ----------------------------- | ----------------------------------------------------------- |
| `$WORKSPACE` | Current working directory     | Workspace root directory.                                   |
| `$PROJECT`   | `checkouts/art-md-planning`   | Planning checkout for Art MD.                               |
| `$BUILD`     | `checkouts/art-md-building`   | Building checkout for Art MD (implementation).              |
| `$ART_WORK`  | `checkouts/art-work-building` | Art Work checkout (reference CLI implementation to follow). |

## Summary

Create the Art MD CLI binaries (`art-codec`, `art-parse`, `art-serialize`) in the target CLI package, following the Art Work CLI patterns (entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs), so that parsing and serialising are exposed as consistent, composable command-line tools; then consolidate repeated code between the codec and artwork bins into `@art-lib`.

## Attachments

This section lists the files attached to this Milestone.

- `./milestone__design.md` (Design) — Design: Codec Bin CLI.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Milestone.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Milestone.

| Kind         | Path                                                        | Role                                                          |
| ------------ | ----------------------------------------------------------- | ------------------------------------------------------------- |
| Milestone    | `$PROJECT/_roadmap/1-done/milestone-art-codec/milestone.md` | Delivered the `@art-md/codec` package and `createArtCodec()`. |
| Architecture | `$PROJECT/architecture/components.md`                       | Planned packages: Bin (CLI).                                  |
| Architecture | `$PROJECT/architecture/overview.md`                         | Ecosystem overview: parse and serialise directions.           |
| ADR          | `$PROJECT/architecture/adr/art-md.md`                       | Adopted decisions on parser, serializer, and constructs.      |

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
::READ `$ART_WORK/cli/work/src/index.ts` (Reference) — Art Work CLI entry point pattern. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/commands/clone/runClone.ts` (Reference) — Art Work `run{CommandName}` pattern. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/private/commands/doClone.ts` (Reference) — Art Work `do{OperationName}` pattern. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/private/operations/types.ts` (Reference) — Art Work operation types. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/private/logger/createLogger.ts` (Reference) — Art Work logger pattern. Relevant for Implementing.

## Scope

This section describes the working scope coordinated by the Milestone.

Changes in the target CLI package in `$BUILD` (canonical name to be confirmed): create three entry points `bin/codec`, `bin/parse`, and `bin/serialize`, exported from `package.json` as `art-codec`, `art-parse`, and `art-serialize`; all three share the same commander builder utilities and the same `doParse`/`doSerialize` implementations; the `codec` bin registers `parse`/`serialize` commands without reimplementing anything. The detailed design is captured in the `./milestone__design.md` attachment.

### (Scope) Package: Codec Bin

**Record:** To be confirmed — likely `$BUILD/cli/bin/_records/package.art`

**Role:** Owns the three CLI entry points (`bin/codec`, `bin/parse`, `bin/serialize`) and the shared commander builder utilities and `doParse`/`doSerialize` implementations.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$BUILD/cli/bin/`
- `canonicalName` — To be confirmed (likely `@art-md/bin`)

**Changes:**

- Scaffold the package (package.json with `bin` exports, records, `_guide.md`, README, CHANGELOG) including a dummy `src/index.ts`.
- Implement the shared commander builder utilities.
- Implement the shared `doParse`/`doSerialize` operations.
- Implement the three entry points `bin/codec`, `bin/parse`, `bin/serialize`.
- Add unit tests, mocks, and test helpers following the Art Work patterns.

**Dependencies:**

- Package: Codec — `@art-md/codec` must exist first (delivered by Milestone: Art Codec).

## Execution Context

Execution occurs from `$WORKSPACE/`; package work is performed in the Art MD building checkout `$BUILD` (checkout `checkouts/art-md-building`) on branch `building`, under `$BUILD/cli/bin/`. The reference CLI implementation lives in `$ART_WORK` (`checkouts/art-work-building/cli/work`).

---

## Phases

This section describes the ordered phases used to organise downstream work, identifying blocking dependencies across resources of different owners.

| Index | Name        | Status     |
| ----- | ----------- | ---------- |
| #1    | Scaffold    | `PLANNING` |
| #2    | Commands    | `PLANNING` |
| #3    | Consolidate | `PLANNING` |

### Phase: 1 — Scaffold

**Goal:** Scaffold the target CLI package with a working (dummy) entry point so the build/CI pipeline has a real module to resolve.

**Description:** Create the package (package.json with the three `bin` exports, records, `_guide.md`, README, CHANGELOG) and a dummy `src/index.ts`, mirroring the `Scaffold Bin Codec` plan. Includes a dummy `src/index.ts` to avoid the missing-entry-point blocker.

**Status:** `PLANNING`

**Dependencies:**

- None.

### Phase: 2 — Commands

**Goal:** Implement the shared commander builder utilities and the `doParse`/`doSerialize` operations, wired into all three entry points.

**Description:** Implement Bin Parse, Bin Serialize, and Bin Codec plans. All three entry points share the same commander builder utils and the same `doParse`/`doSerialize` implementations; the `codec` bin registers `parse`/`serialize` commands without reimplementing anything.

**Status:** `PLANNING`

**Dependencies:**

- Phase 1 — Scaffold: the package must be scaffolded before commands are implemented.

### Phase: 3 — Consolidate

**Goal:** Apply conventions, refactor, document, and identify follow-ups for abstracting repeated code between the codec and artwork bins into `@art-lib`.

**Description:** Consolidate the codec CLI: apply conventions, refactor, document, and identify follow-ups for abstracting repeated code between the codec and artwork bins into `@art-lib` (a package of Shared libraries and tools for building CLIs and Tools; purpose: build high quality, consistent CLI and Tool experiences from composable units).

**Status:** `PLANNING`

**Dependencies:**

- Phase 2 — Commands: the commands must be implemented before consolidation.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the milestone.

The following items are not yet captured in a work item document.

### Plan: Scaffold Bin Codec

**Status:** `PLANNING`

**Purpose:** Scaffold the target CLI package with a working (dummy) entry point.

**Description:** Create the package (package.json with the three `bin` exports, records, `_guide.md`, README, CHANGELOG) and a dummy `src/index.ts` so the build/CI pipeline has a real module to resolve.

**Changes:**

- Scaffold the package and add a dummy `src/index.ts`.

**Dependencies:**

- None.

### Plan: Implement Bin Parse

**Status:** `PLANNING`

**Purpose:** Implement the `bin/parse` entry point.

**Description:** Implement the `parse` command using the shared commander builder utilities and the shared `doParse` operation, following the Art Work CLI patterns.

**Changes:**

- Implement `bin/parse` entry point.
- Add unit tests, mocks, and test helpers.

**Dependencies:**

- Phase 1 — Scaffold: the package must be scaffolded first.

### Plan: Implement Bin Serialize

**Status:** `PLANNING`

**Purpose:** Implement the `bin/serialize` entry point.

**Description:** Implement the `serialize` command using the shared commander builder utilities and the shared `doSerialize` operation, following the Art Work CLI patterns.

**Changes:**

- Implement `bin/serialize` entry point.
- Add unit tests, mocks, and test helpers.

**Dependencies:**

- Phase 1 — Scaffold: the package must be scaffolded first.

### Plan: Implement Bin Codec

**Status:** `PLANNING`

**Purpose:** Implement the `bin/codec` entry point with `parse`/`serialize` commands.

**Description:** Implement the `codec` bin registering `parse`/`serialize` commands, reusing the shared commander builder utilities and the shared `doParse`/`doSerialize` implementations without reimplementing anything.

**Changes:**

- Implement `bin/codec` entry point with `parse`/`serialize` commands.
- Add unit tests, mocks, and test helpers.

**Dependencies:**

- Phase 1 — Scaffold: the package must be scaffolded first.

---

## Work

### Next

This section states the immediate action needed to advance the Milestone.

Confirm the bin contracts, package record, purpose, description, canonical name, and paths with the user, then lock down the design in `./milestone__design.md` and plan Phase 1.

### Blockers

This section lists the impediments to progress and the work items they involve.

- **Bin contracts and package identity** — the canonical package name, the exact `bin` export names, and the package record path are not yet confirmed; blocks planning of Phase 1.

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

When making changes to the CLI package, execute from `$BUILD/cli/bin/`:

```bash
npm run test # runs vitest against the CLI unit tests
```

---

## Coordination

### Not In Scope

- **`@art-lib` package creation** — abstracting repeated code between the codec and artwork bins into `@art-lib` is a follow-up identified in Phase 3, not part of this milestone's delivery.
- **Concrete content sources** — `FSContentSource`, `MemoryContentSource` remain future work.
- **Validator** — `@art-md/validator` remains PLANNED.

### Evidence

- None yet.

### Findings

- None.

### Decisions

- **Three entry points** — `bin/codec` (with `parse`/`serialize` commands), `bin/parse`, and `bin/serialize`, exported from `package.json` as `art-codec`, `art-parse`, and `art-serialize`.
- **Shared implementations** — all three bins share the same commander builder utilities and the same `doParse`/`doSerialize` implementations; the `codec` bin reimplements nothing.
- **Follow the Art Work patterns** — entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs; unit tests, mocks, and test helpers follow the Art Work CLI patterns.

### Knowledge to Update

- **`architecture/components.md`** — update the Bin package description.
- **`architecture/overview.md`** — describe the CLI entry points.
- **`_records/project.art`** — add the Bin package resource.
- **`README.md`** — add the CLI package to the packages table.
- **`_guide.md`** — add the CLI project.

### Follow Ups

- **`@art-lib`** — abstract repeated code between the codec and artwork bins into a package of Shared libraries and tools for building CLIs and Tools.

### Feedback

- None.
