# Plan: Implement Primitives Contracts

**ID:** `implement-primitives-contracts`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Add the codec and source contracts and the parser and serializer operation contexts to `@art-md/primitives`, so the codec package and the parser and serializer can consume them.

**Description:** Add the codec contract, the content and document source contracts, and the parser and serializer operation contexts to the primitives package, and export them from the package index.

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

Add the codec and source contracts and the parser and serializer operation contexts to `@art-md/primitives`, so the codec package can implement the codec contract and the parser and serializer can accept operation contexts.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Plan.

| Kind      | Path                                                               | Role                                                      |
| --------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone.md`         | Coordinates this plan within the Art Codec milestone.     |
| Design    | `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` | The design this plan implements.                          |
| Spec      | `$PROJECT/architecture/codec.md`                                   | The implementation spec (created by `create-codec-spec`). |

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

Add the contracts to `@art-md/primitives` in `$PROJECT/libs/primitives/`, following the layout in the design attachment.

### (Scope) Package: Primitives

**Record:** `$PROJECT/libs/primitives/_records/package.art`

**Role:** Hosts the source and codec contracts and the operation contexts.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/primitives/`
- `canonicalName` — `@art-md/primitives`

**Changes:**

- Add the `codec/` module declaring the `ArtCodec` contract.
- Add the `source/` module declaring `ArtContentSource` and `ArtDocumentSource` and implementing `createArtDocumentSource()`.
- Add the `parser/context/` operation context: `ParseContext`, `ParserContextData`, `createParseContext()`, and add `parseContext` to `ParserVisitContext`.
- Add the `serializer/context/` operation context: `SerializeContext`, `SerializerContextData`, `createSerializeContext()`.
- Add `ParseResult` to `parser/types.ts` and `SerializeResult` to `serializer/types.ts`.
- Export the new modules from the primitives package index.

**Dependencies:**

- Spec: `$PROJECT/architecture/codec.md` — the spec must exist before implementation.

## Execution Context

Execution occurs from `$WORKSPACE/`; the primitives package is updated in the Art MD checkout `$PROJECT` (checkout path provided with prompt, example: `checkouts/art-md-building`) on branch `building`, under `$PROJECT/libs/primitives/`.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                         | Status  |
| -------------------------------------------------------------------------------- | ------- |
| Iteration: Add Operation Contexts `./instructions/add-operation-contexts.md`     | `DONE`  |
| Iteration: Add Codec Contract and Results `./instructions/add-codec-contract.md` | `DONE`  |
| Iteration: Add Source Contracts `./instructions/add-source-contracts.md`         | `READY` |

### Iteration: Add Operation Contexts

**Id:** `add-operation-contexts`

**Status:** `DONE`

**Report:** `./instructions/add-operation-contexts__report.md`

**Purpose:** Let parser and serializer operations carry a source uri.

**Description:** Add the parser operation context (`ParseContext`, `createParseContext()`) and the serializer operation context (`SerializeContext`, `createSerializeContext()`).

**Instructions:** `./instructions/add-operation-contexts.md`

**Changes:**

- Add `ParseContext` and `ParserContextData` to `parser/context/types.ts`.
- Add `parser/context/createParseContext.ts` implementing `createParseContext()`.
- Add `SerializeContext` and `SerializerContextData` to `serializer/context/types.ts`.
- Add `serializer/context/createSerializeContext.ts` implementing `createSerializeContext()`.
- Export the new parser and serializer contexts from the primitives index.

**Dependencies:**

- None.

#### Commits:

| ID                       | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------ | -------------------------------- | -------- | --------- | ----------- |
| `add-operation-contexts` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `84a1fcb` | `COMMITTED` |

##### Commit: `add-operation-contexts`

**Message:**

```text
build(codec): add operation contexts to primitives
```

### Iteration: Add Codec Contract and Results

**Id:** `add-codec-contract`

**Status:** `DONE`

**Report:** `./instructions/add-codec-contract__report.md`

**Purpose:** Declare the codec contract and the parse/serialise results the codec package will implement and return.

**Description:** Add `ParseResult`, `SerializeResult`, the `ArtCodec` contract, and carry `parseContext` on `ParserVisitContext`.

**Instructions:** `./instructions/add-codec-contract.md`

**Changes:**

- Add `ParseResult` to `parser/types.ts`.
- Add `SerializeResult` to `serializer/types.ts`.
- Add `codec/types.ts` declaring the `ArtCodec` contract.
- Add `parseContext` to `ParserVisitContext` (required field); thread it through `createParserVisitContextBase`/`createParserVisitContext` with an optional param defaulting to a `ParseContext`, so the repo stays green — the entry-points plan wires the real value.
- Export `codec` from the primitives index.

**Dependencies:**

- Iteration: Add Operation Contexts.

#### Commits:

| ID                   | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| -------------------- | -------------------------------- | -------- | --------- | ----------- |
| `add-codec-contract` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `351bb36` | `COMMITTED` |

##### Commit: `add-codec-contract`

**Message:**

```text
build(codec): add codec contract and results to primitives
```

### Iteration: Add Source Contracts

**Id:** `add-source-contracts`

**Status:** `READY`

**Purpose:** Provide the content and document source contracts and the document-source factory.

**Description:** Add `ArtContentSource`, `ArtDocumentSource`, and `createArtDocumentSource()` to primitives.

**Instructions:** `./instructions/add-source-contracts.md`

**Changes:**

- Add `source/types.ts` declaring `ArtContentSource` and `ArtDocumentSource`.
- Add `source/createArtDocumentSource.ts` implementing `createArtDocumentSource()`.
- Add `source/index.ts` and export `source` from the primitives index.

**Dependencies:**

- Iteration: Add Codec Contract and Results.

#### Commits:

| ID                     | Repository / Checkout / Branch   | Policy   | Hash  | Status     |
| ---------------------- | -------------------------------- | -------- | ----- | ---------- |
| `add-source-contracts` | Art MD / `$PROJECT` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `add-source-contracts`

**Message:**

```text
build(codec): add source contracts to primitives
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Delegate the next `READY` instruction (`add-source-contracts`).

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

- **Implementing the codec package** — `@art-md/codec` is implemented by the `implement-codec-package` plan.
- **Changing parser/serializer entry points** — handled by the `update-parser-serializer-entry-points` plan.
- **Implementing concrete content sources** — `FSContentSource`, `MemoryContentSource` are future work.

### Evidence

- `ParseContext`/`SerializeContext` operation contexts and factories added to `@art-md/primitives` and exported; unit tests added; repo `npm run ci` and pipeline tests pass (commit `84a1fcb`).
- `ArtCodec` contract, `ParseResult`/`SerializeResult`, and `parseContext` threading added to `@art-md/primitives`; repo `npm run ci` and pipeline tests pass (commit `351bb36`).

### Findings

- **Primitives already hosts parser context** — `src/parser/context/` exists with `ParserVisitContext`, `ParserSource`, and `createParserVisitContext`; `ParseContext` is added alongside, not replacing it.
- **Adding `parseContext` to `ParserVisitContext` is breaking** — it is constructed in `createParserVisitContextBase` (primitives) and called from `createDocumentParserContext` (parser pkg). The field is added required, threaded through the primitives factory with an optional param defaulting to a `ParseContext` so the repo stays green; the entry-points plan wires the real value.

### Decisions

- None.

### Knowledge to Update

- `$PROJECT/libs/primitives/architecture/index.md` — layout section.
- `$PROJECT/libs/primitives/architecture/api.md` — new types and functions.

### Follow Ups

- None.

### Feedback

- None.
