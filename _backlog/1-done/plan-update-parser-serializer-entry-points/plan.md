# Plan: Update Parser and Serializer Entry Points

**ID:** `update-parser-serializer-entry-points`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Change the parser and serializer entry points to accept operation contexts in addition to raw inputs, returning `ParseResult`/`SerializeResult`, and update the pipeline tests as a sync change so each commit stays green.

**Description:** Change `parse` in `@art-md/parser` to `parse(markdown, config)` | `parse(context, markdown, config)` returning `ParseResult`, and change `serialize` in `@art-md/serializer` (renamed from `serializer.ts`) to `serialize(document, config)` | `serialize(context, document, config)` returning `SerializeResult`. Update `cli/pipeline-tests` to temporarily assemble the config for `parse()`/`serialize()` so each commit is verified by the pipeline tests.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the Plan file and its downstream work items. All file references in the Plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory.            |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Change the parser and serializer entry points to accept operation contexts and return `ParseResult`/`SerializeResult`, and update the pipeline tests as a sync change so each commit stays green and verified by `cli/pipeline-tests`.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Plan.

| Kind      | Path                                                                | Role                                                      |
| --------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/1-done/milestone-art-codec/milestone.md`         | Coordinates this plan within the Art Codec milestone.     |
| Design    | `$PROJECT/_roadmap/1-done/milestone-art-codec/milestone__design.md` | The design this plan implements.                          |
| Spec      | `$PROJECT/architecture/codec.md`                                    | The implementation spec (created by `create-codec-spec`). |

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
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.

## Scope

Change the entry points of `@art-md/parser` and `@art-md/serializer` in `$PROJECT/libs/`, and update `cli/pipeline-tests` as a sync change.

### (Scope) Package: Parser

**Record:** `$PROJECT/libs/parser/_records/package.art`

**Role:** Gains overloaded entry points accepting raw markdown or `ParseContext`.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/parser/`
- `canonicalName` — `@art-md/parser`

**Changes:**

- Rename `src/private/createDocumentParserContext.ts` to `createDocumentVisitContext.ts`; change the signature to `createDocumentVisitContext(markdown: string, parseContext: ParseContext): DocumentVisitContext`; update `src/private/index.ts`.
- Change `parse` in `src/parse/parse.ts` to accept either raw markdown or `ParseContext`, each with a `ParserConfig`, returning `ParseResult`:
  - `parse(markdown: string, config: ParserConfig): ParseResult`
  - `parse(context: ParseContext, markdown: string, config: ParserConfig): ParseResult`
- Markdown and config are always mandatory; the context is the first argument when provided; the raw-markdown overload creates a default `ParseContext` internally.
- Update `src/index.ts` to export `createDefaultConfig` and `ParserConfig` (so the pipeline test can assemble the config).
- Update `src/parse/parse.test.ts` and `src/private/createDocumentVisitContext.test.ts` for the new signatures.
- Update `libs/parser/architecture/api.md` — entry point description.

**Dependencies:**

- Package: Primitives — `ParseContext` must exist first (implemented by `implement-primitives-contracts`).

### (Scope) Package: Serializer

**Record:** `$PROJECT/libs/serializer/_records/package.art`

**Role:** Gains overloaded entry points accepting an `ArtDocument` or `SerializeContext`.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/serializer/`
- `canonicalName` — `@art-md/serializer`

**Changes:**

- Rename `src/serializer/serializer.ts` to `src/serializer/serialize.ts` (the entry point is `serialize()`).
- Change `serialize` to accept either an `ArtDocument` or `SerializeContext`, each with a `SerializerConfig`, returning `SerializeResult`:
  - `serialize(document: ArtDocument, config: SerializerConfig): SerializeResult`
  - `serialize(context: SerializeContext, document: ArtDocument, config: SerializerConfig): SerializeResult`
- The document and config are always mandatory; the context is the first argument when provided; the direct-document overload creates a default `SerializeContext` internally.
- Update `src/index.ts` to export `createDefaultSerializerConfig` and `SerializerConfig`.
- Update `src/serializer.test.ts` for the new signature.
- Update `libs/serializer/architecture/api.md` — entry point description.

**Dependencies:**

- Package: Primitives — `SerializeContext` must exist first (implemented by `implement-primitives-contracts`).

### (Scope) CLI: Pipeline Tests (sync change)

**Record:** `$PROJECT/cli/pipeline-tests/_records/package.art`

**Role:** The pipeline test scripts that verify the parser and serializer against stable fixtures.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/cli/pipeline-tests/`
- `canonicalName` — `@art-md/pipeline-test-cli`

**Changes:**

- Update `scripts/test/parser/parseFixture.ts` — temporarily assemble the config for `parse()` (e.g. `createDefaultConfig()`) and pass it: `parse(content, config)`; read the document from `result.document`.
- Update `scripts/test/serializer/serializeFixture.ts` — temporarily assemble the config for `serialize()` (e.g. `createDefaultSerializerConfig()`) and pass it: `serialize(artDocument, config)`; read the content from `result.content`.
- Update `scripts/test/serializer/diffFixtureResults.ts` — same config assembly; read the content from `result.content`.
- This is a sync change so each commit is green and verified by `cli/pipeline-tests`; the config assembly is removed in the codec iteration (`implement-codec-package`).

**Dependencies:**

- Package: Parser and Package: Serializer — the entry point changes must exist first.

## Execution Context

Execution occurs from `$WORKSPACE/`; the parser and serializer packages are updated in the Art MD checkout `$PROJECT` (checkout `checkouts/art-md-building`) on branch `building`, under `$PROJECT/libs/` and `$PROJECT/cli/pipeline-tests/`.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                   | Status |
| ------------------------------------------------------------------------------------------ | ------ |
| Iteration: Update Parser Entry Point `./instructions/update-parser-entry-point.md`         | `DONE` |
| Iteration: Update Serializer Entry Point `./instructions/update-serializer-entry-point.md` | `DONE` |

### Iteration: Update Parser Entry Point

**Id:** `update-parser-entry-point`

**Status:** `DONE`

**Report:** `./instructions/update-parser-entry-point__report.md`

**Purpose:** Let the parser entry point accept a `ParseContext` and return a `ParseResult`.

**Description:** Change `parse` to the overloaded signature returning `ParseResult`, rename `createDocumentParserContext` to `createDocumentVisitContext` carrying the `ParseContext`, export the parser config, and update the parser pipeline test as a sync change.

**Instructions:** `./instructions/update-parser-entry-point.md`

**Changes:**

- Rename `libs/parser/src/private/createDocumentParserContext.ts` to `createDocumentVisitContext.ts`; change the signature to `createDocumentVisitContext(markdown, parseContext)`; update `libs/parser/src/private/index.ts`.
- Change `libs/parser/src/parse/parse.ts` to the overloaded signature returning `ParseResult`; the raw-markdown overload creates a default `ParseContext` internally.
- Update `libs/parser/src/index.ts` to export `createDefaultConfig` and `ParserConfig`.
- Update `libs/parser/src/parse/parse.test.ts` and `libs/parser/src/private/createDocumentVisitContext.test.ts` for the new signatures.
- Update `cli/pipeline-tests/scripts/test/parser/parseFixture.ts` to assemble the config and pass it (sync change).
- Update `libs/parser/architecture/api.md` — entry point description.

**Dependencies:**

- Iteration: Add Operation Contexts (from `implement-primitives-contracts`).

#### Commits:

| ID                          | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| --------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `update-parser-entry-point` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `dfed74c` | `COMMITTED` |

##### Commit: `update-parser-entry-point`

**Message:**

```text
build(parser): add context overload to parse entry point
```

### Iteration: Update Serializer Entry Point

**Id:** `update-serializer-entry-point`

**Status:** `DONE`

**Report:** `./instructions/update-serializer-entry-point__report.md`

**Purpose:** Let the serializer entry point accept a `SerializeContext` and return a `SerializeResult`.

**Description:** Rename `serializer.ts` to `serialize.ts`, change `serialize` to the overloaded signature returning `SerializeResult`, export the serializer config, and update the serializer pipeline tests as a sync change.

**Instructions:** `./instructions/update-serializer-entry-point.md`

**Changes:**

- Rename `libs/serializer/src/serializer/serializer.ts` to `serialize.ts`; change `serialize` to the overloaded signature returning `SerializeResult`; the direct-document overload creates a default `SerializeContext` internally.
- Update `libs/serializer/src/index.ts` to export `createDefaultSerializerConfig` and `SerializerConfig`.
- Update `libs/serializer/src/serializer.test.ts` for the new signature.
- Update `cli/pipeline-tests/scripts/test/serializer/serializeFixture.ts` and `diffFixtureResults.ts` to assemble the config and pass it (sync change).
- Update `libs/serializer/architecture/api.md` — entry point description.

**Dependencies:**

- Iteration: Add Operation Contexts (from `implement-primitives-contracts`).

#### Commits:

| ID                              | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `update-serializer-entry-point` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `f3c031a` | `COMMITTED` |

##### Commit: `update-serializer-entry-point`

**Message:**

```text
build(serializer): add context overload to serialize entry point
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

All iterations DONE. Plan `update-parser-serializer-entry-points` complete.

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
npm ci # to install dependencies.
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

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Coordination

### Not In Scope

- **Codec package** — `@art-md/codec` is implemented by the `implement-codec-package` plan.
- **Concrete content sources** — `FSContentSource`, `MemoryContentSource` are future work.

### Evidence

- Parser `parse` entry point overloaded to accept `ParseContext` and return `ParseResult`; `createDocumentParserContext` renamed to `createDocumentVisitContext`; parser config exported; pipeline test updated as sync change; repo `npm run ci` and pipeline tests pass (commit `dfed74c`).
- Serializer `serialize` entry point overloaded to accept `SerializeContext` and return `SerializeResult`; `serializer.ts` renamed to `serialize.ts`; serializer config exported; pipeline tests updated as sync change; repo `npm run ci` and pipeline tests pass (commit `f3c031a`).

### Findings

- **Existing entry points are simple** — `parse(markdown: string = ''): ArtDocument` and `serialize(document: ArtDocument): string`; the overloads extend them without breaking the raw-input usage.
- **Pipeline tests break** — the signature change breaks `cli/pipeline-tests`; the test scripts must temporarily assemble the config for `parse()`/`serialize()` so each commit stays green.
- **Config factories not exported** — `createDefaultConfig` and `createDefaultSerializerConfig` are not exported from the package indexes; they are exported so the pipeline tests can assemble the config.

### Decisions

- **Overloads, not replacements** — the raw-string and direct-document overloads are retained; the context overloads are added.
- **Config always mandatory** — markdown/document and config are always mandatory; the context is the first argument when provided.
- **Sync change to pipeline tests** — `cli/pipeline-tests` is updated in the same commit to temporarily assemble the config, so each commit is green and verified.

### Knowledge to Update

- `$PROJECT/libs/parser/architecture/api.md` — entry point description.
- `$PROJECT/libs/serializer/architecture/api.md` — entry point description.
- `$PROJECT/cli/pipeline-tests/scripts/test/parser/parseFixture.ts` — config assembly (temporary).
- `$PROJECT/cli/pipeline-tests/scripts/test/serializer/serializeFixture.ts` — config assembly (temporary).
- `$PROJECT/cli/pipeline-tests/scripts/test/serializer/diffFixtureResults.ts` — config assembly (temporary).

### Follow Ups

- None.

### Feedback

- None.
