# Plan: Consolidate Codec Bin

**ID:** `consolidate-codec-bin`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Audit the implemented codec CLI against the TypeScript conventions, refactor what the audit finds, and identify the precise extraction units for the `@art-lib` shared CLI library.

**Description:** With the three entry points and both operations implemented, this plan brings the package in line with the repository's TypeScript conventions, removes duplication the implementation introduced, and produces a concrete, evidence-backed inventory of the CLI plumbing duplicated between `cli/bin` and `$ART_WORK/cli/work` — the operation model, the logger, the operation log line presentation, the program builder, and the context factory — so that `@art-lib` can be created as a follow-up rather than guessed at. It deliberately does **not** create `@art-lib`.

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

Audit the implemented `@art-md/bin` against the TypeScript conventions, refactor the deviations and internal duplication, and produce an evidence-backed inventory of the CLI plumbing shared with the Art Work CLI so `@art-lib` can be extracted as a follow-up.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

| Kind      | Path                                                               | Role                                                  |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md`         | Coordinates this plan within the Codec Bin milestone. |
| Design    | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone__design.md` | Names the `@art-lib` consolidation follow-up.         |
| Plan      | `$PROJECT/_backlog/6-plan/plan-implement-bin-commands/plan.md`     | Implemented the CLI this plan consolidates.           |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.
- `audit-conventions` — Audits whether the conventions are set up and adopted in a project directory. Required for Implementing.

### Domains

This section lists all domains involved in the Plan.

| Domain / Path                                 | Description                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating. |
| Domain: Packages `$DOMAINS/packages/index.md` | Represents publishable libraries and CLIs, their grouping and publications.  |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Auditing, Refactoring, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$ART_WORK/cli/work/src/private/operations/types.ts` (Reference) — The Art Work operation model the bin duplicated. Relevant for Refactoring.
::READ `$ART_WORK/cli/work/src/private/logger/createLogger.ts` (Reference) — The Art Work logger the bin duplicated. Relevant for Refactoring.
::READ `$ART_WORK/cli/work/src/private/present/makeOperationLogLine.ts` (Reference) — The Art Work log line the bin adapted. Relevant for Refactoring.
::READ `$ART_WORK/cli/work/architecture/commands.md` (Reference) — How Art Work documents its CLI surface; the shape the follow-up inventory reuses. Relevant for Identifying Follow Ups.

## Scope

This section describes the working scope coordinated by the Plan.

Audit and refactor `$BUILD/cli/bin/src/` against the TypeScript conventions, and record the `@art-lib` extraction inventory. No new command behaviour and no new package.

### (Scope) Package: Bin

**Record:** `$BUILD/cli/bin/_records/package.art`

**Role:** Owns the three CLI entry points and the shared commander builder utilities and `doParse`/`doSerialize` implementations.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$BUILD/cli/bin/`
- `canonicalName` — `@art-md/bin`

**Changes:**

- Audit `$BUILD/cli/bin/src/` against the TypeScript conventions and record the deviations found in the iteration's report.
- Refactor the audited deviations: module boundaries (`private/` vs public), file and directory naming, export style, type-only imports, error handling, and test placement.
- Collapse duplication internal to the package — the parallel `parse`/`serialize` factories, the parallel `do{Operation}` bodies, and any shared option-parsing logic repeated across the two command specs.
- Keep the behaviour identical: the refactoring must not change the CLI's commands, options, output, or exit codes, and the existing test suite must pass unchanged.

**Dependencies:**

- Plan: Implement Bin Commands — the CLI must be implemented before it can be audited and refactored.

### (Scope) Knowledge: Art Lib Extraction Inventory

**Record:** `$BUILD/cli/bin/architecture/records/adr/cli.art`

**Role:** Records the duplicated units and the proposed `@art-lib` boundary, so the follow-up package can be created without re-deriving the analysis.

**Partial:**

- `path` — `$BUILD/cli/bin/architecture/`

**Changes:**

- Produce a side-by-side inventory of the units duplicated between `$BUILD/cli/bin/src/private/` and `$ART_WORK/cli/work/src/private/`, per unit: the file pair, what is identical, what diverges, and the shape a shared API would take.
- Cover at minimum: the operation model (`types.ts`, `createGenericOperation`, `createOperationSuccess`, `createOperationFailure`), the logger, the operation log line presentation, the program builder, and the context factory.
- Recommend the `@art-lib` package boundary — which units are genuinely shared, which stay project-specific, and the naming the shared API would use.
- Record the inventory in `$BUILD/cli/bin/architecture/records/adr/cli.art` and raise the `@art-lib` creation as a Follow Up on this plan and on the milestone; the package itself is not created here.

**Dependencies:**

- **`@art-lib`** — the shared CLI library package does not exist; the extraction itself is out of scope, so this iteration only identifies and records the follow-up.

## Execution Context

Execution occurs from `$WORKSPACE/`; the package work is performed in the Art MD building checkout `$BUILD` (checkout `checkouts/art-md-building`) on branch `building`, under `$BUILD/cli/bin/`. The reference CLI implementation lives in `$ART_WORK` (`checkouts/art-work-building/cli/work`).

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                               | Status     |
| -------------------------------------------------------------------------------------- | ---------- |
| Iteration: Apply CLI Conventions `./instructions/apply-cli-conventions.md`             | `PLANNING` |
| Iteration: Identify Art Lib Extraction `./instructions/identify-art-lib-extraction.md` | `PLANNING` |

### Iteration: Apply CLI Conventions

**Id:** `apply-cli-conventions`

**Status:** `PLANNING`

**Purpose:** Bring the implemented CLI in line with the TypeScript conventions and remove the duplication the implementation introduced, without changing behaviour.

**Description:** Audit `$BUILD/cli/bin/src/` against the TypeScript conventions, refactor the deviations, and collapse the internal duplication between the parallel `parse` and `serialize` paths.

**Instructions:** `./instructions/apply-cli-conventions.md`

**Changes:**

- Audit `$BUILD/cli/bin/src/` against `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` and record the deviations in the iteration report.
- Refactor the audited deviations — module boundaries, naming, export style, type-only imports, error handling, test placement.
- Collapse the internal duplication between the `parse` and `serialize` factories, the `do{Operation}` bodies, and the option handling repeated across the two command specs.
- Re-run `npm run test` and `npm run test:ci` from `$BUILD/cli/bin/` to confirm behaviour is unchanged and coverage still clears the thresholds.

**Dependencies:**

- None.

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ----------------------- | ------------------------------ | -------- | ----- | ---------- |
| `apply-cli-conventions` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `apply-cli-conventions`

**Repository:** Art MD

**Message:**

```text
refactor(bin): apply typescript conventions and collapse duplication
```

### Iteration: Identify Art Lib Extraction

**Id:** `identify-art-lib-extraction`

**Status:** `PLANNING`

**Purpose:** Produce the evidence-backed inventory that makes `@art-lib` a creatable follow-up instead of a guess.

**Description:** Compare the bin's private modules against the Art Work CLI's, classify each duplicated unit as shared or project-specific, and record the recommended `@art-lib` boundary in the package's CLI ADR.

**Instructions:** `./instructions/identify-art-lib-extraction.md`

**Changes:**

- Build the side-by-side inventory of the units duplicated between `$BUILD/cli/bin/src/private/` and `$ART_WORK/cli/work/src/private/` — the operation model, the logger, the operation log line presentation, the program builder, and the context factory.
- Per unit, record the file pair, what is identical, what diverges, and the shape a shared API would take.
- Recommend the `@art-lib` boundary: the units that are genuinely shared, the units that stay project-specific, and the naming the shared API would use.
- Record the inventory in `$BUILD/cli/bin/architecture/records/adr/cli.art` and raise `@art-lib` creation as a Follow Up.

**Dependencies:**

- **`@art-lib`** — the shared CLI library package does not exist; the extraction is out of scope, so only the follow-up is identified.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ----------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `identify-art-lib-extraction` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `identify-art-lib-extraction`

**Repository:** Art MD

**Message:**

```text
docs(bin): record art-lib extraction inventory and follow-up
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Write instructions for Iteration: Apply CLI Conventions, then delegate it.

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

Because the refactoring must not change behaviour, run both the tests and the coverage gate from `$BUILD/cli/bin/`:

```bash
npm run test:ci # runs vitest with the configured coverage thresholds
```

---

## Coordination

This section describes the boundaries, evidence, and follow ups of this work item.

### Not In Scope

- **Creating `@art-lib`** — the shared CLI library package is a follow-up; this plan only identifies and records its extraction units.
- **New command behaviour** — no commands, options, or outputs are added or changed.
- **Validator command** — `@art-md/validator` remains `PLANNED`.

### Evidence

- None yet.

### Findings

- None yet.

### Decisions

- **Refactoring must be behaviour-preserving** — the refactoring iteration is not allowed to change commands, options, output, or exit codes; the existing suite is the guard.
- **Duplication is inventoried, not extracted** — `@art-lib` is a separate package and a separate work item; pulling the units across now would couple the codec CLI's delivery to a new package's design.
- **The inventory lands in the package's CLI ADR** — the analysis belongs next to the code it describes, and Plan: Update Bin Knowledge links it from the architecture index.

### Knowledge to Update

- `$BUILD/cli/bin/architecture/records/adr/cli.art` — the `@art-lib` extraction inventory and recommended boundary.

### Follow Ups

- **`@art-lib`** — create the shared CLI library package from the recorded inventory: the operation model, logger, operation log line presentation, program builder, and context factory, with the naming the inventory recommends.

### Feedback

- None.
