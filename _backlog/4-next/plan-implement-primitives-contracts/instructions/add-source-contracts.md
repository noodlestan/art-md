# Instructions: `add-source-contracts`

**Plan:** `implement-primitives-contracts`

**Iteration Id:** `add-source-contracts`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-primitives-contracts/instructions/add-source-contracts__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-source-contracts`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-source-contracts`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Add the content and document source contracts and the document-source factory to `@art-md/primitives`, and export them from the package index. Commit `build(codec): add source contracts to primitives`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Contracts` → `### ArtContentSource`, `### ArtDocumentSource`, and `### createArtDocumentSource()`.
- Primitives layout (file locations): `$PROJECT/architecture/codec.md` — read `## Layout`.
- Prerequisite: this iteration depends on `add-codec-contract` having landed (`ArtCodec` already exists).
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

This iteration adds the source contracts and the document-source factory to primitives, and covers the factory with unit tests.

- Step 1 / 5 — Add source contracts (`source/types.ts`)
- Step 2 / 5 — Add `createArtDocumentSource` factory
- Step 3 / 5 — Wire barrel and package exports
- Step 4 / 5 — Add unit tests
- Step 5 / 5 — Commit `add-source-contracts`

## Steps

### Step `1 / 5` — Add source contracts (`source/types.ts`)

**Goal:** Declare `ArtContentSource` and `ArtDocumentSource` under a new `$PROJECT/libs/primitives/src/source/` module.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create the directory `$PROJECT/libs/primitives/src/source/`.

2. Create `$PROJECT/libs/primitives/src/source/types.ts`:

```ts
import type { ArtDocument } from '../document';

export interface ArtContentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeContent: string | undefined;
  readContent(): Promise<string>;
  writeContent(content: string): Promise<void>;
}

export interface ArtDocumentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeDocument: ArtDocument | undefined;
  readDocument(): Promise<ArtDocument>;
  writeDocument(doc: ArtDocument): Promise<void>;
}
```

**Expected:** Both contracts are declared. `ArtContentSource` knows nothing about Art documents; `ArtDocumentSource` is backed by an `ArtDocument`.

### Step `2 / 5` — Add `createArtDocumentSource` factory

**Goal:** Implement the document-source factory that composes an `ArtCodec` and an `ArtContentSource`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/primitives/src/source/createArtDocumentSource.ts`:

```ts
import type { ArtCodec } from '../codec/types';
import type { ArtDocument } from '../document';
import type { ArtContentSource, ArtDocumentSource } from './types';

export function createArtDocumentSource(
  codec: ArtCodec,
  contentSource: ArtContentSource,
): ArtDocumentSource {
  let cached: ArtDocument | undefined;

  return {
    type: contentSource.type,
    uri: contentSource.uri,
    get maybeDocument() {
      return cached;
    },
    async readDocument() {
      if (cached) return cached;
      const content = await contentSource.readContent();
      const result = codec.parse(content);
      cached = result.document;
      return cached;
    },
    async writeDocument(doc) {
      const result = codec.serialize(doc);
      await contentSource.writeContent(result.content);
      cached = doc;
    },
  };
}
```

**Behavior contract (from the design attachment `### createArtDocumentSource()`):** lazily/idempotently reads content through `contentSource`, parses through `codec`, caches the document, and writes through `codec` + `contentSource`. Keep this behavior even if you restructure the implementation.

**Expected:** `createArtDocumentSource(codec, contentSource)` returns a working `ArtDocumentSource`.

### Step `3 / 5` — Wire barrel and package exports

**Goal:** Export the source module from the primitives package index.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/primitives/src/source/index.ts`:

```ts
export { createArtDocumentSource } from './createArtDocumentSource';

export type { ArtContentSource, ArtDocumentSource } from './types';
```

2. Edit `$PROJECT/libs/primitives/src/index.ts` to add `./source`:

```ts
export * from './codec';
export * from './constructs';
export * from './document';
export * from './parser';
export * from './serializer';
export * from './source';
```

**Expected:** `ArtContentSource`, `ArtDocumentSource`, and `createArtDocumentSource` are all importable from `@art-md/primitives`.

### Step `4 / 5` — Add unit tests

**Goal:** Cover `createArtDocumentSource` with unit tests that follow the unit-test conventions.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Read the unit-test conventions: `$PROJECT/conventions/unit-tests/index.md`. Key rules to apply:
   - Function mocks use `{functionName}Mock` (no `make` prefix); context mocks use `{contextName}Mock`.
   - Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
   - Separate setup, invocation, and assertion blocks with empty lines.
   - Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

2. Create `$PROJECT/libs/primitives/src/source/createArtDocumentSource.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';

import type { ArtCodec } from '../codec/types';
import { makeDocumentMock } from '../test/helpers/document/makeDocumentMock';
import type { ArtContentSource } from './types';

import { createArtDocumentSource } from './createArtDocumentSource';

describe('createArtDocumentSource', () => {
  it('GIVEN a codec and content source, reads and parses content lazily', async () => {
    const document = makeDocumentMock();
    const codecMock: ArtCodec = {
      parse: vi.fn().mockReturnValue({ document, context: { uri: 'file:///a.md' } }),
      serialize: vi.fn(),
    };
    const contentSourceMock: ArtContentSource = {
      type: 'file',
      uri: 'file:///a.md',
      maybeContent: undefined,
      readContent: vi.fn().mockResolvedValue('# Hello'),
      writeContent: vi.fn(),
    };

    const source = createArtDocumentSource(codecMock, contentSourceMock);

    const result = await source.readDocument();

    expect(contentSourceMock.readContent).toHaveBeenCalledTimes(1);
    expect(codecMock.parse).toHaveBeenCalledWith('# Hello');
    expect(result).toBe(document);
    expect(source.maybeDocument).toBe(document);
  });

  it('GIVEN a cached document, does not re-read content', async () => {
    const document = makeDocumentMock();
    const codecMock: ArtCodec = {
      parse: vi.fn().mockReturnValue({ document, context: { uri: 'file:///a.md' } }),
      serialize: vi.fn(),
    };
    const contentSourceMock: ArtContentSource = {
      type: 'file',
      uri: 'file:///a.md',
      maybeContent: undefined,
      readContent: vi.fn().mockResolvedValue('# Hello'),
      writeContent: vi.fn(),
    };

    const source = createArtDocumentSource(codecMock, contentSourceMock);

    await source.readDocument();
    await source.readDocument();

    expect(contentSourceMock.readContent).toHaveBeenCalledTimes(1);
  });

  it('GIVEN a document, serializes and writes content', async () => {
    const document = makeDocumentMock();
    const codecMock: ArtCodec = {
      parse: vi.fn(),
      serialize: vi.fn().mockReturnValue({ content: '# Hello', context: { uri: 'file:///a.md' } }),
    };
    const contentSourceMock: ArtContentSource = {
      type: 'file',
      uri: 'file:///a.md',
      maybeContent: undefined,
      readContent: vi.fn(),
      writeContent: vi.fn(),
    };

    const source = createArtDocumentSource(codecMock, contentSourceMock);

    await source.writeDocument(document);

    expect(codecMock.serialize).toHaveBeenCalledWith(document);
    expect(contentSourceMock.writeContent).toHaveBeenCalledWith('# Hello');
    expect(source.maybeDocument).toBe(document);
  });
});
```

3. Review the unit tests you added or modified and confirm they follow the conventions in `$PROJECT/conventions/unit-tests/index.md` (naming, `WHEN`/`FOR`/`GIVEN` prefixes, block spacing, helper headers).

> Note: `codecMock` is typed as `ArtCodec` while `parse`/`serialize` are overloaded methods. `vi.fn()` normally satisfies this, but if the strict type-check rejects the assignment, loosen the mock type instead of changing the contract, e.g. `const codecMock = { parse: vi.fn(), serialize: vi.fn() } as ArtCodec;`.

**Expected:** `createArtDocumentSource` is covered for lazy/idempotent read and write, and the tests follow the unit-test conventions.

### Step `5 / 5` — Commit `add-source-contracts`

---

#### Commit: `add-source-contracts`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(codec): add source contracts to primitives
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `libs/primitives/src/source/types.ts` declares `ArtContentSource` and `ArtDocumentSource`.
- Verify `libs/primitives/src/source/createArtDocumentSource.ts` implements `createArtDocumentSource(codec, contentSource)` with lazy/idempotent read and write via `codec` + `contentSource`.
- Verify all three source symbols are exported from the `@art-md/primitives` package index.
- Verify unit tests were added for `createArtDocumentSource` (lazy/idempotent read and write) and that they follow the unit-test conventions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
