# Milestone: Codec Bin

**ID:** `codec-bin`

**Status:** `PLANNING`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Build the Art MD CLI binaries (`art-codec`, `art-parse`, `art-serialize`) so that parsing and serialising are exposed as consistent, composable command-line tools following the established Art Work CLI patterns.

**Description:** Deliver the target CLI package (`@art-md/bin`) exposing three entry points — `bin/codec` (with `parse`/`serialize` commands), `bin/parse`, and `bin/serialize`, exported from `package.json` as `art-codec`, `art-parse`, and `art-serialize`; all three share the same commander builder utilities and the same `doParse`/`doSerialize` implementations, with the `codec` bin reimplementing nothing. The work is decomposed into four plans: scaffold the package, implement the commands, consolidate the duplicated CLI plumbing into an `@art-lib` follow-up, and capture everything about the bin in its own architecture reference set and in the project records, guides, and architecture.

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

Create the Art MD CLI binaries (`art-codec`, `art-parse`, `art-serialize`) in the target CLI package, following the Art Work CLI patterns (entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs), so that parsing and serialising are exposed as consistent, composable command-line tools; then consolidate repeated code between the codec and artwork bins into `@art-lib`. The work is decomposed into four plans under `$PROJECT/_backlog/6-plan/`.

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

Changes in the target CLI package in `$BUILD` (canonical name `@art-md/bin`): create three entry points `bin/codec`, `bin/parse`, and `bin/serialize`, exported from `package.json` as `art-codec`, `art-parse`, and `art-serialize`; all three share the same commander builder utilities and the same `doParse`/`doSerialize` implementations; the `codec` bin registers `parse`/`serialize` commands without reimplementing anything. The detailed design is captured in the `./milestone__design.md` attachment; the per-plan breakdown of changes, iterations, and commits lives in the downstream plans.

### (Scope) Package: Bin

**Record:** `$BUILD/cli/bin/_records/package.art`

**Role:** Owns the three CLI entry points (`bin/codec`, `bin/parse`, `bin/serialize`) and the shared commander builder utilities and `doParse`/`doSerialize` implementations.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$BUILD/cli/bin/`
- `canonicalName` — `@art-md/bin`

**Changes:**

- Complete the package scaffold: dependencies, the three `bin` exports, the lint config, and the package records and docs.
- Implement the shared commander builder utilities, the shared `doParse`/`doSerialize` operations, the operation log and logger, and the three entry points.
- Add unit tests, mocks, and test helpers following the Art Work patterns, and drive coverage over the package's configured thresholds.
- Write the bin's architecture reference set under `$BUILD/cli/bin/architecture/` and register the package in the project records, README, guide, and architecture.

**Dependencies:**

- Package: Codec — `@art-md/codec` must exist first (delivered by Milestone: Art Codec).

## Execution Context

Execution occurs from `$WORKSPACE/`; package work is performed in the Art MD building checkout `$BUILD` (checkout `checkouts/art-md-building`) on branch `building`, under `$BUILD/cli/bin/`. The reference CLI implementation lives in `$ART_WORK` (`checkouts/art-work-building/cli/work`).

---

## Phases

This section describes the ordered phases used to organise downstream work, identifying blocking dependencies across resources of different owners.

| Index | Name        | Status     | Plan                                                           |
| ----- | ----------- | ---------- | -------------------------------------------------------------- |
| #1    | Scaffold    | `PLANNING` | `$PROJECT/_backlog/6-plan/plan-scaffold-bin-package/plan.md`   |
| #2    | Commands    | `PLANNING` | `$PROJECT/_backlog/6-plan/plan-implement-bin-commands/plan.md` |
| #3    | Consolidate | `PLANNING` | `$PROJECT/_backlog/6-plan/plan-consolidate-codec-bin/plan.md`  |
| #4    | Knowledge   | `PLANNING` | `$PROJECT/_backlog/6-plan/plan-update-bin-knowledge/plan.md`   |

### Phase: 1 — Scaffold

**Goal:** Scaffold the target CLI package with a working (dummy) entry point so the build/CI pipeline has a real module to resolve.

**Description:** Complete the package (runtime dependencies, the three `bin` exports, the lint config, the records, `_guide.md`, README, CHANGELOG) and replace the placeholder `src/index.ts` with three stub entry points.

**Status:** `PLANNING`

**Plan:** `$PROJECT/_backlog/6-plan/plan-scaffold-bin-package/plan.md`

**Dependencies:**

- None.

### Phase: 2 — Commands

**Goal:** Implement the shared commander builder utilities and the `doParse`/`doSerialize` operations, wired into all three entry points.

**Description:** Implement the operation log and logger, the codec context and file I/O, `doParse`/`doSerialize` with their `run{CommandName}` layer, the shared commander builders, and the three entry points, with unit tests throughout and a closing coverage iteration.

**Status:** `PLANNING`

**Plan:** `$PROJECT/_backlog/6-plan/plan-implement-bin-commands/plan.md`

**Dependencies:**

- Phase 1 — Scaffold: the package must be scaffolded before commands are implemented.

### Phase: 3 — Consolidate

**Goal:** Apply conventions, refactor, document, and identify follow-ups for abstracting repeated code between the codec and artwork bins into `@art-lib`.

**Description:** Audit the implemented CLI against the TypeScript conventions, refactor the deviations and the internal duplication, and record an evidence-backed `@art-lib` extraction inventory in the bin's CLI ADR.

**Status:** `PLANNING`

**Plan:** `$PROJECT/_backlog/6-plan/plan-consolidate-codec-bin/plan.md`

**Dependencies:**

- Phase 2 — Commands: the commands must be implemented before consolidation.

### Phase: 4 — Knowledge

**Goal:** Capture everything about the bin in `bin/architecture/` and list and describe it properly across the project's records, guides, and architecture.

**Description:** Write the bin's architecture reference set (index, entry points, commands, operations, dependencies, CLI ADR), then register and describe the package in `$PROJECT/README.md`, `$PROJECT/_guide.md`, `_records/project.art`, and the repository `architecture/` documents, and close the milestone with its evidence and follow-ups recorded.

**Status:** `PLANNING`

**Plan:** `$PROJECT/_backlog/6-plan/plan-update-bin-knowledge/plan.md`

**Dependencies:**

- Phase 3 — Consolidate: the `@art-lib` inventory must be recorded before the CLI ADR cites it.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the milestone.

| Plan                                                                                        | Status     |
| ------------------------------------------------------------------------------------------- | ---------- |
| Plan: Scaffold Bin Package `$PROJECT/_backlog/6-plan/plan-scaffold-bin-package/plan.md`     | `PLANNING` |
| Plan: Implement Bin Commands `$PROJECT/_backlog/6-plan/plan-implement-bin-commands/plan.md` | `PLANNING` |
| Plan: Consolidate Codec Bin `$PROJECT/_backlog/6-plan/plan-consolidate-codec-bin/plan.md`   | `PLANNING` |
| Plan: Update Bin Knowledge `$PROJECT/_backlog/6-plan/plan-update-bin-knowledge/plan.md`     | `PLANNING` |

### Plan: Scaffold Bin Package

**Status:** `PLANNING`

**Path:** `$PROJECT/_backlog/6-plan/plan-scaffold-bin-package/plan.md`

**Purpose:** Complete the `@art-md/bin` package scaffold so it declares its dependencies, exports the three CLI entry points, and passes the pipeline.

**Description:** Turn the template-derived scaffold into a real package: add `commander`, `@art-md/codec`, and `@art-md/primitives`; declare the `art-codec`, `art-parse`, and `art-serialize` exports against the built `dist/esm/bin/*.mjs` entries; add the missing `.eslintrc.cjs`; realign the records and docs; land three stub entry points.

**Dependencies:**

- None.

### Plan: Implement Bin Commands

**Status:** `PLANNING`

**Path:** `$PROJECT/_backlog/6-plan/plan-implement-bin-commands/plan.md`

**Purpose:** Implement the `parse` and `serialize` operations and wire them into the three entry points, sharing one set of commander builders, one set of operations, and one logger.

**Description:** Six iterations: the operation log and logger, the codec context and file I/O, the `parse` command, the `serialize` command, the shared command builders and three entry points, and a closing coverage and integration-test iteration.

**Dependencies:**

- Phase 1 — Scaffold: the package must be scaffolded first.

### Plan: Consolidate Codec Bin

**Status:** `PLANNING`

**Path:** `$PROJECT/_backlog/6-plan/plan-consolidate-codec-bin/plan.md`

**Purpose:** Audit the implemented CLI against the TypeScript conventions, refactor what the audit finds, and identify the precise extraction units for `@art-lib`.

**Description:** Two iterations: apply the conventions and collapse the internal duplication behaviour-preservingly, then produce the side-by-side duplication inventory and the recommended `@art-lib` boundary in the bin's CLI ADR.

**Dependencies:**

- Phase 2 — Commands: the commands must be implemented before consolidation.

### Plan: Update Bin Knowledge

**Status:** `PLANNING`

**Path:** `$PROJECT/_backlog/6-plan/plan-update-bin-knowledge/plan.md`

**Purpose:** Capture everything known about the codec bin in `bin/architecture/` and register the package across the project's records, guides, and architecture.

**Description:** Three iterations: create the bin's architecture reference set and link it from its `_guide.md`; register and describe the package in the project README, `_guide.md`, `_records/project.art`, and the repository `architecture/` documents, correcting the duplicate and stale bin entries; then record the milestone's evidence, decisions, and follow-ups.

**Dependencies:**

- Phase 3 — Consolidate: the `@art-lib` inventory must be recorded before the CLI ADR cites it.

---

## Work

### Next

This section states the immediate action needed to advance the Milestone.

Write instructions for the first iteration of Plan: Scaffold Bin Package, then delegate it.

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

When making changes to the CLI package, execute from `$BUILD/cli/bin/`:

```bash
npm run test # runs vitest against the CLI unit tests
```

---

## Coordination

### Not In Scope

- **`@art-lib` package creation** — abstracting repeated code between the codec and artwork bins into `@art-lib` is a follow-up identified in Phase 3, not part of this milestone's delivery.
- **Concrete content sources** — `FSContentSource`, `MemoryContentSource` remain future work; the bin owns its own thin file I/O.
- **Validator** — `@art-md/validator` remains PLANNED; no `validate` command is registered.

### Evidence

- None yet.

### Findings

- **The scaffold is template-derived** — `cli/bin/` was scaffolded with a bundler/validator/compiler/watcher description and no dependencies, so the manifest contract had to be established rather than adjusted.
- **`esbuild-cli` globs every `src/**/_.ts`** — the build emits one bundle per source file under `dist/esm/`, so the three entry points live at `src/bin/{codec,parse,serialize}.ts`and the`bin`exports resolve to`dist/esm/bin/_.mjs`, not to `bin/\*` sources.
- **`__BUILD_VERSION__` is undefined by the build** — the Art Work CLI declares the ambient global but `@noodlestan/esbuild` never defines it, so the bin reads its version from `package.json`.
- **The CLI has no checkout concept** — the Art Work operation log lines carry repo and checkout columns; the codec CLI has neither, so `makeOperationLogLine` drops those columns rather than emitting placeholders.
- **Coverage is enforced, not advisory** — `cli/bin/vitest.config.ts` already sets 90/90/90/75 thresholds, so the closing iteration closes gaps rather than raising a target.
- **The bin is described twice, and one description is wrong** — `architecture/components.md` lists Bin under both "CLI Surface" and "Planned Packages", and the planned-packages text names `art-md-parser`, `art-md-serializer`, `art-md-validator`, and an `art-md` consolidated entry with `--write` — none of which were built.

### Decisions

- **Three entry points** — `bin/codec` (with `parse`/`serialize` commands), `bin/parse`, and `bin/serialize`, exported from `package.json` as `art-codec`, `art-parse`, and `art-serialize`.
- **Shared implementations** — all three bins share the same commander builder utilities and the same `doParse`/`doSerialize` implementations; the `codec` bin reimplements nothing.
- **Follow the Art Work patterns** — entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs; unit tests, mocks, and test helpers follow the Art Work CLI patterns.
- **Bin exports point at build output** — the exports resolve to `./dist/esm/bin/*.mjs`, matching the Art Work CLI's `bin` shape and the `esbuild-cli` output layout.
- **The bin owns its I/O** — `readInput`/`writeOutput` use `node:fs/promises` directly; the codec stays I/O-free and `FSContentSource` stays future work.
- **No ambient build-version global** — the version is read from `package.json` at runtime.
- **Four plans, phases one to one** — each phase maps to exactly one plan, and the last plan captures all knowledge about the bin.

### Knowledge to Update

Captured by Plan: Update Bin Knowledge.

- **`cli/bin/architecture/`** — the bin's reference set: index, entry points, commands, operations, dependencies, and the CLI ADR.
- **`architecture/components.md`** — collapse the duplicate bin entries into one `IMPLEMENTED` entry.
- **`architecture/overview.md`** — place the bin in the ecosystem.
- **`architecture/index.md`** — add the Bin package architecture reference.
- **`_records/project.art`** — verify the Bin package resource.
- **`README.md`** — describe the bin and add a CLI usage section.
- **`_guide.md`** — describe the Bin project and link its architecture reference.

### Follow Ups

- **`@art-lib`** — abstract repeated code between the codec and artwork bins into a package of Shared libraries and tools for building CLIs and Tools.

### Feedback

- None.
