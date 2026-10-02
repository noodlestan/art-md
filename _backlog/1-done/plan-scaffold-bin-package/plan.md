# Plan: Scaffold Bin Package

**ID:** `scaffold-bin-package`

**Status:** `DELIVERED`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Complete the `@art-md/bin` package scaffold so that it declares its runtime dependencies, exports the three CLI entry points, and passes the repository lint, build, and test pipeline.

**Description:** `cli/bin/` currently holds a template-derived placeholder — a `package.json` with no `bin` exports and no dependencies, a `// placeholder` `src/index.ts`, a `vitest.config.ts` with coverage thresholds, and records and docs that still describe a bundler/validator/watcher CLI. This plan turns the directory into a real, buildable package: add `commander`, `@art-md/codec`, and `@art-md/primitives` as dependencies; declare the `art-codec`, `art-parse`, and `art-serialize` exports against the built `dist/esm/bin/*.mjs` entries emitted by the `esbuild-cli` build; add the missing `.eslintrc.cjs`; and realign `_records/package.art`, `_guide.md`, `README.md`, and `CHANGELOG.md` with the package's actual role. No command behaviour is implemented here — the three entry points land as stubs so the pipeline has real modules to resolve, and the implementations land in `implement-bin-commands`.

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

Complete the `@art-md/bin` package scaffold in `$BUILD/cli/bin/`: declare the `commander`, `@art-md/codec`, and `@art-md/primitives` dependencies, export the `art-codec`, `art-parse`, and `art-serialize` entry points, add the missing lint config, and realign the package records and docs with the CLI's actual role.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

| Kind         | Path                                                               | Role                                                            |
| ------------ | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Milestone    | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md`         | Coordinates this plan within the Codec Bin milestone.           |
| Design       | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone__design.md` | The design this plan implements.                                |
| Milestone    | `$PROJECT/_roadmap/1-done/milestone-art-codec/milestone.md`        | Delivered the `@art-md/codec` package this CLI wraps.           |
| Architecture | `$PROJECT/architecture/components.md`                              | Planned packages: Bin (CLI), with the stale entry-point naming. |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.
- `scaffold` — Scaffolds package files from records and templates. Required for Implementing.

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
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$ART_WORK/cli/work/package.json` (Reference) — Art Work CLI manifest: the `bin` export shape and the `esbuild-cli` build wiring to mirror. Relevant for Implementing.
::READ `$BUILD/node_modules/@noodlestan/esbuild/src/config/esm.mjs` (Reference) — Build config: globs every `src/**/*.ts`, including test files, into a separate bundle under `dist/esm/`. Determines where the three entry points must live. Relevant for Implementing.

## Scope

This section describes the working scope coordinated by the Plan.

Complete the package scaffold in `$BUILD/cli/bin/`. The package directory, its build configs, and its `vitest.config.ts` already exist; this plan adds the manifest contract, the lint config, and the package-level knowledge, and replaces the placeholder entry with three stub entry points.

### (Scope) Package: Bin

**Record:** `$BUILD/cli/bin/_records/package.art`

**Role:** Owns the three CLI entry points and the shared commander builder utilities and `doParse`/`doSerialize` implementations.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$BUILD/cli/bin/`
- `canonicalName` — `@art-md/bin`

**Changes:**

- Add runtime dependencies to `package.json`: `commander` (CLI parsing), `@art-md/codec` (`createArtCodec`), `@art-md/primitives` (the `ArtCodec`, `ParseResult`, and `SerializeResult` types). Pin the two workspace packages as `"*"` per the sibling `libs/*/package.json` convention, and `commander` as `"^12.0.0"` to match the Art Work CLI.
- Run `npm install` at the repository root so `package-lock.json` records the new dependencies; without it `npm ci` fails on a lockfile-manifest mismatch. Commit the lockfile alongside the manifest.
- Declare the `bin` exports, resolving to the bundles the `esbuild-cli` build emits for `src/bin/*.ts`:
  - `art-codec` — `./dist/esm/bin/codec.mjs`
  - `art-parse` — `./dist/esm/bin/parse.mjs`
  - `art-serialize` — `./dist/esm/bin/serialize.mjs`
- Complete the rest of the manifest contract, which is currently half-declared: add `publishConfig.access: "public"` (absent here, present on `@art-md/codec`), and confirm `files` still ships the built bins. The `exports["."].types` condition is left as-is: `esbuild-cli` does emit the declaration it points at.
- Create `.eslintrc.cjs` re-exporting the repository root config, matching the sibling `libs/*/.eslintrc.cjs` pattern (spread the required root config into a new object), so `npm run lint` resolves a config for the package.
- Create `src/bin/codec.ts`, `src/bin/parse.ts`, `src/bin/serialize.ts` as shebang stubs that print a not-yet-implemented notice and exit non-zero, so `npm run build` and the `bin` exports have real modules to resolve. The stubs export nothing and self-execute on import, so no test may import them.
- Replace the `// placeholder` `src/index.ts` with the package's public export surface: re-export the `@art-md/primitives` types this package consumes (`ArtCodec`, `ParseResult`, `SerializeResult`). Types only — no placeholder runtime export is introduced, because there is no real runtime surface to export until Plan: Implement Bin Commands and a fabricated constant would have to be deleted there.
- Add `src/bin/binManifest.test.ts` asserting the `bin` contract rather than module internals: for each entry, the source file exists at the matching `src/bin/*.ts` path, carries a `#!/usr/bin/env node` shebang, and its manifest target is the `./dist/esm/bin/*.mjs` path the build emits. The test reads the manifest and the source files as text and imports nothing, which is the regression guard for the mapping this iteration actually establishes.
- Extend the `vitest.config.ts` coverage `exclude` from `['src/index.ts']` to also exclude `src/bin/*` — the stubs are self-executing and are not covered by this iteration's tests, so leaving them in scope fails the 90% thresholds. Plan: Implement Bin Commands removes the `src/bin/*` exclusion once the entry points hold real, testable logic.
- Update `_records/package.art` — replace the bundler/validator/compiler/watcher purpose and description with the parse/serialise CLI role; record the three entry points in `Files:`; add the `Dependencies:` entries.
- Update `_guide.md` — package layout including `src/bin/`, `src/commands/`, `src/private/`, and `src/test/`; add the `npm run test` and `npm run ci` operating instructions.
- Update `README.md` — package description, the three commands, and the bin exports.
- Create `CHANGELOG.md` with an initial entry recording the three entry points.

**Dependencies:**

- Package: Codec — `@art-md/codec` must exist first (delivered by Milestone: Art Codec).

## Execution Context

Execution occurs from `$WORKSPACE/`; the package work is performed in the Art MD building checkout `$BUILD` (checkout `checkouts/art-md-building`) on branch `building`, under `$BUILD/cli/bin/`.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                 | Status |
| ---------------------------------------------------------------------------------------- | ------ |
| Iteration: Declare Bin Package Contract `./instructions/declare-bin-package-contract.md` | `DONE` |
| Iteration: Document Bin Package `./instructions/document-bin-package.md`                 | `DONE` |

### Iteration: Declare Bin Package Contract

**Id:** `declare-bin-package-contract`

**Status:** `READY`

**Purpose:** Make the package installable, buildable, and lintable with the three CLI entry points declared in its manifest.

**Description:** Turn the template-derived scaffold into a real package by adding the runtime dependencies, declaring the `bin` exports against the `esbuild-cli` output, adding the missing lint config, and landing three stub entry points under `src/bin/`.

**Instructions:** `./instructions/declare-bin-package-contract.md`

**Changes:**

- Add `commander` (`^12.0.0`), `@art-md/codec`, and `@art-md/primitives` (`"*"` each) to `package.json` `dependencies`, and update `package-lock.json` with `npm install`.
- Add the `bin` block to `package.json` mapping `art-codec`, `art-parse`, and `art-serialize` to `./dist/esm/bin/{codec,parse,serialize}.mjs`; add `publishConfig.access` and drop the dangling `exports["."].types`.
- Create `.eslintrc.cjs` re-exporting the repository root ESLint config.
- Create `src/bin/codec.ts`, `src/bin/parse.ts`, `src/bin/serialize.ts` as self-executing shebang stubs that export nothing.
- Replace the `// placeholder` `src/index.ts` with a type-only public export surface re-exporting the `@art-md/primitives` types.
- Extend the `vitest.config.ts` coverage `exclude` to cover `src/bin/*`.
- Add `src/bin/binManifest.test.ts` asserting the `bin` → source → build-path mapping by reading the manifest and sources, importing nothing.
- Update `_records/package.art` with the CLI role, the three entry points, and the dependencies.

**Dependencies:**

- None.

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------------------------------ | ------------------------------ | -------- | --------- | ----------- |
| `declare-bin-package-contract` | Art MD / `$BUILD` / `building` | `NOPUSH` | `0f7c86b` | `COMMITTED` |

##### Commit: `declare-bin-package-contract`

**Repository:** Art MD

**Message:**

```text
build(bin): declare package contract and entry point exports
```

### Iteration: Document Bin Package

**Id:** `document-bin-package`

**Status:** `READY`

**Purpose:** Align the package's own records and docs with its real role, so the next iteration starts from accurate package knowledge.

**Description:** Realign `_records/package.art`, `_guide.md`, and `README.md` with the parse/serialise CLI role and the three entry points, and add the initial `CHANGELOG.md`. Executes after Iteration: Declare Bin Package Contract and describes the manifest, entry points, and lint config that iteration lands; the dependency is expressed by position in the Items table, since iteration-to-iteration dependencies are not recorded here.

**Instructions:** `./instructions/document-bin-package.md`

**Changes:**

- Realign `_guide.md` — package layout (`src/bin/`, `src/commands/`, `src/private/`, `src/test/`), records management, and operating instructions (`npm run test`, `npm run ci`).
- Rewrite `README.md` — package description, the `art-codec`/`art-parse`/`art-serialize` commands, and the build and scripts sections.
- Create `CHANGELOG.md` with the initial entry for the three entry points.

**Dependencies:**

- None.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ---------------------- | ------------------------------ | -------- | --------- | ----------- |
| `document-bin-package` | Art MD / `$BUILD` / `building` | `NOPUSH` | `72b62bb` | `COMMITTED` |

##### Commit: `document-bin-package`

**Repository:** Art MD

**Message:**

```text
docs(bin): document package role, entry points, and operations
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Both iterations are `DONE` and the plan is `DELIVERED`, awaiting review. The reports are at `./instructions/declare-bin-package-contract__report.md` and `./instructions/document-bin-package__report.md`. On acceptance, move this plan to `_backlog/1-done/` and mark Phase 1 of Milestone: Codec Bin `DONE`; the milestone's next move is Plan: Implement Bin Commands.

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

When making changes to the CLI package, execute from `$BUILD/cli/bin/`:

```bash
npm run test # runs vitest against the CLI unit tests
```

---

## Coordination

This section describes the boundaries, evidence, and follow ups of this work item.

### Not In Scope

- **Command behaviour** — `doParse`, `doSerialize`, the commander builders, and the logger are implemented by Plan: Implement Bin Commands.
- **`@art-lib` package creation** — abstracting repeated code into `@art-lib` is a follow-up identified by Plan: Consolidate Codec Bin.
- **Concrete content sources** — `FSContentSource` and `MemoryContentSource` remain future work; the bin owns its own thin file I/O.

### Evidence

- **Iteration: Declare Bin Package Contract** — committed `0f7c86b` (`build(bin): declare package contract and entry point exports`), 10 files, +116/-4, not pushed. `npm run ci` passes repo-wide (7/7 turbo tasks); `npm run test` and `npm run test:ci` pass in `$BUILD/cli/bin/`; `npm ci` resolves 604 packages, proving `package-lock.json` was updated and committed. All three bins build to `dist/esm/bin/{codec,parse,serialize}.mjs` with shebangs preserved, and each prints its notice and exits 1. The three entry-point stubs were later amended to function declarations to satisfy the `Functions over Arrows` convention; the commit's file and line counts are unchanged by that fix.
- **Iteration: Document Bin Package** — committed `72b62bb` (`docs(bin): document package role, entry points, and operations`), 3 files, +64/-4, not pushed. `npm run ci` passes repo-wide with 43 fixtures round-tripped; `npm run test` passes in `$BUILD/cli/bin/`.
- **The `exports["."].types` removal was reverted** — the first iteration removed that condition on the incorrect premise that `esbuild-cli` never emits declarations. `@noodlestan/esbuild` appends `emitTypesPlugin` to the esm build, which shells out to `npm run build:types:esm` on completion, so `dist/esm/index.d.ts` is regenerated on every build. The condition was restored and the commit amended from `efde40b` to `0f7c86b`; `dist/esm/index.d.ts` now emits the three exported types and resolves for consumers.
- **Entry points export nothing** — the stubs self-execute and `binManifest.test.ts` reads the manifest and sources as text, so no placeholder constant exists to be deleted downstream.

### Findings

- **The scaffold is template-derived, not milestone-derived** — `cli/bin/` was scaffolded with a bundler/validator/compiler/watcher description and no dependencies, so the manifest contract has to be established here rather than adjusted.
- **`esbuild-cli` globs every `src/**/\*.ts`** — the build emits one bundle per source file under `dist/esm/`, so the three entry points must live at `src/bin/{codec,parse,serialize}.ts`for the`bin`exports to resolve to build output rather than TypeScript sources. Neither`esm.mjs`nor`common.mjs` configures a shebang banner; hashbang preservation is esbuild's own entry-point behaviour, not something the build config guarantees.
- **`__BUILD_VERSION__` is not defined by the build** — the Art Work CLI declares the ambient global but `@noodlestan/esbuild` never defines it; the bin reads its version from `package.json` instead.
- **Coverage thresholds are already configured** — `cli/bin/vitest.config.ts` sets 90% lines/functions/statements and 75% branches, with `src/index.ts` excluded; the `src/bin/*` stubs are added to the exclusion here and must come out of it in Plan: Implement Bin Commands.
- **The manifest contract is half-declared** — the scoped package lacks the `publishConfig.access: "public"` that `@art-md/codec` carries, so publishing would fail. The `exports["."].types` condition is already correct: `esbuild-cli` appends `emitTypesPlugin` to the esm build, which shells out to `npm run build:types:esm` on completion and regenerates `dist/esm/index.d.ts` on every build.
- **The build globs test files too** — `src/**/*.ts` matches `*.test.ts`, so the manifest test this plan adds also emits a bundle; a build-output exclusion is required before publication.

### Decisions

- **Bin exports point at build output** — `art-codec`, `art-parse`, and `art-serialize` resolve to `./dist/esm/bin/*.mjs`, following the `esbuild-cli` output layout, rather than to `bin/*` source stubs. The Art Work CLI's own bin is a single entry from `src/index.ts`; three bins cannot reuse that shape.
- **Entry points live under `src/bin/`** — a directory, not three top-level source files, so the shared commander builders stay one level up in `src/private/commander/`. This deviates from the Art Work CLI, whose single `art-work-cli` bin points at `dist/esm/index.mjs` from `src/index.ts`; the deviation buys three independent bundles and is not drift to be corrected later.
- **No placeholder export surface** — the scaffold exports types only. Inventing a runtime constant (a `PROGRAM_NAME` or similar) to satisfy a test would be scaffolding with no consumer, and would have to be deleted by the next plan.
- **The manifest test asserts the manifest** — `binManifest.test.ts` reads `package.json` and the sources as text instead of importing the entry points, because the stubs self-execute and call `process.exit`, which would kill the test process.
- **No ambient build-version global** — the version is read from `package.json` at runtime; `src/globals.d.ts` is not introduced.
- **Stubs, not behaviour** — the three entry points land as stubs so the pipeline has modules to resolve; behaviour lands in Plan: Implement Bin Commands.

### Knowledge to Update

- `$BUILD/cli/bin/_records/package.art` — CLI role, entry points, and dependencies.
- `$BUILD/cli/bin/_guide.md` — package layout and operating instructions.
- `$BUILD/cli/bin/README.md` — package description and commands.
- `$BUILD/cli/bin/CHANGELOG.md` — initial entry.

### Follow Ups

- **Entry point naming in `architecture/components.md`** — the planned-packages text still names `art-md-parser`, `art-md-serializer`, `art-md`, and `art-md-validator`; Plan: Update Bin Knowledge corrects it to the decided `art-codec`, `art-parse`, and `art-serialize`.
- **Remove the `src/bin/*` coverage exclusion** — the stub exclusion added in `vitest.config.ts` is temporary scaffolding; Plan: Implement Bin Commands drops it when the entry points hold real, tested logic.
- **Exclude test bundles from the build output** — the `esbuild-cli` glob emits a bundle per test file; the exclusion must land before `@art-md/bin` is published.

### Feedback

- **Report files must be prettier-formatted** — Iteration 1 left its report unformatted, which made `prettier . -c` exit 1 repo-wide and silently aborted the next commit via the lefthook `pre-commit` hook. Iteration 2 was instructed to format its own report; both reports are now clean. Worth folding into the worker skill or the report template so it does not depend on the delegator remembering.
- **The guide documents directories that do not exist yet** — `_guide.md` lists `src/commands/`, `src/private/`, and `src/test/`, none of which exist at delivery. All three are created by Plan: Implement Bin Commands, so the description is accurate as a target, and the guide marks them explicitly as not yet populated. Flagged by the worker, confirmed by the delegator.
- **Instructions over-specified the layout** — the instruction asked for all four directories, which pushes the next plan's structure into this plan's documentation. It happens to be correct, but it couples the two plans more tightly than the dependency graph admits.
