# Instructions: `define-construct-api-on-codec`

**Plan:** `expose-construct-creation-in-codec`

**Iteration Id:** `define-construct-api-on-codec`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/define-construct-api-on-codec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `define-construct-api-on-codec`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory.             |
| `$PROJECT`   | `checkouts/art-md`        | Checkout where execution takes place. |

Package paths used in the steps: `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/`.

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `define-construct-api-on-codec`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Expose an open construct surface on `ArtCodec` — `getConstructFactory(name)`, `create<C>(name, ...args)`, and `toText(construct)` — implemented in `@art-md/codec` over the construct factory list the instance is configured with, so a codec instance can create construct instances without any consumer importing factories directly. `Document` is not creatable through this API, and `@art-md/constructs` is not modified.

## Mandatory Reading

- Guide: `$PROJECT/_guide.md` — Setting Up, Verifying Completion, Verifying Step.
- Guide: `$WORKSPACE/_guide.md` — Setting Up, Verifying Completion.
- Conventions: TypeScript — `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`.
- Conventions: Unit Tests — `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md`.
- Reference: `$PROJECT/libs/primitives/src/codec/types.ts` — the `ArtCodec` interface you extend.
- Reference: `$PROJECT/libs/primitives/src/constructs/types.ts` — `ConstructBase`, the contract type.
- Reference: `$PROJECT/libs/codec/src/createArtCodec.ts` — the instance you implement against.
- Reference: `$PROJECT/libs/codec/src/createArtCodec.test.ts` — the existing suite you extend.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

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

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

**Instructions:** (From `$PROJECT/_guide.md`)

Because the contract lands in primitives and its implementation in codec, run the suite of each package you touched, from that package directory:

```bash
npm run test:ci # runs vitest with the configured coverage thresholds
```

---

## Changes

Add the three members to `ArtCodec` in `@art-md/primitives`, configure and build the construct factory index in `@art-md/codec` with `Document` discarded, implement the members, and cover the behaviour with tests. `@art-md/constructs` contributes only its `FACTORIES` array as the default input and is not edited.

- Step 1 / 5 — Extend the `ArtCodec` contract in primitives
- Step 2 / 5 — Configure the codec's construct factories
- Step 3 / 5 — Implement `getConstructFactory`, `create`, `toText`
- Step 4 / 5 — Cover the new API with tests
- Step 5 / 5 — Commit `define-construct-api`

## Steps

### Step `1 / 5` — Extend the `ArtCodec` contract in primitives

Make the contract exist before anything implements it.

In `$PROJECT/libs/primitives/src/codec/types.ts`:

- Import `ConstructBase` from the constructs module barrel (`../constructs/index.js`), keeping it a type-only import — **Barrel File Imports**.
- Add these members to `ArtCodec` alongside the existing `parse` and `serialize` overloads. Keep the declaration style already in the file — converting this `interface` to a `type` would collapse its overloads and is out of scope (**No Interface** governs new declarations, not the pre-existing contract).

```ts
getConstructFactory(name: string): ConstructFactoryFunction | undefined;
create<C extends ConstructBase = ConstructBase>(name: string, ...args: readonly unknown[]): C;
toText(construct: ConstructBase): string;
```

- Add the supporting types beside `ArtCodec` in the same file:

```ts
export type ConstructFactoryFunction = (...args: readonly unknown[]) => ConstructBase;

export type ConstructFactoryEntry = {
  readonly name: string;
  readonly factory: ConstructFactoryFunction;
};
```

- Re-export both types from `$PROJECT/libs/primitives/src/codec/index.ts`, which currently exports only `ArtCodec`. The `@art-md/codec` package imports through `@art-md/primitives`'s root entry, so an unexported type is invisible to it.

Expected outcome: `npm run test:ci` from `$PROJECT/libs/primitives/` passes. The `@art-md/codec` package will NOT compile yet — `createArtCodec` does not satisfy the extended `ArtCodec` type. That is expected at this step and is resolved in Step 3; do not report it as a blocker and do not run the repository-wide verification yet.

### Step `2 / 5` — Configure the codec's construct factories

Give the instance its registry input.

In `$PROJECT/libs/codec/src/types.ts`:

- Add `factories: readonly ConstructFactoryEntry[];` to `ArtCodecConfig`.
- Add `factories?: readonly ConstructFactoryEntry[];` to `PartialArtCodecConfig`.
- Import the type from `@art-md/primitives`.

In `$PROJECT/libs/codec/src/createArtCodec.ts`:

- Import `FACTORIES` as a value from `@art-md/constructs` — it is exported in the installed version and is the default registry input. Do not import any `create*` function; none is exported by that package.
- Declare, above `createArtCodec`, the names excluded from the creatable set:

```ts
const DISCARDED_CONSTRUCT_FACTORY_NAMES = ['Document'];
```

Note on types: `FACTORIES`' entries declare concrete parameter types (`{ value: string; ... }`, `{ name: string; ... }`), so they are not directly assignable to `ConstructFactoryFunction` under TypeScript's parameter contravariance. Declare the bridged default above `createArtCodec`, in `createArtCodec.ts`, with one explicit, commented cast — it is consumed only in that file, which is the exception **Constants Location** allows:

```ts
const defaultConstructFactories = FACTORIES as unknown as readonly ConstructFactoryEntry[];
```

Step 3 reads it as `config.factories ?? defaultConstructFactories`. Keep the public type as `readonly unknown[]` — it is the honest contract for a registry whose entries come from any package.

### Step `3 / 5` — Implement `getConstructFactory`, `create`, `toText`

Build the index lazily and serve all three members from it.

In `$PROJECT/libs/codec/src/createArtCodec.ts`:

- Inside `createArtCodec`, above the returned object, build the index on first use. `getFactoryIndex` is a closure, and **Function Extraction** exempts closures, so it stays in this file:

```ts
let factoryIndex: Map<string, ConstructFactoryFunction> | undefined;

function getFactoryIndex(): Map<string, ConstructFactoryFunction> {
  if (factoryIndex === undefined) {
    const configuredFactories = config.factories ?? defaultConstructFactories;
    factoryIndex = createFactoryIndex(configuredFactories);
  }
  return factoryIndex;
}
```

- Extract the index builder to `$PROJECT/libs/codec/src/private/createFactoryIndex.ts` — a private, reusable, top-level function MUST be extracted to `./private/` (**Conventions: Typescript / Filesystem / Function Extraction**). Declare the discarded names in that file: they are non-exported and consumed only there, which is the exception **Constants Location** allows.

```ts
import type { ConstructFactoryEntry, ConstructFactoryFunction } from '@art-md/primitives';

const DISCARDED_CONSTRUCT_FACTORY_NAMES = ['Document'];

export function createFactoryIndex(
  factories: readonly ConstructFactoryEntry[],
): Map<string, ConstructFactoryFunction> {
  const discardedNames = new Set(DISCARDED_CONSTRUCT_FACTORY_NAMES);
  const creatableFactories = factories.filter(entry => !discardedNames.has(entry.name));
  const factoryEntries = creatableFactories.map(entry => [entry.name, entry.factory] as const);
  return new Map(factoryEntries);
}
```

- Extract the recursive text reader to `$PROJECT/libs/codec/src/private/readConstructText.ts` — same rule, and its name starts with a verb (**Verb Function Names**):

```ts
import type { ConstructBase } from '@art-md/primitives';

export function readConstructText(construct: ConstructBase): string {
  if ('value' in construct && typeof construct.value === 'string') {
    return construct.value;
  }
  if ('children' in construct && Array.isArray(construct.children)) {
    return construct.children.map(child => readConstructText(child as ConstructBase)).join('');
  }
  return '';
}
```

- Import both helpers in `createArtCodec.ts` with flat private paths (`./private/createFactoryIndex.js`, `./private/readConstructText.js`) — never a deep private path, and no barrel file for `private/`. Then add the three members to the returned object, next to `parse` and `serialize`:

```ts
getConstructFactory(name: string): ConstructFactoryFunction | undefined {
	return getFactoryIndex().get(name);
},
create<C extends ConstructBase = ConstructBase>(name: string, ...args: readonly unknown[]): C {
	const factory = getFactoryIndex().get(name);
	if (factory === undefined) {
		throw new TypeError(`Unknown construct name: ${name}`);
	}
	return factory(...args) as C;
},
toText(construct: ConstructBase): string {
	return readConstructText(construct);
},
```

- Neither helper is exported from `$PROJECT/libs/codec/src/index.ts`: a private directory's contents are not the module's API (**No External Private Imports**, **No Deep Private Directory Imports**).

Behaviour this must hold:

- `Document` is absent from the index, so `create('Document', ...)` throws the identical `TypeError` as an unknown name — there is no `Document`-specific branch anywhere.
- The index is rebuilt only on first access of a codec instance; each instance owns its index.
- `toText` reads `value` first, otherwise joins the recursive read of every child, otherwise returns an empty string.

If `eslint` flags the narrowing (unnecessary condition, unsafe argument), adjust the guards with explicit casts rather than widening the parameter type. `npm run lint` from `$PROJECT/` must pass.

Expected outcome: `npm run test:ci` from both `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/` passes, and the codec compiles against the extended interface.

### Step `4 / 5` — Cover the new API with tests

Extend `$PROJECT/libs/codec/src/createArtCodec.test.ts`, following the `describe`/`it` naming already used there and the Unit Test conventions.

Apply **Conventions: Unit Tests** explicitly: test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps (**Test Description Prefixes**); separate setup, invocation, and assertion blocks with an empty line (**Block Spacing**); if you extract a fixture factory it is named `make{Construct}Fixture` and must only build plain data (**Fixture Factory Naming**); any shared helper must follow **Helper Grouping** — grouped by domain directory, never left at the helpers root (the convention's `./src/structure.md` gives the location). Inline literals as call arguments are allowed in test code (**No Multi-Line Nested Declarations (Relaxed)**).

Cover at least this behaviour — derive the concrete rows yourself:

- Default registry: `getConstructFactory` resolves an ordinary construct name and returns `undefined` for `Document` and for an unknown name.
- `create` with a default construct, asserting the returned `construct` discriminator and the data you passed (a block carrying `value`/`children`, an inline field carrying `name`).
- `create('Document', ...)` throws the same error message shape as an unknown name — one path, no special case.
- A configured `factories` array replaces the default: a factory registered under a name from another package is creatable, and the default construct names are no longer resolved.
- `toText` over: a construct with `value`, nested children joining in order, and a construct with neither (empty string).
- Two lookups of the same name return the same factory reference (index stability within an instance).

No test may import a `create*` function from `@art-md/constructs`, no test may import from `src/private/` (cover `toText` through the codec instance), and nothing under `$PROJECT/libs/constructs/` may change.

Verify from `$PROJECT/libs/codec/` and `$PROJECT/libs/primitives/`:

```bash
npm run test:ci
```

Then, from `$PROJECT/`:

```bash
npm run ci
```

### Step `5 / 5` — Commit `define-construct-api`

---

#### Commit: `define-construct-api`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
build(codec): Expose construct creation and toText on ArtCodec
```

Stage the changed files under `$PROJECT/libs/primitives/src/` and `$PROJECT/libs/codec/src/`. Format with the project's own command before staging:

```bash
cd $PROJECT && npm run lint:fix
```

The pre-commit hook runs `npm run clean` and `npm run ci`; both must pass for the commit to be created.

## Final Verification

**Instructions:**

- Verify that the commit has been created and has NOT been pushed, per the `NOPUSH` policy.
- Verify that `ArtCodec` in `$PROJECT/libs/primitives/src/codec/types.ts` declares `getConstructFactory`, `create`, and `toText`, and that both new types are re-exported from the codec barrel so `@art-md/codec` can import them.
- Verify that `createArtCodec` builds its index lazily from `config.factories ?? defaultConstructFactories` and that `Document` is discarded while building it — no `Document` branch exists in any member.
- Verify that `readConstructText` and `createFactoryIndex` live in `$PROJECT/libs/codec/src/private/`, are imported with flat private paths, and are NOT exported from `$PROJECT/libs/codec/src/index.ts`.
- Verify that `create('Document', ...)` and an unknown name produce the same error.
- Verify that nothing under `$PROJECT/libs/constructs/`, `$PROJECT/libs/parser/`, or `$PROJECT/libs/serializer/` was modified.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
