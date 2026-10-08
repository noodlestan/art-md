# Plan: Consolidate Codec Bin

**ID:** `consolidate-codec-bin`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Audit the implemented codec CLI against the TypeScript conventions, refactor what the audit finds, and identify the precise extraction units for the `@art-lib` shared CLI libraries.

**Description:** With the three entry points and both operations implemented, this plan brings the package in line with the repository's TypeScript conventions, removes duplication the implementation introduced, and produces a concrete, evidence-backed inventory of the similar modules, units, and equivalent infrastructure patterns and use cases between `cli/bin` and `$ART_WORK/cli/work` so that the shared `@art-lib` libraries can be created as a follow-up rather than guessed at. It deliberately does **not** create the shared `@art-lib` libraries.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the Plan file and its downstream work items. All file references in the Plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                 | Purpose                                                     |
| ------------ | ----------------------------- | ----------------------------------------------------------- |
| `$WORKSPACE` | Current working directory     | Workspace root directory.                                   |
| `$PROJECT`   | PROVIDED WITH PROMPT          | Checkout for Art MD implementation.                         |
| `$ART_WORK`  | `checkouts/art-work-building` | Art Work checkout (reference CLI implementation to follow). |
| `$ART_LIB`   | `checkouts/art-lib-planning`  | Art Lib checkout.                                           |

## Summary

Audit the implemented `@art-md/bin` against the TypeScript conventions, refactor the deviations and internal duplication, and produce an evidence-backed inventory of the similar modules, units, and equivalent infrastructure patterns and use cases shared with the Art Work CLI so that new `@art-lib` package(s) can be extracted as a follow-up.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

| Kind      | Path                                                               | Role                                                  |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md`         | Coordinates this plan within the Codec Bin milestone. |
| Design    | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone__design.md` | Names the `@art-lib` consolidation follow-up.         |
| Plan      | `$PROJECT/_backlog/1-done/plan-implement-bin-commands/plan.md`     | Implemented the CLI this plan consolidates.           |

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
::READ `$PROJECT/conventions/unit-tests/index.md` (Conventions) — Unit Test conventions. Relevant for Auditing, Refactoring, Verifying Step.
::READ `$ART_WORK/cli/work/src/private/` (Reference) — The Art Work CLI's private modules; the source the worker compares against. Relevant for Refactoring.

## Scope

This section describes the working scope coordinated by the Plan.

Audit and refactor `$PROJECT/cli/bin/src/` against the TypeScript and Unit Test conventions, and record the `@art-lib` extraction inventory. No new command behaviour and no new package.

### (Scope) Package: Bin

**Record:** `$PROJECT/cli/bin/_records/package.art`

**Role:** Owns the three CLI entry points and the shared commander builder utilities and `doParse`/`doSerialize` implementations.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/cli/bin/`
- `canonicalName` — `@art-md/bin`

**Changes:**

- Audit `$PROJECT/cli/bin/src/` against the TypeScript and Unit Test conventions and record the deviations found in the audit report.
- Refactor the audited deviations: module boundaries (`private/` vs public), file and directory naming, export style, type-only imports, error handling, and test placement.
- Collapse duplication internal to the package — the parallel `parse`/`serialize` factories, the parallel `do{Operation}` bodies, and any shared option-parsing logic repeated across the two command specs.
- Keep the behaviour identical: the refactoring must not change the CLI's commands, options, output, or exit codes, and the existing test suite must pass unchanged.

**Dependencies:**

- Plan: Implement Bin Commands — the CLI must be implemented before it can be audited and refactored.

### (Scope) Knowledge: Art Lib Extraction Inventory

**Record:** `$PROJECT/cli/bin/architecture/records/adr/cli.art`

**Role:** Records the similar modules, units, and equivalent infrastructure patterns and the proposed `@art-lib` boundary, so the follow-up libraries can be created without re-deriving the analysis.

**Partial:**

- `path` — `$PROJECT/cli/bin/architecture/`

**Changes:**

- Produce an inventory of the similar modules, units, and equivalent infrastructure patterns and use cases between `$PROJECT/cli/bin/src/private/` and `$ART_WORK/cli/work/src/private/`, recording the shape a shared API would take.
- Recommend the `@art-lib` packages boundary — which units are genuinely shared, which stay project-specific, and the naming the shared API would use.
- Record the inventory in `$PROJECT/cli/bin/architecture/records/adr/cli.art` and raise the `@art-lib` creation as a Follow Up on this plan and on the milestone; the package itself is not created here.

**Dependencies:**

- **`@art-lib`** — the shared CLI libraries are owned by Project: Art Lib; the extraction itself is out of scope, so this iteration only identifies and records the follow-up.

## Execution Context

Execution occurs from `$WORKSPACE/`; the package work is performed in the Art MD building checkout `$PROJECT` (checkout `$PROJECT`) on branch `building`, under `$PROJECT/cli/bin/`. The reference CLI implementation lives in `$ART_WORK` (`$ART_WORK/cli/work`).

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                               | Status  |
| -------------------------------------------------------------------------------------- | ------- |
| Iteration: Audit CLI Conventions `./instructions/audit-cli-conventions.md`             | `DONE`  |
| Iteration: Apply CLI Conventions `./instructions/apply-cli-conventions.md`             | `READY` |
| Iteration: Identify Art Lib Extraction `./instructions/identify-art-lib-extraction.md` | `READY` |

### Iteration: Audit CLI Conventions

**Id:** `audit-cli-conventions`

**Status:** `DONE`

**Purpose:** Audit the implemented CLI against the TypeScript and Unit Test conventions and record the deviations for the refactoring iteration to consume.

**Description:** Audit `$PROJECT/cli/bin/src/` against the TypeScript and Unit Test conventions and record the deviations as a plan attachment.

**Instructions:** `./instructions/audit-cli-conventions.md`

**Report:** `./instructions/audit-cli-conventions__report.md`

**Changes:**

- Audit `$PROJECT/cli/bin/src/` against `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` and `$PROJECT/conventions/unit-tests/index.md` and record the deviations.
- Save the audit report as a plan attachment at `$PROJECT/_backlog/3-now/plan-consolidate-codec-bin/plan__audit.md`.

**Dependencies:**

- None.

#### Commits:

| ID                      | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ----------------------- | -------------------------------- | -------- | --------- | ----------- |
| `audit-cli-conventions` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `4dd7979` | `COMMITTED` |

##### Commit: `audit-cli-conventions`

**Repository:** Art MD

**Message:**

```text
conventions(bin): Audit Typescript and Unit Test conventions
```

### Iteration: Apply CLI Conventions

**Id:** `apply-cli-conventions`

**Status:** `READY`

**Purpose:** Refactor the audited deviations and collapse the duplication the implementation introduced, without changing behaviour.

**Description:** Read the audit report, refactor the deviations it records, and collapse the internal duplication between the parallel `parse` and `serialize` paths.

**Instructions:** `./instructions/apply-cli-conventions.md`

**Changes:**

- Read the audit report at `$PROJECT/_backlog/3-now/plan-consolidate-codec-bin/plan__audit.md` and refactor the deviations it records.
- Collapse duplication internal to the package — the parallel `parse`/`serialize` factories, the parallel `do{Operation}` bodies, and any shared option-parsing logic repeated across the two command specs.
- Re-run `npm run test` and `npm run test:ci` from `$PROJECT/cli/bin/` to confirm behaviour is unchanged and coverage still clears the thresholds.

**Dependencies:**

- Iteration: Audit CLI Conventions — the audit report must exist before the deviations can be refactored.

#### Commits:

| ID                      | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ----------------------- | -------------------------------- | -------- | ----- | ---------- |
| `apply-cli-conventions` | Art MD / `$PROJECT` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `apply-cli-conventions`

**Repository:** Art MD

**Message:**

```text
refactor(bin): apply typescript conventions and collapse duplication
```

### Iteration: Identify Art Lib Extraction

**Id:** `identify-art-lib-extraction`

**Status:** `READY`

**Purpose:** Produce the evidence-backed inventory that makes `@art-lib` a creatable follow-up instead of a guess.

**Description:** Compare the bin's private modules against the Art Work CLI's, classify each similar module, unit, or equivalent infrastructure pattern as shared or project-specific, and record the recommended `@art-lib` boundary in the package's CLI ADR.

**Instructions:** `./instructions/identify-art-lib-extraction.md`

**Changes:**

- Build the inventory of the similar modules, units, files, and functions between `$PROJECT/cli/bin/src/private/` and `$ART_WORK/cli/work/src/private/`, even if not verbatim the same shape, and of the equivalent infrastructure patterns and use cases, even if achieved via different strategies — for example the operations log and the logger.
- Per unit, record what is shared, what diverges, and the shape a shared API would take.
- Recommend the new `@art-lib` package boundaries: the units that are genuinely shared, the units that stay project-specific, and the naming the shared API would use.
- Record the inventory in `$PROJECT/cli/bin/architecture/records/adr/cli.art` and raise creation of the new `@art-lib` packages as a Follow Up.

**Dependencies:**

- **`@art-lib`** — the shared CLI libraries are owned by Project: Art Lib; the extraction is out of scope, so only the follow-up is identified.

#### Commits:

| ID                            | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ----------------------------- | -------------------------------- | -------- | ----- | ---------- |
| `identify-art-lib-extraction` | Art MD / `$PROJECT` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `identify-art-lib-extraction`

**Repository:** Art MD

**Message:**

```text
docs(bin): record art-lib extraction inventory and follow-up
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Delegate Iteration: Apply CLI Conventions.

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

Because the refactoring must not change behaviour, run both the tests and the coverage gate from `$PROJECT/cli/bin/`:

```bash
npm run test:ci # runs vitest with the configured coverage thresholds
```

---

## Coordination

This section describes the boundaries, evidence, and follow ups of this work item.

### Not In Scope

- **Creating `@art-lib` packages** — the shared CLI libraries are a follow-up; this plan only identifies and records their extraction units.
- **New command behaviour** — no commands, options, or outputs are added or changed.
- **Validator command** — `@art-md/validator` remains `PLANNED`.

### Evidence

- Audit attachment `./plan__audit.md`: 79 files audited against 40 rules; ~215 deviation sites across 25 rules; 7 ambiguities flagged for decisions.
- Commit `4dd7979` (NOPUSH) with `npm run ci` green on pre-commit hook.

### Findings

- None yet.

### Decisions

- **Refactoring must be behaviour-preserving** — the refactoring iteration is not allowed to change commands, options, output, or exit codes; the existing suite is the guard.
- **Duplication is inventoried, not extracted** — `@art-lib` is a separate project and a separate work item.
- **Conventions are read through the project guide** — instructions do not duplicate convention `::READ` entries; each relevant step reads ALL conventions mentioned in `$PROJECT/_guide.md`.

### Knowledge to Update

- `$PROJECT/cli/bin/architecture/records/adr/cli.art` — the `@art-lib` extraction inventory and recommended boundary.

### Follow Ups

- **Create `@art-lib` packages** — create the shared CLI libraries from the recorded inventory.

### Feedback

- None.
