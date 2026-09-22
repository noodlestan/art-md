# Instructions: `add-codec-contract`

**Plan:** `implement-primitives-contracts`

**Iteration Id:** `add-codec-contract`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-primitives-contracts/instructions/add-codec-contract__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-codec-contract`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-codec-contract`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Declare the `ArtCodec` contract and the parse/serialise result types in `@art-md/primitives`, and carry `parseContext` on `ParserVisitContext`, keeping the repo green via a transitional default. Commit `build(codec): add codec contract and results to primitives`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Contracts` → `### ArtCodec`, `### ParseResult / SerializeResult`, and `### ParserVisitContext (in @art-md/primitives under parser/context/)`.
- Primitives layout (file locations): `$PROJECT/architecture/codec.md` — read `## Layout`.
- Prerequisite: this iteration depends on `add-operation-contexts` having landed (`ParseContext` and `SerializeContext` already exist).
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

### Writing Commit Message

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

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

This iteration adds the result types and the codec contract, threads `parseContext` through the visit-context factory so the repo stays green, and covers the threading with unit tests.

- Step 1 / 7 — Add `ParseResult` to parser types
- Step 2 / 7 — Add `SerializeResult` to serializer types
- Step 3 / 7 — Carry `parseContext` on `ParserVisitContext`
- Step 4 / 7 — Add codec contract (`codec/types.ts`)
- Step 5 / 7 — Wire package exports
- Step 6 / 7 — Add unit tests
- Step 7 / 7 — Commit `add-codec-contract`

## Steps

### Step `1 / 7` — Add `ParseResult` to parser types

**Goal:** Declare `ParseResult` in `$PROJECT/libs/primitives/src/parser/types.ts` (the file already declares `MdastNode`, `Point`, `Position`).

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Append to `$PROJECT/libs/primitives/src/parser/types.ts`. Add the imports at the top:

```ts
import type { ArtDocument } from '../document';
import type { ParseContext } from './context';
```

2. Append the type:

```ts
export interface ParseResult {
  document: ArtDocument;
  context: ParseContext;
}
```

**Expected:** `ParseResult` is exported from `parser/types.ts` (and via `parser/index.ts`, which already does `export type * from './types'`).

### Step `2 / 7` — Add `SerializeResult` to serializer types

**Goal:** Declare `SerializeResult` in a new `$PROJECT/libs/primitives/src/serializer/types.ts`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/primitives/src/serializer/types.ts`:

```ts
import type { SerializeContext } from './context';

export interface SerializeResult {
  content: string;
  context: SerializeContext;
}
```

2. Edit `$PROJECT/libs/primitives/src/serializer/context/index.ts` sibling — create or edit `$PROJECT/libs/primitives/src/serializer/index.ts` to export both the context and the types:

```ts
export * from './context';

export type * from './types';
```

**Expected:** `SerializeResult` is exported from `serializer/index.ts`.

### Step `3 / 7` — Carry `parseContext` on `ParserVisitContext`

**Goal:** Add the required `parseContext` field to the `ParserVisitContext` type and thread it through the factory with a transitional default, so existing callers (the parser package) keep compiling. The entry-points plan will later pass the real value.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Edit `$PROJECT/libs/primitives/src/parser/context/types.ts`. Add `readonly parseContext: ParseContext;` to the `ParserVisitContext` type (after `source`):

```ts
export type ParserVisitContext = {
  readonly construct: ConstructBase;
  readonly source: ParserSource;
  readonly parseContext: ParseContext; // NEW
  captureChildConstruct(child: ConstructBase): void;
  onBeforeConstruct(construct: ConstructBase): ParserVisitContext;
  childContext(
    construct: ContainerConstructBase,
    onBeforeConstruct?: OnBeforeConstruct,
  ): ParserVisitContext;
  parent(): ParserVisitContext | undefined;
};
```

2. Edit `$PROJECT/libs/primitives/src/parser/context/private/createParserVisitContextBase.ts`. Add an optional `parseContext` param defaulting to a `ParseContext`, set it on the object literal, and pass it through `childContext` recursion:

```ts
import { createParseContext } from '../createParseContext';
import type { ConstructBase, ContainerConstructBase } from '../../../constructs';
import type { OnBeforeConstruct, ParseContext, ParserSource, ParserVisitContext } from '../types';

export function createParserVisitContextBase(
  source: ParserSource,
  construct: ContainerConstructBase,
  parentContext: ParserVisitContext | undefined,
  onBeforeConstruct?: OnBeforeConstruct,
  parseContext: ParseContext = createParseContext({ uri: '' }),
): ParserVisitContext {
  const context: ParserVisitContext = {
    construct,
    source,
    parseContext,
    captureChildConstruct(child: ConstructBase) {
      construct.children.push(child);
    },
    onBeforeConstruct(construct: ConstructBase) {
      return onBeforeConstruct ? onBeforeConstruct(construct, context) : context;
    },
    childContext(construct: ContainerConstructBase, onBeforeConstruct?: OnBeforeConstruct) {
      return createParserVisitContextBase(
        source,
        construct,
        context,
        onBeforeConstruct,
        parseContext,
      );
    },
    parent() {
      return parentContext;
    },
  };

  return context;
}
```

3. Edit `$PROJECT/libs/primitives/src/parser/context/createParserVisitContext.ts` to accept and forward an optional `parseContext`:

```ts
import type { ContainerConstructBase } from '../../constructs';

import { createParseContext } from './createParseContext';
import { createParserVisitContextBase } from './private/createParserVisitContextBase';
import type { ParseContext, ParserSource, ParserVisitContext } from './types';

export function createParserVisitContext(
  construct: ContainerConstructBase,
  source: ParserSource,
  parseContext: ParseContext = createParseContext({ uri: '' }),
): ParserVisitContext {
  return createParserVisitContextBase(source, construct, undefined, undefined, parseContext);
}
```

**Expected:** `ParserVisitContext` now requires `parseContext`, but `createParserVisitContext(document, source)` (called by `libs/parser/src/private/createDocumentParserContext.ts`) still compiles because the param defaults.

### Step `4 / 7` — Add codec contract (`codec/types.ts`)

**Goal:** Declare the `ArtCodec` contract under a new `$PROJECT/libs/primitives/src/codec/` module.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create the directory `$PROJECT/libs/primitives/src/codec/`.

2. Create `$PROJECT/libs/primitives/src/codec/types.ts`:

```ts
import type { ArtDocument } from '../document';
import type { ParseContext } from '../parser/context/types';
import type { ParseResult } from '../parser/types';
import type { SerializeContext } from '../serializer/context/types';
import type { SerializeResult } from '../serializer/types';

export interface ArtCodec {
  parse(markdown: string): ParseResult;
  parse(context: ParseContext, markdown: string): ParseResult;
  serialize(document: ArtDocument): SerializeResult;
  serialize(context: SerializeContext, document: ArtDocument): SerializeResult;
}
```

> Note: `ParseResult` lives in `../parser/types` while `ParseContext` lives in `../parser/context/types` — import each from its own file. Keep the contract shape exactly as in the design attachment (`### ArtCodec`).

3. Create `$PROJECT/libs/primitives/src/codec/index.ts`:

```ts
export type { ArtCodec } from './types';
```

**Expected:** `ArtCodec` compiles against `ParseResult`, `ParseContext`, `SerializeResult`, `SerializeContext`, and `ArtDocument` — all now present.

### Step `5 / 7` — Wire package exports

**Goal:** Export the codec module from the primitives package index.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Edit `$PROJECT/libs/primitives/src/index.ts` to add `./codec`:

```ts
export * from './codec';
export * from './constructs';
export * from './document';
export * from './parser';
export * from './serializer';
```

**Expected:** `ArtCodec`, `ParseResult`, and `SerializeResult` are all importable from `@art-md/primitives`.

### Step `6 / 7` — Add unit tests

**Goal:** Cover the `parseContext` threading on `createParserVisitContext` with unit tests that follow the unit-test conventions.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Read the unit-test conventions: `$PROJECT/conventions/unit-tests/index.md`. Key rules to apply:
   - Context mocks use `{contextName}Mock`; function mocks use `{functionName}Mock` (no `make` prefix).
   - Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
   - Separate setup, invocation, and assertion blocks with empty lines.
   - Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

2. Extend `$PROJECT/libs/primitives/src/parser/context/createParserVisitContext.test.ts` to verify `parseContext` is carried (default and provided):

```ts
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it } from 'vitest';

import { makeDocumentMock } from '../../test/helpers/document/makeDocumentMock';

import { createParseContext } from './createParseContext';
import { createParserVisitContext } from './createParserVisitContext';

describe('createParserVisitContext', () => {
  it('creates a context with the construct and source', () => {
    const construct = makeDocumentMock();
    const markdown = 'Hello world';
    const tree = fromMarkdown(markdown);

    const ctx = createParserVisitContext(construct, { tree, markdown });

    expect(ctx.construct).toBe(construct);
    expect(ctx.source.tree).toBe(tree);
    expect(ctx.source.markdown).toBe(markdown);
    expect(ctx.parent()).toBeUndefined();
  });

  it('GIVEN no parseContext, carries a default parse context', () => {
    const construct = makeDocumentMock();
    const markdown = 'Hello world';
    const tree = fromMarkdown(markdown);

    const ctx = createParserVisitContext(construct, { tree, markdown });

    expect(ctx.parseContext.uri).toBe('');
  });

  it('GIVEN a parseContext, carries it on the context', () => {
    const construct = makeDocumentMock();
    const markdown = 'Hello world';
    const tree = fromMarkdown(markdown);
    const parseContext = createParseContext({ uri: 'file:///a.md' });

    const ctx = createParserVisitContext(construct, { tree, markdown }, parseContext);

    expect(ctx.parseContext).toBe(parseContext);
  });
});
```

3. Review the unit tests you added or modified and confirm they follow the conventions in `$PROJECT/conventions/unit-tests/index.md` (naming, `WHEN`/`FOR`/`GIVEN` prefixes, block spacing, helper headers).

**Expected:** `createParserVisitContext` carries `parseContext` (default and provided) and the tests follow the unit-test conventions.

### Step `7 / 7` — Commit `add-codec-contract`

---

#### Commit: `add-codec-contract`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(codec): add codec contract and results to primitives
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `libs/primitives/src/codec/types.ts` declares `ArtCodec` with the four overloaded `parse`/`serialize` signatures.
- Verify `ParseResult` is in `libs/primitives/src/parser/types.ts` and `SerializeResult` in `libs/primitives/src/serializer/types.ts`.
- Verify `ParserVisitContext` carries `parseContext` and `createParserVisitContextBase`/`createParserVisitContext` provide a default so the parser package still compiles.
- Verify `ArtCodec`, `ParseResult`, and `SerializeResult` are exported from the `@art-md/primitives` package index.
- Verify unit tests were added/extended for `createParserVisitContext` `parseContext` threading and that they follow the unit-test conventions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
