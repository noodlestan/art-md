# Plan: Ergonomic Factories API

**ID:** `ergonomic-factories-api`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Give the records layer a sanctioned path to build a document from pure data, and fix the inline-value serialization defects that block it.

**Description:** `$ART_WORKS` needs to create record files from pure data — the `clone` command's first run for a repo/location not yet cloned builds one `Checkout` record in memory and persists it (`init` will do the same). Two things block this. **Inline values mis-serialize**: a `FieldInline`/`FieldBlock` whose children include a list is silently dropped (emits `**Name:**&#x20;`), and an empty field emits a stray `&#x20;` HTML entity. And the construct factories are **not exported** from the package entry — the named `create{Construct}` functions exist and are complete for all seven constructs, but a consumer cannot import them. Per `$ART_WORKS`'s requirement, the **CLI will not import these factories** — data→record is records-domain, so the exports serve `@art-js/records`, not the CLI. This plan fixes the inline-value defect and exposes the factories for the records layer; it adds no new construct.

## Path Variables

| Variable     | Resolved Path                 | Purpose                                             |
| ------------ | ----------------------------- | --------------------------------------------------- |
| `$WORKSPACE` | Current working directory     | Workspace root directory.                           |
| `$PROJECT`   | `checkouts/art-md-planning`   | Checkout for Art MD implementation.                 |
| `$ART_WORKS`  | `checkouts/art-work-planning` | Consumer driving this plan; use-case source.        |
| `$ART_JS`    | `checkouts/art-js-planning`   | Owns `@art-js/records`; the builder's likely owner. |

## Summary

Fix inline-value serialization (list + entity defects), export the named construct factories for the records layer, and prove the path with `$ART_WORKS`'s real checkout record as the round-trip acceptance case.

## Context

### Upstream Work

| Kind      | Path                                                             | Role                                                |
| --------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/6-plan/milestone-art-constructs/milestone.md` | Owns the constructs package; this plan's home.      |
| Consumer  | `$ART_WORKS/_backlog/_parking-lot.md`                             | Clone-command use case; fully described 2026-10-13. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions.
- `render-template` — Renders plan and instruction artefacts.

### Domains

| Domain / Path                                 | Description            |
| --------------------------------------------- | ---------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle.    |
| Domain: Packages `$DOMAINS/packages/index.md` | Publishable libraries. |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — project operations and verification. Relevant for Setting Up, Verifying Step.
::READ `$PROJECT/libs/constructs/knowledge/api.md` (Knowledge) — the Construct Factories API this plan makes usable. Relevant for Refactoring.

## Scope

Fix inline-value serialization fidelity and expose the factories to the records layer. No new constructs; no parser changes; no CLI-facing builder API.

### (Scope) Package: Constructs

**Record:** `$PROJECT/libs/constructs/_records/package.art`

**Role:** Owns the construct factories and the to-mdast serializers.

**Partial:**

- `canonicalName` — `@art-md/constructs`

**Changes:**

- Fix inline-value serialization: a list child must emit a real bullet list, and an empty `FieldInline` must emit no stray `&#x20;` entity.
- Export the named factories (`createDocument`, `createSectionBlock`, `createFieldBlock`, `createFieldInline`, `createNaturalBlock`, `createNaturalExpression`, `createTag`) and their `*FactoryData` types from the package entry, alongside the existing `FACTORIES` registry.
- Add a round-trip test using `$ART_WORKS`'s real checkout record shape (`## Checkout: X` + `**Repository:**` plain text + `**Location:**`/`**Branch:**` inline code) as the acceptance case.

**Dependencies:**

- None.

## Work

### Next

Write the instructions for iteration `fix-inline-value-serialization`.

### Blockers

- None.

## Operating Instructions

### Setting Up

**Instructions:** (From `$PROJECT/_guide.md`)

```bash
npm ci
```

### Verifying Step

**Instructions:** (From `$PROJECT/_guide.md`)

From `$PROJECT/tests/codec/`:

```bash
npm run test # parser + serializer against stable fixtures
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci
```

## Items:

| Iteration / Instructions                  | Status     |
| ----------------------------------------- | ---------- |
| Iteration: Fix Inline Value Serialization | `PLANNING` |
| Iteration: Export Named Factories         | `PLANNING` |
| Iteration: Add Records Round-Trip Test    | `PLANNING` |

### Iteration: Fix Inline Value Serialization

**Id:** `fix-inline-value-serialization`

**Status:** `PLANNING`

**Purpose:** Field values that are not plain text serialize correctly.

**Description:** A `FieldInline`/`FieldBlock` whose children include a list is silently dropped (emits `**Name:**&#x20;`), and an empty field emits a stray `&#x20;` entity. Fix both so list children render as bullet lists and empty fields leave no artifact.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Emit list children as real bullet lists under the field.
- Emit no `&#x20;` (or any entity) for a field with no children.
- Keep plain text, inline code, and record-reference values unchanged (verified working).

**Dependencies:** None.

#### Commits:

| ID                               | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| -------------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `fix-inline-value-serialization` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | (TBD) | `AUTHORED` |

### Iteration: Export Named Factories

**Id:** `export-named-factories`

**Status:** `PLANNING`

**Purpose:** The records layer can import the factories by name.

**Description:** Re-export the seven `create{Construct}` functions and their `*FactoryData` types from the package entry. The consumer is `@art-js/records`, **not** the CLI (per `$ART_WORKS` requirement 5). Additive; `FACTORIES` and all existing exports stay.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add named `create{Construct}` exports to `factories/public.ts`, surfaced through `src/index.ts`.

**Dependencies:** None.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ------------------------ | ------------------------------ | -------- | ----- | ---------- |
| `export-named-factories` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | (TBD) | `AUTHORED` |

### Iteration: Add Records Round-Trip Test

**Id:** `add-records-round-trip-test`

**Status:** `PLANNING`

**Purpose:** Prove the real consumer shape works end-to-end.

**Description:** Add a test using `$ART_WORKS`'s checkout record: build from pure data (heading text + plain-text + inline-code fields), serialize, parse back, assert the heading text and field values survive.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add the acceptance test in the constructs or codec-tests suite.

**Dependencies:**

- Iterations `fix-inline-value-serialization` and `export-named-factories`.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ----------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `add-records-round-trip-test` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | (TBD) | `AUTHORED` |

## Coordination

### Not In Scope

- **New constructs** — `milestone-art-constructs` owns new construct types; this plan makes the existing seven faithful and reachable.
- **Parser changes** — the parser already handles headings and inline values correctly.
- **The plain-data builder API** — whether a records-domain `createCapsule`-style builder lives in `@art-js/records` is `$ART_JS`'s call (see Decisions). This plan only exposes the factories it would sit on.
- **`config.checkouts.template`** — raw-markdown override stays CLI-internal; it must not move into the records domain.

### Evidence

- `libs/constructs/src/factories/public.ts` exports only `FACTORIES` + types; named factories are absent from the entry surface (verified by probe).
- Inline defects (verified): list child dropped → `**Files:**&#x20;`; empty `FieldInline` → `&#x20;`.
- Working today (verified): plain text, inline code, record references as text, key order, absent-field omission emits no line.

### Findings

- The factories are complete for all seven constructs; the gaps are the export surface and the inline-value serializer defect, not missing implementations.
- `$ART_WORKS`'s read side matches on the `## Checkout:` heading text, so heading fidelity is load-bearing on both ends — the acceptance case asserts it survives.

### Decisions

- **Factories serve the records layer, not the CLI** — per `$ART_WORKS` requirement 5: data→record is records-domain, exactly as `createFieldResolver` is. Either `@art-js/records` owns the plain-data builder or the factories stay internal and the records layer calls them.
- **This plan does not change `$ART_WORKS`'s call site** — their build → serialize → `writeContent()` flow stands; this plan fixes what sits beneath it.
- **`config.checkouts.template` stays CLI-internal** — out of the records domain.

### Follow Ups

- **Confirm builder ownership with `$ART_JS`** — does `@art-js/records` own the plain-data builder? Needed before the exports have a consumer.
- **`$ART_WORKS` requirement 2, record references** — `**Owner:** Package: Art Work` is plain text today; if typed references are wanted later, that is a separate construct-level question.

### Feedback

- None.
