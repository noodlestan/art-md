# Plan: Implement Codec Package

**ID:** `implement-codec-package`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Create the `@art-md/codec` package owning the configured codec implementation and `createArtCodec()`, and rename `cli/pipeline-tests` to `cli/codec-tests` so the test scripts point at the codec dependency.

**Description:** Scaffold the `@art-md/codec` package and implement `ArtCodecConfig`, `PartialArtCodecConfig`, `createArtCodec()`, and the overloaded `parse`/`serialize` API against the `ArtCodec` contract from `@art-md/primitives`. `createArtCodec` accepts a partial config and falls back to the default constructs. Rename `cli/pipeline-tests` to `cli/codec-tests`, point the `test-parser`/`test-serializer` scripts at the codec dependency, and remove the temporary config assembly and the direct parser/serializer dependencies from the test suite. The package intentionally stays small so alternative/configured codecs can exist independently.

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

Create the `@art-md/codec` package with `ArtCodecConfig`, `PartialArtCodecConfig`, `createArtCodec()`, and the overloaded `parse`/`serialize` implementation, and rename `cli/pipeline-tests` to `cli/codec-tests` so the test scripts point at the codec dependency and drop the temporary config assembly.

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

Create the `@art-md/codec` package in `$PROJECT/libs/codec/` and rename `cli/pipeline-tests` to `cli/codec-tests`.

### (Scope) Package: Codec

**Record:** To be created at `$PROJECT/libs/codec/_records/package.art`

**Role:** Owns the configured codec implementation and `createArtCodec()`.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/codec/`
- `canonicalName` — `@art-md/codec`

**Changes:**

- Scaffold the package following the sibling libs pattern: `package.json`, `tsconfig.json`, `tsconfig.vite.json`, `vite.config.ts`, `vitest.config.ts`, `.eslintrc.cjs`, `.npmignore`, `.prettierignore`, `LICENSE-MIT`, `README.md`, `_guide.md`, `CHANGELOG.md`, and `_records/` (`package.art`, `npm-deployment.art`).
- Add `src/types.ts` — `ArtCodecConfig` (`parserConfig: ParserConfig`, `serializerConfig: SerializerConfig`) and `PartialArtCodecConfig` (optional partial parser/serializer configs), reusing the existing parser/serializer config types.
- Add `src/createArtCodec.ts` — `createArtCodec(config?: PartialArtCodecConfig): ArtCodec`, using the provided values or the default constructs.
- Add the `ArtCodec` implementation — document-level parsing and serialisation only; no source I/O; no record knowledge; owns the construct configuration; exposes the overloaded API:
  - `parse(markdown: string): ParseResult`
  - `parse(context: ParseContext, markdown: string): ParseResult`
  - `serialize(document: ArtDocument): SerializeResult`
  - `serialize(context: SerializeContext, document: ArtDocument): SerializeResult`
- Add `src/index.ts` — export `ArtCodecConfig`, `PartialArtCodecConfig`, `createArtCodec`, and the implementation.
- Add tests for the overloaded entry points.
- Register package in `$PROJECT/architecture/components.md` and `_records/project.art`.

**Dependencies:**

- Package: Primitives — the `ArtCodec` contract must exist first (implemented by `implement-primitives-contracts`).
- Package: Parser and Package: Serializer — the overloaded entry points must exist first (implemented by `update-parser-serializer-entry-points`).

### (Scope) CLI: Codec Tests (renamed from Pipeline Tests)

**Record:** `$PROJECT/cli/codec-tests/_records/package.art`

**Role:** The test scripts that verify the parser and serializer through the codec.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/cli/codec-tests/`
- `canonicalName` — `@art-md/codec-test-cli`

**Changes:**

- Rename `cli/pipeline-tests` to `cli/codec-tests` (directory, package name, records, `_guide.md`, `README.md`, `CHANGELOG.md`).
- Point the `test-parser` and `test-serializer` scripts at the codec dependency: use `codec.parse(markdown)` / `codec.serialize(document)` instead of assembling the config.
- Remove the temporary config assembly added in `update-parser-serializer-entry-points`.
- Replace the `@art-md/parser` and `@art-md/serializer` dependencies with `@art-md/codec`; drop `@art-md/constructs` too, since `createArtCodec` provides the default constructs and the test suite no longer needs to assemble a config.

**Dependencies:**

- Package: Codec — the codec must exist first.

## Execution Context

Execution occurs from `$WORKSPACE/`; the codec package is created in the Art MD checkout `$PROJECT` (checkout `checkouts/art-md-building`) on branch `building`, under `$PROJECT/libs/codec/` and `$PROJECT/cli/codec-tests/`.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan.

| Iteration / Instructions                                                                                 | Status |
| -------------------------------------------------------------------------------------------------------- | ------ |
| Iteration: Scaffold Codec Package `./instructions/scaffold-codec-package.md`                             | `DONE` |
| Iteration: Implement Codec `./instructions/implement-codec.md`                                           | `DONE` |
| Iteration: Rename Pipeline Tests to Codec Tests `./instructions/rename-pipeline-tests-to-codec-tests.md` | `DONE` |

### Iteration: Scaffold Codec Package

**Id:** `scaffold-codec-package`

**Status:** `DONE`

**Report:** `./instructions/scaffold-codec-package__report.md`

**Purpose:** Scaffold the `@art-md/codec` package following the sibling libs pattern.

**Description:** Create `libs/codec/` with the package manifest, build/test configs, records, and package docs, mirroring the parser package layout. No source code yet.

**Instructions:** `./instructions/scaffold-codec-package.md`

**Changes:**

- Create `libs/codec/package.json` (`@art-md/codec`, deps on `@art-md/primitives`, `@art-md/constructs`, `@art-md/parser`, `@art-md/serializer`).
- Create `tsconfig.json`, `tsconfig.vite.json`, `vite.config.ts`, `vitest.config.ts`, `.eslintrc.cjs`, `.npmignore`, `.prettierignore`, `LICENSE-MIT`.
- Create `README.md`, `_guide.md`, `CHANGELOG.md`.
- Create `_records/package.art` and `_records/npm-deployment.art`.

**Dependencies:**

- None.

#### Commits:

| ID                       | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------ | -------------------------------- | -------- | --------- | ----------- |
| `scaffold-codec-package` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `3856279` | `COMMITTED` |

##### Commit: `scaffold-codec-package`

**Message:**

```text
build(codec): scaffold codec package
```

### Iteration: Implement Codec

**Id:** `implement-codec`

**Status:** `DONE`

**Report:** `./instructions/implement-codec__report.md`

**Purpose:** Implement the codec types and `createArtCodec()` against the `ArtCodec` contract.

**Description:** Add `ArtCodecConfig` and `PartialArtCodecConfig` in `src/types.ts`, `createArtCodec()` in `src/createArtCodec.ts`, the package index, and unit tests for the overloaded entry points.

**Instructions:** `./instructions/implement-codec.md`

**Changes:**

- Add `src/types.ts` — `ArtCodecConfig` (`parserConfig: ParserConfig`, `serializerConfig: SerializerConfig`) and `PartialArtCodecConfig` (optional partial parser/serializer configs), reusing the existing parser/serializer config types.
- Add `src/createArtCodec.ts` — `createArtCodec(config?: PartialArtCodecConfig)` returns an `ArtCodec` wrapping the parser/serializer entry points, using the provided config values or the default constructs.
- Add `src/index.ts` — export `ArtCodecConfig`, `PartialArtCodecConfig`, `createArtCodec`.
- Add `src/createArtCodec.test.ts` — coverage for the overloaded `parse`/`serialize` entry points using the default codec config.

**Dependencies:**

- Iteration: Scaffold Codec Package.

#### Commits:

| ID                | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ----------------- | -------------------------------- | -------- | --------- | ----------- |
| `implement-codec` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `5e18e87` | `COMMITTED` |

##### Commit: `implement-codec`

**Message:**

```text
build(codec): implement createArtCodec
```

### Iteration: Rename Pipeline Tests to Codec Tests

**Id:** `rename-pipeline-tests-to-codec-tests`

**Status:** `DONE`

**Report:** `./instructions/rename-pipeline-tests-to-codec-tests__report.md`

**Purpose:** Rename `cli/pipeline-tests` to `cli/codec-tests` and point the test scripts at the codec.

**Description:** Rename the CLI directory and package, update the test scripts to use `codec.parse`/`codec.serialize`, remove the temporary config assembly, and replace the parser/serializer dependencies with the codec.

**Instructions:** `./instructions/rename-pipeline-tests-to-codec-tests.md`

**Changes:**

- Rename `cli/pipeline-tests` to `cli/codec-tests` (directory, package name `@art-md/codec-test-cli`, records, `_guide.md`, `README.md`, `CHANGELOG.md`).
- Update `scripts/test/parser/parseFixture.ts` to use `codec.parse(content)`.
- Update `scripts/test/serializer/serializeFixture.ts` and `diffFixtureResults.ts` to use `codec.serialize(artDocument)`.
- Update `package.json` dependencies: add `@art-md/codec`, remove `@art-md/parser` and `@art-md/serializer`, retain `@art-md/constructs`.

**Dependencies:**

- Iteration: Implement Codec.

#### Commits:

| ID                                     | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| -------------------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `rename-pipeline-tests-to-codec-tests` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `fb01835` | `COMMITTED` |

##### Commit: `rename-pipeline-tests-to-codec-tests`

**Message:**

```text
build(codec): rename pipeline-tests to codec-tests
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

All iterations DONE. Plan `implement-codec-package` complete.

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

When making changes to parser, serializer, or constructs packages, execute from `cli/codec-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Coordination

### Not In Scope

- **Source I/O** — the codec does not perform source I/O; content sources are consumed via operation contexts.
- **Concrete content sources** — `FSContentSource`, `MemoryContentSource` are future work.
- **CLI integration** — the `@art-md/bin` CLI is configured via the codec later.

### Evidence

- `@art-md/codec` package scaffolded under `libs/codec/` (manifest, configs, docs, records, placeholder `src/index.ts`); workspace registered in `package-lock.json`; repo `npm run ci` passes (commit `3856279`).
- `ArtCodecConfig`/`PartialArtCodecConfig` and `createArtCodec()` implemented in `@art-md/codec` with unit tests; codec registered in `architecture/components.md` and `_records/project.art`; repo `npm run ci` passes (commit `5e18e87`).
- `cli/pipeline-tests` renamed to `cli/codec-tests` (`@art-md/codec-test-cli`); test scripts point at the codec and drop the temporary config assembly; repo `npm run ci` passes (commit `fb01835`).

### Findings

- **Codec stays small** — the package intentionally stays small so alternative/configured codecs can exist independently.
- **`ArtCodecConfig` reuses existing config types** — holds `parserConfig: ParserConfig` and `serializerConfig: SerializerConfig` directly, reusing types that already exist.
- **Pipeline tests become codec tests** — `cli/pipeline-tests` is renamed to `cli/codec-tests`; the test scripts point at the codec dependency and drop the temporary config assembly.
- **Constructs dependency dropped from codec-tests** — `createArtCodec` provides the default constructs, so the test suite no longer needs to assemble a config; `@art-md/constructs`, `@art-md/parser`, and `@art-md/serializer` are all removed from codec-tests.

### Decisions

- **Codec owns configuration** — `@art-md/codec` owns `ArtCodecConfig`, `PartialArtCodecConfig`, and `createArtCodec()`; the `ArtCodec` contract lives in `@art-md/primitives`.
- **`createArtCodec` accepts a partial config with defaults** — `parserConfig`/`serializerConfig` are optional and partial; each provided value is used as-is (no array merging) and falls back to the default constructs (`DEFAULT_CONSTRUCT_PARSER`, `CONSTRUCT_PARSERS`, `CONSTRUCT_SERIALIZERS`).
- **No source I/O in codec** — the codec parses and serialises documents only; source acquisition happens through `ArtContentSource` in the operation contexts.
- **Tests point at the codec** — `cli/pipeline-tests` is renamed to `cli/codec-tests`; the test scripts use the codec and drop the temporary config assembly and the direct parser/serializer dependencies.

### Knowledge to Update

- `$PROJECT/libs/codec/_guide.md` — package layout and operations.
- `$PROJECT/libs/codec/README.md` — package description.
- `$PROJECT/libs/codec/CHANGELOG.md` — initial entry.
- `$PROJECT/cli/codec-tests/_guide.md` — renamed package layout and operations.
- `$PROJECT/cli/codec-tests/README.md` — renamed package description.
- `$PROJECT/cli/codec-tests/CHANGELOG.md` — rename entry.

### Follow Ups

- None.

### Feedback

- None.
