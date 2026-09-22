# Instructions: `add-operation-contexts`

**Plan:** `implement-primitives-contracts`

**Iteration Id:** `add-operation-contexts`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-primitives-contracts/instructions/add-operation-contexts__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-operation-contexts`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-operation-contexts`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Add the parser and serializer operation contexts to `@art-md/primitives` so that parse and serialise operations can carry a source `uri`, and export them from the package index. Commit `build(codec): add operation contexts to primitives`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Contracts` → `### ParseContext (in @art-md/primitives under parser/context/)` and `### SerializeContext (in @art-md/primitives under serializer/context/)`.
- Primitives layout (file locations): `$PROJECT/architecture/codec.md` — read `## Layout`.
- Guide: `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
- ::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.
- Unit test conventions: `$PROJECT/conventions/unit-tests/index.md` — Conventions for writing unit tests. Relevant for the test-coverage step.
- Commit conventions: `$WORKSPACE/knowledge/conventions/writing-commit-message.art` — Defines commit message conventions. Relevant for Writing Commit Message.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

### Setting Up

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

Run from the repository root (monorepo) in `$PROJECT`:

```bash
npm ci # to install dependencies.
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Changes

This iteration adds two self-contained operation-context modules to the primitives package, exports them, and covers them with unit tests.

- Step 1 / 5 — Add parser operation context (types + factory)
- Step 2 / 5 — Add serializer operation context (types + factory)
- Step 3 / 5 — Wire package exports
- Step 4 / 5 — Add unit tests
- Step 5 / 5 — Commit `add-operation-contexts`

## Steps

### Step `1 / 5` — Add parser operation context (types + factory)

**Goal:** Declare `ParseContext`/`ParserContextData` and their factory under `$PROJECT/libs/primitives/src/parser/context/`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Edit `$PROJECT/libs/primitives/src/parser/context/types.ts`. Append (do not remove the existing `ParserVisitContext`, `ParserSource`, `OnBeforeConstruct`):

```ts
export type ParserContextData = {
  uri: string;
};

export type ParseContext = {
  uri: string;
};
```

2. Create `$PROJECT/libs/primitives/src/parser/context/createParseContext.ts`:

```ts
import type { ParseContext, ParserContextData } from './types';

export function createParseContext(data: ParserContextData): ParseContext {
  return { uri: data.uri };
}
```

3. Edit `$PROJECT/libs/primitives/src/parser/context/index.ts` and add the export:

```ts
export { createParseContext } from './createParseContext';

export type { ParseContext, ParserContextData } from './types';
```

**Expected:** `ParseContext`, `ParserContextData`, and `createParseContext` are exported from the parser context barrel.

### Step `2 / 5` — Add serializer operation context (types + factory)

**Goal:** Declare `SerializeContext`/`SerializerContextData` and their factory under `$PROJECT/libs/primitives/src/serializer/context/`. The `serializer/` module does not exist yet.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create the directory `$PROJECT/libs/primitives/src/serializer/context/`.

2. Create `$PROJECT/libs/primitives/src/serializer/context/types.ts`:

```ts
export type SerializerContextData = {
  uri: string;
};

export type SerializeContext = {
  uri: string;
};
```

3. Create `$PROJECT/libs/primitives/src/serializer/context/createSerializeContext.ts`:

```ts
import type { SerializeContext, SerializerContextData } from './types';

export function createSerializeContext(data: SerializerContextData): SerializeContext {
  return { uri: data.uri };
}
```

4. Create `$PROJECT/libs/primitives/src/serializer/context/index.ts`:

```ts
export { createSerializeContext } from './createSerializeContext';

export type { SerializeContext, SerializerContextData } from './types';
```

**Expected:** `SerializeContext`, `SerializerContextData`, and `createSerializeContext` are exported from the serializer context barrel.

### Step `3 / 5` — Wire package exports

**Goal:** Export the new modules from the primitives package index.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Edit `$PROJECT/libs/primitives/src/index.ts`. It currently re-exports `./constructs`, `./document`, `./parser`. Add the serializer barrel:

```ts
export * from './constructs';
export * from './document';
export * from './parser';
export * from './serializer';
```

2. Verify `$PROJECT/libs/primitives/src/parser/index.ts` re-exports `./context` (add `export * from './context';` if it does not already). This makes `ParseContext`/`createParseContext` reachable from `@art-md/primitives`.

**Expected:** `ParseContext`, `createParseContext`, `SerializeContext`, `createSerializeContext` are all importable from `@art-md/primitives`.

### Step `4 / 5` — Add unit tests

**Goal:** Cover the new context factories with unit tests that follow the unit-test conventions.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Read the unit-test conventions: `$PROJECT/conventions/unit-tests/index.md`. Key rules to apply:
   - Context mocks use `{contextName}Mock`; function mocks use `{functionName}Mock` (no `make` prefix).
   - Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
   - Separate setup, invocation, and assertion blocks with empty lines.
   - Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

2. Create `$PROJECT/libs/primitives/src/parser/context/createParseContext.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { createParseContext } from './createParseContext';

describe('createParseContext', () => {
  it('GIVEN uri data, creates a parse context carrying the uri', () => {
    const data = { uri: 'file:///a.md' };

    const ctx = createParseContext(data);

    expect(ctx.uri).toBe('file:///a.md');
  });
});
```

3. Create `$PROJECT/libs/primitives/src/serializer/context/createSerializeContext.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { createSerializeContext } from './createSerializeContext';

describe('createSerializeContext', () => {
  it('GIVEN uri data, creates a serialize context carrying the uri', () => {
    const data = { uri: 'file:///a.md' };

    const ctx = createSerializeContext(data);

    expect(ctx.uri).toBe('file:///a.md');
  });
});
```

4. Review the unit tests you added or modified and confirm they follow the conventions in `$PROJECT/conventions/unit-tests/index.md` (naming, `WHEN`/`FOR`/`GIVEN` prefixes, block spacing, helper headers).

**Expected:** The new context factories are covered by unit tests that follow the unit-test conventions.

### Step `5 / 5` — Commit `add-operation-contexts`

---

#### Commit: `add-operation-contexts`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(codec): add operation contexts to primitives
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `ParseContext`, `ParserContextData`, and `createParseContext` exist under `libs/primitives/src/parser/context/`.
- Verify `SerializeContext`, `SerializerContextData`, and `createSerializeContext` exist under `libs/primitives/src/serializer/context/`.
- Verify all new symbols are exported from the `@art-md/primitives` package index.
- Verify unit tests were added for `createParseContext` and `createSerializeContext` and that they follow the unit-test conventions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
