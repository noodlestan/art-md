# Plan: Update Bin Knowledge

**ID:** `update-bin-knowledge`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Capture everything known about the codec bin in `cli/bin/architecture/` and register the package across the project's records, guides, and architecture so the knowledge matches the delivered CLI.

**Description:** The codec bin is a new, documented surface: three executables, a shared operation log and logger, a two-layer command structure, and a deliberate boundary against the codec. None of that is written down yet — `cli/bin/` has no `architecture/` directory, its `_guide.md` still says the package "does not maintain a dedicated architecture reference", `architecture/components.md` describes the bin twice and still names entry points that were never built (`art-md-parser`, `art-md-serializer`, `art-md-validator`), and the repository has no record of the bin's entry points anywhere. This plan writes the package's own architecture reference set, then compares the codec bin against the Art Work CLI to propose concrete `@art-lib` abstractions, registers and describes the package in `$PROJECT/README.md`, `$PROJECT/_guide.md`, `_records/project.art`, and the repository-level `architecture/` documents, and closes the milestone out with its evidence and follow-ups recorded.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the Plan file and its downstream work items. All file references in the Plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                 | Purpose                                                     |
| ------------ | ----------------------------- | ----------------------------------------------------------- |
| `$WORKSPACE` | Current working directory     | Workspace root directory.                                   |
| `$PROJECT`   | `checkouts/art-md-planning`   | Planning checkout for Art MD.                               |
| `$BUILD`     | `checkouts/art-md-building`   | Building checkout for Art MD (implementation).              |
| `$ART_WORK`  | `checkouts/art-work-building` | Art Work checkout (reference CLI implementation to follow). |

## Summary

Write the codec bin's architecture reference set under `cli/bin/architecture/`, compare the codec bin against the Art Work CLI to propose concrete `@art-lib` abstraction packages, register the package across `$PROJECT/README.md`, `$PROJECT/_guide.md`, `_records/project.art`, and the repository-level `architecture/` documents, then close the milestone with its evidence and follow-ups recorded.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

| Kind         | Path                                                               | Role                                                 |
| ------------ | ------------------------------------------------------------------ | ---------------------------------------------------- |
| Milestone    | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md`         | The milestone this plan closes out.                  |
| Design       | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone__design.md` | The design the delivered CLI implements.             |
| Plan         | `$PROJECT/_backlog/6-plan/plan-scaffold-bin-package/plan.md`       | Established the manifest contract and entry points.  |
| Plan         | `$PROJECT/_backlog/6-plan/plan-implement-bin-commands/plan.md`     | Implemented the CLI this plan documents.             |
| Plan         | `$PROJECT/_backlog/6-plan/plan-consolidate-codec-bin/plan.md`      | Produced the `@art-lib` extraction inventory.        |
| Architecture | `$PROJECT/architecture/components.md`                              | Currently describes the bin twice, with stale names. |
| Architecture | `$PROJECT/architecture/overview.md`                                | The ecosystem overview the CLI plugs into.           |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.
- `write-reference-files` — Writes the architecture reference files. Required for Implementing.

### Domains

This section lists all domains involved in the Plan.

| Domain / Path                                 | Description                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating. |
| Domain: Packages `$DOMAINS/packages/index.md` | Represents publishable libraries and CLIs, their grouping and publications.  |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Coordinates long-horizon work and captures milestones.                       |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$PROJECT/architecture/index.md` (Reference) — The repository architecture index the bin reference must be linked from. Relevant for Implementing.
::READ `$PROJECT/architecture/components.md` (Reference) — The components document with the duplicate and stale bin entries. Relevant for Implementing.
::READ `$PROJECT/README.md` (Reference) — The packages table the bin row must describe. Relevant for Implementing.
::READ `$PROJECT/_records/project.art` (Reference) — The project record already listing `Package: Bin`. Relevant for Implementing.
::READ `$ART_WORK/cli/work/architecture/index.md` (Reference) — How the Art Work CLI organises its architecture reference set; the shape to mirror. Relevant for Implementing.
::READ `$ART_WORK/cli/work/architecture/commands.md` (Reference) — The Art Work command reference; the model for the bin's command documentation. Relevant for Implementing.

## Scope

This section describes the working scope coordinated by the Plan.

Write the bin's architecture reference set in `$BUILD/cli/bin/architecture/` and register the package across the project's records, guides, and architecture documents. The code is delivered; only knowledge changes here.

### (Scope) Architecture: Bin Reference Set

**Record:** `$BUILD/cli/bin/architecture/`

**Role:** The package's own architecture documentation — everything known about the bin.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$BUILD/cli/bin/architecture/`

**Changes:**

- Create `architecture/index.md` — the reference index: what the bin is, the layering, the `src/` layout, and links to every document below, following the shape of `$ART_WORK/cli/work/architecture/index.md` and `$PROJECT/libs/parser/architecture/index.md`.
- Create `architecture/entry-points.md` — the three executables: the `art-codec`, `art-parse`, and `art-serialize` `bin` exports, the `src/bin/*.ts` → `dist/esm/bin/*.mjs` build mapping, what each executable registers, and the fact that the codec bin reuses the same command specs and defines no command logic of its own.
- Create `architecture/commands.md` — the command reference: each command's name, arguments, options (`-o, --output <mode>`, `--json`, `-w, --write <file>`), stdin handling via `-`, and worked invocations.
- Create `architecture/operations.md` — the operation model: `OperationOutcome`, the pending/success/failure types, the operation factories, the logger's buffering and output modes, and the log line format, including why the checkout columns of the Art Work log line are absent.
- Create `architecture/dependencies.md` — the package's dependency direction: the bin depends on `@art-md/codec` and `@art-md/primitives` and on `commander`; the codec depends on nothing in the bin; the bin owns its own file I/O and never becomes a `ContentSource`.
- Create `architecture/records/adr/cli.art` — the CLI ADR: the entry-point decision, the shared-builder decision, the `dist/esm/bin/*.mjs` export decision, the `package.json`-sourced version decision, and the `@art-lib` extraction inventory recorded by Plan: Consolidate Codec Bin.
- Update `$BUILD/cli/bin/_guide.md` — replace "This package does not maintain a dedicated architecture reference" with links to the new `architecture/` set, and add the layout and the operating instructions for the commands.

**Dependencies:**

- Plan: Implement Bin Commands — the CLI must be implemented before it can be documented.
- Plan: Consolidate Codec Bin — the `@art-lib` inventory must be recorded before the ADR cites it.

### (Scope) Knowledge: Project Registration

**Record:** `$PROJECT/_records/project.art`, `$PROJECT/README.md`, `$PROJECT/_guide.md`

**Role:** The project-level records and guides that list and describe the packages.

**Partial:**

- `path` — `$PROJECT/`

**Changes:**

- Update `$PROJECT/_records/project.art` — `Package: Bin` is already listed; verify the entry is accurate and add the package's architecture reference path if the record carries one.
- Update `$PROJECT/README.md` — rewrite the `@art-md/bin` packages-table row, which currently reads "CLI for parser/serialization. commands", with a real description, and add a short CLI usage section listing the three commands and a worked `art-codec parse` / `art-codec serialize` example.
- Update `$PROJECT/_guide.md` — expand the `Bin` row of the Projects table so it is described rather than merely named, and add the bin's architecture reference to the Knowledge References list.

**Dependencies:**

- Plan: Implement Bin Commands — the CLI must be implemented before the guides describe it.

### (Scope) Architecture: Repository Knowledge

**Record:** `$PROJECT/architecture/`

**Role:** The repository-level architecture documentation.

**Partial:**

- `path` — `$PROJECT/architecture/`

**Changes:**

- Update `$PROJECT/architecture/components.md` — the bin appears twice, once under "CLI Surface" and again under "Planned Packages". Collapse them into one entry under "CLI Surface" marked `IMPLEMENTED`, describing the three entry points, and delete the stale "Planned Packages" text naming `art-md-parser`, `art-md-serializer`, `art-md-validator`, and the `art-md` consolidated entry with `--write`. Keep the `Validator` entry, which is genuinely still planned.
- Update `$PROJECT/architecture/overview.md` — describe where the CLI sits in the ecosystem: the bin is a thin consumer of `@art-md/codec`, performs its own file I/O, and is not a `ContentSource`.
- Update `$PROJECT/architecture/index.md` — add the `Bin` row to the Package Architecture References table, linking `../cli/bin/architecture/index.md`, and correct the `overview.md` description.
- Ensure `$PROJECT/architecture/codec.md` states the codec's I/O-free boundary and points at the bin as its consumer, so the codec and CLI contracts are not described inconsistently.

**Dependencies:**

- Plan: Implement Bin Commands — the CLI must be implemented before the architecture describes it.

### (Scope) Coordination: Milestone and Backlog

**Record:** `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md`, `$PROJECT/_backlog/_parking-lot.md`

**Role:** The milestone this plan closes and the backlog tracker.

**Partial:**

- `path` — `$PROJECT/_roadmap/3-now/`, `$PROJECT/_backlog/`

**Changes:**

- Update the milestone's `Coordination` — record the Evidence for the delivered CLI (the three entry points running, the coverage thresholds met, the `npm run ci` commits) and the Decision on entry-point naming that supersedes the `components.md` text.
- Carry the `@art-lib` follow-up from Plan: Consolidate Codec Bin into the milestone's Follow Ups and, if it is worth carrying beyond the milestone, into the backlog parking lot.
- Move the four plans out of `6-plan/` as they are completed, following the repository's backlog convention.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; the package knowledge is written in the Art MD building checkout `$BUILD` (checkout `checkouts/art-md-building`) on branch `building` under `$BUILD/cli/bin/architecture/`, and the project-level knowledge is updated in the planning checkout `$PROJECT` (checkout `checkouts/art-md-planning`).

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                                                 | Status  |
| ------------------------------------------------------------------------------------------------------------------------ | ------- |
| Iteration: Create Bin Architecture `./instructions/create-bin-architecture.md`                                           | `READY` |
| Iteration: Propose Art Lib Abstractions `./instructions/propose-art-lib-abstractions.md`                                 | `READY` |
| Iteration: Register Bin in Project Knowledge `./instructions/register-bin-in-project-knowledge.md`                       | `READY` |
| Iteration: Record Bin Follow Ups and Milestone Evidence `./instructions/record-bin-follow-ups-and-milestone-evidence.md` | `READY` |

### Iteration: Create Bin Architecture

**Id:** `create-bin-architecture`

**Status:** `READY`

**Purpose:** Give the bin a complete, self-describing architecture reference set so everything known about it lives in one place.

**Description:** Create the `cli/bin/architecture/` document set — index, entry points, commands, operations, dependencies, and the CLI ADR — and point the package's `_guide.md` at it.

**Instructions:** `./instructions/create-bin-architecture.md`

**Changes:**

- Create `architecture/index.md` — the reference index, the layering, and the `src/` layout.
- Create `architecture/entry-points.md` — the three `bin` exports, the `src/bin/*.ts` → `dist/esm/bin/*.mjs` mapping, and the shared-command-spec guarantee.
- Create `architecture/commands.md` — the command reference with arguments, options, stdin, and worked invocations.
- Create `architecture/operations.md` — the operation model, factories, logger, and log line format.
- Create `architecture/dependencies.md` — the dependency direction and the bin's I/O boundary.
- Create `architecture/records/adr/cli.art` — the entry-point, shared-builder, export-path, and version decisions, plus the `@art-lib` extraction inventory.
- Update `_guide.md` — link the new reference set in place of the "no dedicated architecture reference" note.

**Dependencies:**

- None.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `create-bin-architecture` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `create-bin-architecture`

**Repository:** Art MD

**Message:**

```text
arch(bin): add bin architecture reference set
```

### Iteration: Propose Art Lib Abstractions

**Id:** `propose-art-lib-abstractions`

**Status:** `READY`

**Purpose:** Turn the duplication inventory into concrete, actionable proposals for the Art Lib project so `@art-lib` can be created from evidence rather than guesswork.

**Description:** Write the side-by-side comparison of the codec bin against the Art Work CLI, identify the exact abstraction units that are identical across both projects, and send a structured proposal to the Art Lib project. The comparison is written as a reference file attached to this plan so both projects can cite it.

**Instructions:** `./instructions/propose-art-lib-abstractions.md`

**Changes:**

- Write `./comparison__codec-bin-vs-art-work.md` — the side-by-side comparison covering: operation model, logger, operations log, context factory pattern, command action skeleton, test helpers, log line presentation, config loading, reports, and entry point strategy.
- For each unit, classify as: **extractable** (identical implementation), **pattern-only** (same shape, different types), or **project-specific** (stays put).
- Propose six `@art-lib` packages with their contents, the changes Art Work and codec bin would each make to adopt them, and the units that must stay project-specific.
- Create `$ART_LIB/_backlog/_message-from-art-md-project.md` — a structured message to the Art Lib project summarising the proposals, the evidence, and the recommended priority order.
- Update the plan's `Follow Ups` and `Knowledge to Update` to reference the comparison file and the Art Lib message.

**Dependencies:**

- None.

#### Commits:

| ID                             | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ------------------------------ | -------------------------------- | -------- | ----- | ---------- |
| `propose-art-lib-abstractions` | Art MD / `$PROJECT` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `propose-art-lib-abstractions`

**Repository:** Art MD

**Message:**

```text
docs(bin): propose cli abstractions for art-lib
```

### Iteration: Register Bin in Project Knowledge

**Id:** `register-bin-in-project-knowledge`

**Status:** `READY`

**Purpose:** List and describe the bin properly in the project's records, README, guide, and architecture documents.

**Description:** Fix the duplicated and stale bin entries in the repository architecture, and register the package with an accurate description and a CLI usage section in the project's README, `_guide.md`, and `_records/project.art`.

**Instructions:** `./instructions/register-bin-in-project-knowledge.md`

**Changes:**

- Update `$PROJECT/architecture/components.md` — collapse the duplicate bin entries into one `IMPLEMENTED` entry under "CLI Surface" describing the three entry points; delete the stale planned-package naming; keep the `Validator` entry.
- Update `$PROJECT/architecture/overview.md` — place the bin in the ecosystem as a thin consumer of `@art-md/codec` that owns its own file I/O.
- Update `$PROJECT/architecture/index.md` — add the `Bin` row to the Package Architecture References table and correct the `overview.md` description.
- Ensure `$PROJECT/architecture/codec.md` states the codec's I/O-free boundary and points at the bin as its consumer.
- Update `$PROJECT/README.md` — rewrite the `@art-md/bin` packages-table row and add a CLI usage section with the three commands and a worked example.
- Update `$PROJECT/_guide.md` — describe the `Bin` project row and add the bin's architecture reference to the Knowledge References list.
- Verify `$PROJECT/_records/project.art` — confirm the `Package: Bin` entry is accurate.

**Dependencies:**

- None.

#### Commits:

| ID                                  | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ----------------------------------- | -------------------------------- | -------- | ----- | ---------- |
| `register-bin-in-project-knowledge` | Art MD / `$PROJECT` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `register-bin-in-project-knowledge`

**Repository:** Art MD

**Message:**

```text
docs(bin): register bin in project records, guides, and architecture
```

### Iteration: Record Bin Follow Ups and Milestone Evidence

**Id:** `record-bin-follow-ups-and-milestone-evidence`

**Status:** `READY`

**Purpose:** Close the milestone with its evidence, decisions, and follow-ups recorded, so the work is not left half-documented.

**Description:** Record the delivery evidence and the entry-point naming decision in the milestone's Coordination, carry the `@art-lib` follow-up forward, and move the completed plans through the backlog.

**Instructions:** `./instructions/record-bin-follow-ups-and-milestone-evidence.md`

**Changes:**

- Update `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md` — populate `Evidence` with the three running entry points, the met coverage thresholds, and the `npm run ci` commits; record the Decision that the entry points are `art-codec`, `art-parse`, and `art-serialize`, superseding the `components.md` text; carry the `@art-lib` follow-up into `Follow Ups`.
- Update `$PROJECT/_backlog/_parking-lot.md` — add `@art-lib` creation as a pending follow-up if it is worth carrying beyond the milestone.
- Move the four plans out of `6-plan/` as each completes, following the repository's backlog convention (`3-now` → `1-done`).

**Dependencies:**

- None.

#### Commits:

| ID                                             | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ---------------------------------------------- | -------------------------------- | -------- | ----- | ---------- |
| `record-bin-follow-ups-and-milestone-evidence` | Art MD / `$PROJECT` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `record-bin-follow-ups-and-milestone-evidence`

**Repository:** Art MD

**Message:**

```text
backlog(bin): record follow-ups and milestone evidence
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Delegate Iteration: Create Bin Architecture.

### Blockers

This section lists the impediments to progress and the work items they involve.

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install workspace dependencies.
```

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

**Purpose:** Confirms that a step is correct before continuing.

**Instructions:** (From `$PROJECT/_guide.md`)

Documentation changes must not break the pipeline; run the lint check across the repository root before committing:

```bash
npm run lint # prettier and eslint over all workspaces
```

---

## Coordination

This section describes the boundaries, evidence, and follow ups of this work item.

### Not In Scope

- **Code changes** — this plan changes knowledge only; any code gap found while documenting is raised as a follow-up, not fixed here.
- **Validator documentation** — `@art-md/validator` remains `PLANNED` and keeps its planned-packages entry.
- **Creating `@art-lib`** — the follow-up is recorded, not started.

### Evidence

- None yet.

### Findings

- **The bin is described twice, and one description is wrong** — `architecture/components.md` lists Bin under both "CLI Surface" and "Planned Packages", and the planned-packages text names `art-md-parser`, `art-md-serializer`, `art-md-validator`, and an `art-md` consolidated entry with `--write` — none of which were built.
- **The bin has no architecture reference of its own** — `cli/bin/_guide.md` states the package "does not maintain a dedicated architecture reference", while every other substantive package (`parser`, `serializer`, `constructs`, `primitives`) has one.
- **The README row is a stub** — the `@art-md/bin` row reads "CLI for parser/serialization. commands", which names neither the three executables nor what they do.
- **The bin is already in the records** — `_records/project.art` lists `Package: Bin` and `_guide.md` has a `Bin` project row, but neither describes the entry points.

### Decisions

- **A dedicated `cli/bin/architecture/` set** — the bin has enough distinct surface (three executables, two commands, an operation model, an I/O boundary) to warrant its own reference set, mirroring the Art Work CLI's.
- **One bin entry in `components.md`** — the duplicate CLI-Surface and Planned-Packages entries are collapsed into a single `IMPLEMENTED` entry; only the `Validator` stays planned.
- **Knowledge is split by checkout** — the package's own architecture goes in `$BUILD/cli/bin/architecture/`; the project-level records, README, guide, and repository architecture are updated in `$PROJECT`, matching where each kind of knowledge is curated.
- **The naming decision is recorded explicitly** — the milestone records that `art-codec`, `art-parse`, and `art-serialize` supersede the `art-md-*` names, so the correction is traceable rather than looking like drift.

### Knowledge to Update

- `$BUILD/cli/bin/architecture/index.md` — the bin reference index.
- `$BUILD/cli/bin/architecture/entry-points.md` — the three executables and their build mapping.
- `$BUILD/cli/bin/architecture/commands.md` — the command reference.
- `$BUILD/cli/bin/architecture/operations.md` — the operation model and logger.
- `$BUILD/cli/bin/architecture/dependencies.md` — the dependency direction and I/O boundary.
- `$BUILD/cli/bin/architecture/records/adr/cli.art` — the CLI decisions and the `@art-lib` inventory.
- `$BUILD/cli/bin/_guide.md` — link the reference set.
- `$PROJECT/README.md` — the bin row and a CLI usage section.
- `$PROJECT/_guide.md` — the Bin project row and the Knowledge References list.
- `$PROJECT/_records/project.art` — verify the `Package: Bin` entry.
- `$PROJECT/architecture/components.md` — collapse the duplicate bin entries.
- `$PROJECT/architecture/overview.md` — place the bin in the ecosystem.
- `$PROJECT/architecture/index.md` — add the Bin package architecture reference.
- `$PROJECT/architecture/codec.md` — the codec's I/O-free boundary and its consumer.
- `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md` — evidence, decisions, and follow-ups.
- `$PROJECT/_backlog/_parking-lot.md` — the `@art-lib` follow-up.
- `$PROJECT/_backlog/6-plan/plan-update-bin-knowledge/comparison__codec-bin-vs-art-work.md` — the side-by-side comparison and abstraction proposals.
- `$ART_LIB/_backlog/_message-from-art-md-project.md` — the structured message to the Art Lib project.

### Follow Ups

- **`@art-lib`** — create the shared CLI library package from the inventory recorded in `$BUILD/cli/bin/architecture/records/adr/cli.art` and the comparison in `comparison__codec-bin-vs-art-work.md`.

### Feedback

- None.
