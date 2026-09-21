# Plan: Prepare Spec for Publishing

**ID:** `prepare-spec-for-publishing`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Separate the publishable grammar/constructs content in `spec/` from placeholders, drafts, and WIP diagrams, moving the latter to `spec-wip/`, so that `@art-md/spec` can be published as a coherent content package.

**Description:** Move placeholder construct stubs, drafted pseudo-art content, and WIP diagrams from `spec/` to `spec-wip/`; fix typos and broken references in the remaining content; ensure nothing in `spec/` references `spec-wip/` (reword to `(PLANNED)`); update package metadata.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the Plan file and its downstream work items. All file references in the Plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                                               | Purpose                              |
| ------------ | ----------------------------------------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory                                   | Workspace root directory.            |
| `$PROJECT`   | Provided with prompt. Typically `checkouts/art-md-building` | Repository root for all code changes |

## Summary

Move all placeholder, drafted, and WIP content out of `spec/` into `spec-wip/`, leaving `spec/` with only the publishable grammar/constructs and package metadata, so that `@art-md/spec` can be published as a coherent content package.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Plan.

| Kind        | Path                                                           | Role                                                   |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| Milestone   | `$ART_MD/_roadmap/3-now/milestone-extract-art-md/milestone.md` | Coordinates this plan within the Extract MD milestone. |
| Parking Lot | `$ART_MD/_roadmap/_parking-lot.md`                             | Tracks the WIP spec items moved to `spec-wip/`.        |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

This section lists all domains involved in the Plan.

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_MD/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_MD/spec/_guide.md` (Guide) — Defines package operations and verification. Relevant for Setting Up, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.

## Scope

Update the `@art-md/spec` content package in `$ART_MD/spec/`: move placeholder construct stubs, drafted pseudo-art content, and WIP diagrams to `spec-wip/`; fix typos and broken references in the remaining content; reword references to moved content as `(PLANNED)`; update package metadata.

### (Scope) Package: Spec

**Record:** `$ART_MD/spec/_records/package.art`

**Role:** The `@art-md/spec` content package to prepare for publishing.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$ART_MD/spec/`
- `canonicalName` — `@art-md/spec`
- `deployment` — NPM Package Deployment: Spec

**Changes:**

- Create `spec-wip/` and move placeholder construct stubs (directives, procedural, statements) there.
- Move drafted pseudo-art content (primitives, structures, types, modules, resources, routines) to `spec-wip/`.
- Move WIP diagrams (`_wip.md` files) to `spec-wip/`.
- Fix typos and broken references in the remaining `spec/` content.
- Reword references to moved content as `(PLANNED)`; nothing in `spec/` references `spec-wip/`.
- Update `package.json`, `_guide.md`, `README.md`, `CHANGELOG.md`.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; the spec package is updated in the Art MD checkout `$ART_MD` (checkout `checkouts/art-md-building`) on branch `building`.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                           | Status  |
| -------------------------------------------------- | ------- |
| Iteration: Move Placeholder Constructs to spec-wip | `READY` |
| Iteration: Move Drafted Content to spec-wip        | `READY` |
| Iteration: Move WIP Diagrams to spec-wip           | `READY` |
| Iteration: Fix Typos and Broken References in spec | `READY` |
| Iteration: Update Package Metadata                 | `READY` |

### Iteration: Move Placeholder Constructs to spec-wip

**Id:** `move-placeholder-constructs-to-spec-wip`

**Status:** `READY`

**Purpose:** Remove the placeholder construct stubs from `spec/` so the grammar tree contains only real constructs.

**Description:** Move the 16 WIP placeholder construct stubs (directives, procedural, statements) from `spec/grammar/constructs/` to `spec-wip/grammar/constructs/`.

**Changes:**

- Create `spec-wip/grammar/constructs/` mirroring the moved categories.
- Move `spec/grammar/constructs/directives/` (4 files: example-directive, format-directive, mandatory-reading-directive, template-directive) to `spec-wip/grammar/constructs/directives/`.
- Move `spec/grammar/constructs/procedural/` (3 files: procedure-block, statement, workflow) to `spec-wip/grammar/constructs/procedural/`.
- Move `spec/grammar/constructs/statements/` (9 files: alert, ask, catch, execute, if, nested-rules, return, throw, with-each) to `spec-wip/grammar/constructs/statements/`.
- Verify the moved directories are empty in `spec/` and no remaining file in `spec/` references the moved paths.

**Dependencies:**

- None.

#### Commits:

| ID                                        | Repository / Checkout / Branch  | Policy   | Hash      | Status      |
| ----------------------------------------- | ------------------------------- | -------- | --------- | ----------- |
| `move-placeholder-constructs-to-spec-wip` | Art MD / `$ART_MD` / `building` | `NOPUSH` | `b9989c9` | `COMMITTED` |

##### Commit: `move-placeholder-constructs-to-spec-wip`

**Message:**

```text
migrate(package-spec): Move placeholder construct stubs to spec-wip.
```

---

### Iteration: Move Drafted Content to spec-wip

**Id:** `move-drafted-content-to-spec-wip`

**Status:** `READY`

**Purpose:** Remove the drafted pseudo-art content from `spec/` so only publishable grammar/constructs remain.

**Description:** Move the drafted pseudo-art content (primitives, structures, types, modules, resources, routines) from `spec/` to `spec-wip/`, preserving their internal directory structure.

**Changes:**

- Move `spec/primitives/` (5 files: enum, list, record, record-field, scalar) to `spec-wip/primitives/`.
- Move `spec/structures/` (2 files: primitive, structure-abstract) to `spec-wip/structures/`.
- Move `spec/types/` (2 files: structure, \_types) to `spec-wip/types/`.
- Move `spec/modules/` (11 files, including `_wip.md`) to `spec-wip/modules/`.
- Move `spec/resources/` (1 file: \_types) to `spec-wip/resources/`.
- Move `spec/routines/` (1 file: routine-invokation, including `_wip.md`) to `spec-wip/routines/`.
- Verify the moved directories are empty in `spec/` and no remaining file in `spec/` references the moved paths.

**Dependencies:**

- Iteration: Move Placeholder Constructs to spec-wip.

#### Commits:

| ID                                 | Repository / Checkout / Branch  | Policy   | Hash      | Status      |
| ---------------------------------- | ------------------------------- | -------- | --------- | ----------- |
| `move-drafted-content-to-spec-wip` | Art MD / `$ART_MD` / `building` | `NOPUSH` | `83384fa` | `COMMITTED` |

##### Commit: `move-drafted-content-to-spec-wip`

**Message:**

```text
migrate(package-spec): Move drafted pseudo-art content to spec-wip.
```

---

### Iteration: Move WIP Diagrams to spec-wip

**Id:** `move-wip-diagrams-to-spec-wip`

**Status:** `READY`

**Purpose:** Remove the WIP diagrams and notes from `spec/` so the package ships no work-in-progress documentation.

**Description:** Move the remaining `_wip.md` diagram files from `spec/` to `spec-wip/`.

**Changes:**

- Move `spec/_wip.md` to `spec-wip/_wip.md`.
- Move `spec/grammar/_wip.md` to `spec-wip/grammar/_wip.md`.
- Verify no `_wip.md` files remain in `spec/`.

**Dependencies:**

- Iteration: Move Drafted Content to spec-wip.

#### Commits:

| ID                              | Repository / Checkout / Branch  | Policy   | Hash      | Status      |
| ------------------------------- | ------------------------------- | -------- | --------- | ----------- |
| `move-wip-diagrams-to-spec-wip` | Art MD / `$ART_MD` / `building` | `NOPUSH` | `7127f24` | `COMMITTED` |

##### Commit: `move-wip-diagrams-to-spec-wip`

**Message:**

```text
migrate(package-spec): Move WIP diagrams to spec-wip.
```

---

### Iteration: Fix Typos and Broken References in spec

**Id:** `fix-typos-and-broken-references-in-spec`

**Status:** `READY`

**Purpose:** Ensure the remaining `spec/` content is coherent, self-contained, and free of typos and broken references.

**Description:** Proofread the remaining `spec/` files, verify every `::READ` directive resolves within `spec/`, and reword any reference to content moved to `spec-wip/` as `(PLANNED)`.

**Changes:**

- Proofread every remaining file in `spec/` for typos and fix them.
- Verify every `::READ` directive in `spec/` resolves to an existing file inside `spec/`; fix or remove broken directives.
- RULE: nothing in `spec/` may reference anything in `spec-wip/`. Reword any reference to moved content to say `(PLANNED)`:
  - `grammar/vocabulary/vocabulary.art` — reword "Artificial Construct — WIP" and "Artificial Declaration — interpreted as WIP" to `(PLANNED)`.
  - `grammar/semantics/semantics.art` — reword references to moved constructs (Procedure Block, Return statement, Procedure Inputs/Outputs) to `(PLANNED)`; remove or reword the `<!-- WIP add Validate field to constructs -->` comment.
- Remove or reword any remaining `WIP` markers in files that stay in `spec/`.
- Verify no file in `spec/` references `spec-wip/` after the reword.

**Dependencies:**

- Iteration: Move WIP Diagrams to spec-wip.

#### Commits:

| ID                                        | Repository / Checkout / Branch  | Policy   | Hash      | Status      |
| ----------------------------------------- | ------------------------------- | -------- | --------- | ----------- |
| `fix-typos-and-broken-references-in-spec` | Art MD / `$ART_MD` / `building` | `NOPUSH` | `07f540d` | `COMMITTED` |

##### Commit: `fix-typos-and-broken-references-in-spec`

**Message:**

```text
refs(package-spec): Fix broken references and typos; reword WIP refs to (PLANNED).
```

---

### Iteration: Update Package Metadata

**Id:** `update-package-metadata`

**Status:** `READY`

**Purpose:** Update the package metadata to reflect the publishable spec content.

**Description:** Update `package.json`, `_guide.md`, `README.md`, and `CHANGELOG.md` in `$ART_MD/spec/` to describe the publishable grammar/constructs content and the `spec-wip/` location.

**Changes:**

- Update `package.json` — description and `files` field to include the publishable content (grammar) and drop entries that no longer apply (e.g., `dist` if not produced).
- Update `_guide.md` — package layout section to list only the remaining directories and note `spec-wip/` as the WIP location.
- Update `README.md` — fix the broken reference to `./_processes/verify-bootstrap__process__art.md`; describe the publishable content and the `spec-wip/` location.
- Update `CHANGELOG.md` — add an entry for the publishing preparation.

**Dependencies:**

- Iteration: Fix Typos and Broken References in spec.

#### Commits:

| ID                        | Repository / Checkout / Branch  | Policy   | Hash      | Status      |
| ------------------------- | ------------------------------- | -------- | --------- | ----------- |
| `update-package-metadata` | Art MD / `$ART_MD` / `building` | `NOPUSH` | `cfe38d5` | `COMMITTED` |
| `move-spec-wip-to-root`   | Art MD / `$ART_MD` / `building` | `NOPUSH` | `4d21408` | `COMMITTED` |

##### Commit: `update-package-metadata`

**Message:**

```text
docs(package-spec): Update package metadata for publishing.
```

##### Commit: `move-spec-wip-to-root`

**Message:**

```text
migrate(spec): Move spec-wip to root.
```

---

## Work

### Next

This section states the immediate action needed to advance the Plan.

Plan the next iteration: `move-placeholder-constructs-to-spec-wip`.

### Blockers

This section lists the impediments to progress and the work items they involve.

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

**Purpose:** Confirms that a step is correct before continuing.

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier)
```

---

## Coordination

### Not In Scope

- **Implementing the WIP constructs** — the moved stubs remain placeholders in `spec-wip/`; implementation is future work tracked in the roadmap parking lot.
- **Publishing the package** — this plan prepares the content; the actual npm publish is a separate deployment step.

### Evidence

- None yet.

### Findings

- **Spec content is mixed** — `spec/` mixes real grammar/constructs with placeholder stubs, drafted pseudo-art, and WIP diagrams; the CHANGELOG confirms 26 constructs are "drafted" and modules/routines are "POC pseudo-art".
- **Broken references exist** — `resources/_types.art` → `../grammar/index__generator.md` (missing); `structures/primitive.art` and `primitives/*.art` → `language/grammar/index.art` + `language/primitives/index.art` (wrong paths); `types/_types.art` → `../primitives/index.art` (missing); `README.md` → `./_processes/verify-bootstrap__process__art.md` (missing).
- **WIP items tracked in parking lot** — "Grammar constructs WIP", "Spec templates and files WIP", "Primitive spec cleanup", and "Spec routines reference" reference the content moved to `spec-wip/`.

### Decisions

- **spec/ = publishable grammar only** — `spec/` keeps grammar (vocabulary, semantics, structures, constructs) and package metadata; all placeholders, drafts, and WIP diagrams move to `spec-wip/`.
- **No spec→spec-wip references** — nothing in `spec/` references `spec-wip/`; references to moved content are reworded to `(PLANNED)`.

### Knowledge to Update

- `$ART_MD/spec/_guide.md` — package layout section.
- `$ART_MD/spec/README.md` — content description and broken reference.
- `$ART_MD/spec/CHANGELOG.md` — new entry.
- `$ART_MD/_roadmap/_parking-lot.md` — update WIP item paths to `spec-wip/`.

### Follow Ups

- Update the roadmap parking lot items to reference `spec-wip/` paths.
- Publish `@art-md/spec` once the content is verified.

### Feedback

- None.
