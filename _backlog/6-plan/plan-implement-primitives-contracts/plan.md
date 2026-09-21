# Plan: Implement Primitives Contracts

**ID:** `implement-primitives-contracts`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Declare the source and codec contracts and the operation contexts in `@art-md/primitives`, so that the codec package, parser, and serializer can consume them.

**Description:** Add `source/` (`ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`), `codec/` (`ArtCodec` contract), `parser/context/` (`ParseContext`, `createParseContext()`), and `serializer/context/` (`SerializeContext`, `createSerializeContext()`) to `@art-md/primitives`, and export them from the package index.

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

Add the source and codec contracts and the operation contexts to `@art-md/primitives`, so that `@art-md/codec` can implement the `ArtCodec` contract and the parser and serializer can accept operation contexts.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Plan.

| Kind      | Path                                                                | Role                                                      |
| --------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/4-next/milestone-art-codec/milestone.md`         | Coordinates this plan within the Art Codec milestone.     |
| Design    | `$PROJECT/_roadmap/4-next/milestone-art-codec/milestone__design.md` | The design this plan implements.                          |
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

Add the contracts to `@art-md/primitives` in `$PROJECT/libs/primitives/`, following the layout in the design attachment.

### (Scope) Package: Primitives

**Record:** `$PROJECT/libs/primitives/_records/package.art`

**Role:** Hosts the source and codec contracts and the operation contexts.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/primitives/`
- `canonicalName` — `@art-md/primitives`

**Changes:**

- Add `src/codec/types.ts` — the `ArtCodec` contract with the overloaded API:
  - `parse(context: ParseContext): ArtDocument`
  - `parse(markdown: string): ArtDocument`
  - `serialize(context: SerializeContext): string`
  - `serialize(document: ArtDocument): string`
- Add `src/source/types.ts` — `ArtContentSource` (source identity plus lazy/idempotent acquisition and caching of raw content; knows nothing about Art documents or records) and `ArtDocumentSource` (lazy/idempotent parsing and caching of an `ArtDocument` from an `ArtContentSource`; knows nothing about records).
- Add `src/source/createArtDocumentSource.ts` — `createArtDocumentSource(codec, contentSource): ArtDocumentSource`; lazily/idempotently reads content through `contentSource`, parses through `codec`, caches the document, and writes through `codec` + `contentSource`.
- Add `src/parser/context/types.ts` additions — `ParseContext` with `contentSource: ArtContentSource` plus the parser-operation context data needed by the parser.
- Add `src/parser/context/createParseContext.ts` — `createParseContext(contentSource)` constructing the parser-operation context from an `ArtContentSource`; the existing `ParserVisitContext` is retained as the internal traversal context.
- Add `src/serializer/context/types.ts` — `SerializeContext` with `contentSource: ArtContentSource` plus the serializer-operation context data needed by the serializer.
- Add `src/serializer/context/createSerializeContext.ts` — `createSerializeContext(contentSource)` constructing the serializer-operation context from an `ArtContentSource`.
- Update `src/index.ts` — export the new `codec`, `source`, and `serializer` modules.
- Update `libs/primitives/architecture/index.md` and `api.md` — document the new contracts and layout.

**Dependencies:**

- Spec: `$PROJECT/architecture/codec.md` — the spec must exist before implementation.

## Execution Context

Execution occurs from `$WORKSPACE/`; the primitives package is updated in the Art MD checkout `$PROJECT` (checkout `checkouts/art-md-building`) on branch `building`, under `$PROJECT/libs/primitives/`.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan.

Iterations are not yet defined — this is a draft plan. The change set above is captured from the milestone; iterations will be drafted when the plan is refined.

## Work

### Next

This section states the immediate action needed to advance the Plan.

Draft the iterations for the primitives contracts.

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

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

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

- None yet.

### Findings

- **Primitives already hosts parser context** — `src/parser/context/` exists with `ParserVisitContext`, `ParserSource`, and `createParserVisitContext`; `ParseContext` is added alongside, not replacing it.

### Decisions

- **Contracts in primitives** — source contracts and the `ArtCodec` contract live in `@art-md/primitives`; no `@art-md/source` package is created.
- **Contexts carry the content source** — `ParseContext` and `SerializeContext` expose `contentSource: ArtContentSource`; the raw-string/direct-document overloads create contexts internally.

### Knowledge to Update

- `$PROJECT/libs/primitives/architecture/index.md` — layout section.
- `$PROJECT/libs/primitives/architecture/api.md` — new types and functions.

### Follow Ups

- None.

### Feedback

- None.
