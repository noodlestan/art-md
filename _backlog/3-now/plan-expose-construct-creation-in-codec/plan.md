# Plan: Expose Construct Creation in Codec

**ID:** `expose-construct-creation-in-codec`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Has Context File:** `FALSE`

**Skill:** `write-plan`

**Purpose:** Allow consumers to create construct instances through a codec instance API.

**Description:** Give `ArtCodec` an open construct surface — `getConstructFactory(name)`, `create<C>(name, ...args)`, and `toText(construct)` — implemented by `@art-md/codec` over the construct factory array the instance was configured with, so the codec, and not the constructs package, decides what is creatable. The index is built lazily from `config.factories ?? FACTORIES` and discards `Document`, so document creation stays out of this API by construction. Both packages are republished so consumers can adopt it.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the Plan file and its downstream work items. All file references in the Plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path             | Purpose                                       |
| ------------ | ------------------------- | --------------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory.                     |
| `$PROJECT`   | `checkouts/art-md`        | Checkout for Art MD implementation.           |
| `$DOMAINS`   | `.agents/domains`         | Agent domains (plans, work, operations, ...). |

## Summary

Extend the `ArtCodec` interface in `@art-md/primitives` and implement it in `@art-md/codec` so consumers can look up a construct factory and create construct instances through a configured codec instance — plus `toText` for reading a construct's text — then republish both packages. `@art-md/constructs` is not touched.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

| Kind      | Path                                                             | Role                                                       |
| --------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/6-plan/milestone-art-constructs/milestone.md` | Coordinates this plan within the Art Constructs milestone. |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

This section lists all domains involved in the Plan.

| Domain / Path                                 | Description                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating. |
| Domain: Packages `$DOMAINS/packages/index.md` | Represents publishable libraries and CLIs, their grouping and publications.  |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion, Verifying Step.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Implementing, Verifying Step.
::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` (Conventions) — Unit test conventions. Relevant for Implementing, Verifying Step.

## Scope

This section describes the working scope coordinated by the Plan.

Implement the construct factory API across `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/`, then republish both. No changes to `$PROJECT/libs/constructs/`, `$PROJECT/libs/parser/`, or `$PROJECT/libs/serializer/`.

### (Scope) Package: Primitives

**Record:** `$PROJECT/libs/primitives/_records/package.art`

**Role:** Owns the `ArtCodec` interface every consumer codes against.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/primitives/`
- `canonicalName` — `@art-md/primitives`

**Changes:**

- Add `getConstructFactory`, `create`, and `toText` to the `ArtCodec` interface in `$PROJECT/libs/primitives/src/codec/types.ts`.
- Type the new members with primitives' own `ConstructBase` — `@art-md/primitives` must not depend on `@art-md/constructs`, and callers supply the concrete generic.
- Add the factory function and registry entry types next to the codec types.

**Dependencies:**

- None.

### (Scope) Package: Codec

**Record:** `$PROJECT/libs/codec/_records/package.art`

**Role:** Owns `createArtCodec`, the instance that configures and serves the construct factory registry.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/codec/`
- `canonicalName` — `@art-md/codec`

**Changes:**

- Accept a `factories` entry in the codec config, defaulting to `FACTORIES` from `@art-md/constructs`.
- Build the `name => factory` index lazily on first lookup or creation, discarding the `Document` entry — the discard is hardcoded in this package for now.
- Implement `getConstructFactory`, `create`, and `toText`; `toText` reads `value`, otherwise joins the recursive `children` read, otherwise returns an empty string.
- Report one not-found error for every name absent from the index — `Document` and an unknown name take the same path, with no `Document`-specific branch.
- Cover the behaviour with tests in both packages.

**Dependencies:**

- Package: Primitives — the interface and its implementation change in the same iteration so the contract and the codec never disagree.

## Execution Context

Execution occurs from `$WORKSPACE/`; the package work is performed in the Art MD checkout `$PROJECT` on branch `main`, under `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/`. Both packages are published to npm.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                   | Status     |
| ------------------------------------------------------------------------------------------ | ---------- |
| Iteration: Define Construct API on Codec `./instructions/define-construct-api-on-codec.md` | `READY`    |
| Iteration: Publish Construct API                                                           | `PLANNING` |

### Iteration: Define Construct API on Codec

**Id:** `define-construct-api-on-codec`

**Status:** `READY`

**Purpose:** Give `ArtCodec` an open construct creation and reading surface that any configured factory list can serve.

**Description:** Extend the `ArtCodec` interface in primitives, implement it in codec over a lazily built index of the configured construct factories with `Document` discarded, and cover lookup, creation, rejection, and text reading with tests in both packages.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/define-construct-api-on-codec.md`

**Changes:**

- In `$PROJECT/libs/primitives/src/codec/types.ts`, add the three members to `ArtCodec`:
  - `getConstructFactory(name: string): ConstructFactoryFunction | undefined;`
  - `create<C extends ConstructBase = ConstructBase>(name: string, ...args: readonly unknown[]): C;`
  - `toText(construct: ConstructBase): string;`
- Define the factory function type and the registry entry type (`{ name, factory }`) beside the codec types, in terms of `ConstructBase`.
- In `$PROJECT/libs/codec/src/types.ts`, add `factories` to `ArtCodecConfig` and `PartialArtCodecConfig`.
- In `$PROJECT/libs/codec/src/createArtCodec.ts`, build a `Map<name, factory>` lazily on first access from `config.factories ?? FACTORIES`, discarding the `Document` entry — the builder is extracted to `$PROJECT/libs/codec/src/private/createFactoryIndex.ts` per **Function Extraction**.
- Implement the three members; `toText` performs the structural walk (`value` first, then recursive `children` joined, else an empty string).
- Throw a single not-found error for any name missing from the index, so `Document` and unknown names are indistinguishable.
- Add tests to `$PROJECT/libs/codec/src/createArtCodec.test.ts` and the primitives codec types covering: default index contents (no `Document`), configured factories replacing the default, a factory from another package being creatable, `Document` rejected, an unknown name rejected, `toText` on nested and valueless constructs, and repeated access not rebuilding the index.
- Run `npm run ci` from `$PROJECT/` to confirm both packages lint, build, and test green.

**Dependencies:**

- None.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| ---------------------- | ------------------------------ | -------- | ------- | ---------- |
| `define-construct-api` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | `(TBD)` | `AUTHORED` |

##### Commit: `define-construct-api`

**Repository:** Art MD

**Message:**

```text
build(codec): Expose construct creation and toText on ArtCodec
```

### Iteration: Publish Construct API

**Id:** `publish-construct-api`

**Status:** `PLANNING`

**Purpose:** Republish both packages so the new API is consumable.

**Description:** Bump `@art-md/primitives` and `@art-md/codec`, keep the dependency range aligned, verify the repository, and publish.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Bump `@art-md/primitives` from `0.0.6` and `@art-md/codec` from `0.0.3` in their `package.json` files.
- Keep `@art-md/codec`'s `@art-md/primitives` dependency range aligned with the bumped version.
- Run `npm run ci` from `$PROJECT/`.
- Publish both packages following `$PROJECT/_guide.md` and the deployment records at `$PROJECT/libs/primitives/_records/npm-deployment.art` and `$PROJECT/libs/codec/_records/npm-deployment.art`.

**Dependencies:**

- Iteration: Define Construct API on Codec — the API must exist before it can be published.

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| ----------------------- | ------------------------------ | -------- | ------- | ---------- |
| `publish-construct-api` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | `(TBD)` | `AUTHORED` |

##### Commit: `publish-construct-api`

**Repository:** Art MD

**Message:**

```text
release(art-md): Republish primitives and codec with construct API
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Delegate Iteration: Define Construct API on Codec.

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

Because the contract changes land in primitives and its implementation in codec, run both package suites:

```bash
# from $PROJECT/libs/primitives/
npm run test:ci # runs vitest with the configured coverage thresholds
# from $PROJECT/libs/codec/
npm run test:ci # runs vitest with the configured coverage thresholds
```

---

## Coordination

This section describes the boundaries, evidence, and follow ups of this work item.

### Not In Scope

- **`@art-md/constructs`** — no change to the package, its exports, or `FACTORIES`; it contributes only the default factory list.
- **Document creation** — `create` never produces an `ArtDocument`; documents come from `parse` and `createArtDocument`.
- **Type-safe name/generic pairing** — the generic is supplied and trusted by the caller; deriving it from instance configuration is a follow-up.
- **Parser and serializer** — untouched, including the construct serializer registries.

### Evidence

- `FACTORIES` verified against the installed `@art-md/constructs@0.0.6`: `FACTORIES.find(f => f.name === 'NaturalBlock').factory({ value: 'x', children: [] })` returns `{"construct":"NaturalBlock","value":"x","children":[]}` — the default registry input works with no change to constructs.
- The published `0.0.6` runtime exports exactly `CONSTRUCT_PARSERS, CONSTRUCT_SERIALIZERS, DEFAULT_CONSTRUCT_PARSER, FACTORIES, createArtDocumentFromNode`; every construct factory is reachable only through `FACTORIES`.

### Findings

- **Constructs never exports its `create*` functions.** `src/index.ts` re-exports `./factories/public.js`, which imports the seven factories as raw material for `FACTORIES` and exports only types plus the array, and `package.json` `exports` exposes no deep paths. `FACTORIES` is the only public entry, which is why the codec reads it rather than importing factories.
- **`FACTORIES` has no consumers** anywhere in Art MD today, so its shape can still be leaned on without back-compat risk.
- **`ArtCodec` lives in primitives but the `Construct` union lives in constructs.** Primitives cannot name that union without inverting the dependency, so `ConstructBase` — already exported from primitives — is the contract type, and the caller supplies the concrete generic.
- **`ConstructFactory<T>` in primitives is dead and shaped `{ fromData(data) }`**, while the real registry uses bare functions; a distinct entry type avoids changing a published type nobody uses.
- **All seven factories take exactly one data object**, so `create(name, ...args)` keeps the call shape open for custom factories that take more.

### Decisions

- **The registry is open.** The codec is configured with its construct factory list, so constructs is not the authority on what a construct is; no name filtering lives in that package.
- **`Document` is discarded at index build**, hardcoded in the codec package for now, and takes the same not-found path as an unknown name — no `Document`-specific branch in the API.
- **`toText` is a codec method, not a construct instance method.** Constructs are plain object literals that lose methods under spread, `structuredClone`, and the hand-built literals consumers already create.
- **The generic is caller-trusted for now** — `<C>` with a single internal cast; the mapped type over the instance's configuration is deferred.

### Knowledge to Update

- None.

### Follow Ups

- **Type-safe creation** — derive the name/generic/args triple from the instance's configured factories with a mapped type, so `create` cannot be called with a mismatched name.
- **Configured text rendering** — let registry entries carry `toText` so reading dispatches to configured per-construct serializers instead of the structural walk.
- **Configuration-derived filtering** — replace the hardcoded `Document` discard with a filter derived from the configured list.
- **`ConstructFactory<T>`** — reconcile the unused `{ fromData }` type in primitives with the registry entry type, or remove it.

### Feedback

- None.
