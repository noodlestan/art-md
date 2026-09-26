# Instructions: `update-serializer-entry-point`

**Plan:** `update-parser-serializer-entry-points`

**Iteration Id:** `update-serializer-entry-point`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-update-parser-serializer-entry-points/instructions/update-serializer-entry-point__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-serializer-entry-point`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-serializer-entry-point`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Change the serializer `serialize` entry point to accept an `ArtDocument` or a `SerializeContext` with a `SerializerConfig`, returning `SerializeResult`, and update the serializer pipeline tests as a sync change so the commit stays green. Commit `build(serializer): add context overload to serialize entry point`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/1-done/milestone-art-codec/milestone__design.md` — read `## Entry Point Changes` (serializer entry point).
- Primitives layout (file locations): `$PROJECT/architecture/codec.md` — read `## Layout`.
- Prerequisite: this iteration depends on `implement-primitives-contracts` having landed (`SerializeContext`, `createSerializeContext`, and `SerializeResult` already exist in `@art-md/primitives`).
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

This iteration changes the serializer entry point to accept a `SerializeContext` and return a `SerializeResult`, and updates the serializer pipeline tests as a sync change.

- Step 1 / 7 — Rename `serializer.ts` to `serialize.ts` and change the signature
- Step 2 / 7 — Update serializer index exports
- Step 3 / 7 — Update `serializeFixture` (sync change)
- Step 4 / 7 — Update `diffFixtureResults` (sync change)
- Step 5 / 7 — Update and extend unit tests
- Step 6 / 7 — Update `api.md`
- Step 7 / 7 — Commit `update-serializer-entry-point`

## Steps

### Step `1 / 7` — Rename `serializer.ts` to `serialize.ts` and change the signature

**Goal:** Rename the serializer entry point file and change `serialize` to the overloaded signature returning `SerializeResult`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Rename `$PROJECT/libs/serializer/src/serializer/serializer.ts` to `serialize.ts` and replace its content:

```ts
import {
  createSerializeContext,
  type ArtDocument,
  type SerializeContext,
  type SerializeResult,
} from '@art-md/primitives';
import type { Root } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';

import { artAstToMdast } from '../artAstToMdast/artAstToMdast';
import type { SerializerConfig } from '../config/types';

export function serialize(document: ArtDocument, config: SerializerConfig): SerializeResult;
export function serialize(
  context: SerializeContext,
  document: ArtDocument,
  config: SerializerConfig,
): SerializeResult;
export function serialize(
  documentOrContext: ArtDocument | SerializeContext,
  documentOrConfig: ArtDocument | SerializerConfig,
  config?: SerializerConfig,
): SerializeResult {
  const hasContext = 'uri' in documentOrContext;
  const document = hasContext
    ? (documentOrConfig as ArtDocument)
    : (documentOrContext as ArtDocument);
  const resolvedConfig = hasContext
    ? (config as SerializerConfig)
    : (documentOrConfig as SerializerConfig);
  const context = hasContext
    ? (documentOrContext as SerializeContext)
    : createSerializeContext({ uri: '' });

  const root = artAstToMdast(resolvedConfig, document) as Root;
  const content = toMarkdown(root, { bullet: '-', emphasis: '_' });
  return { content, context };
}
```

2. Update `$PROJECT/libs/serializer/src/serializer/index.ts`:

```ts
export { serialize } from './serialize';
```

**Expected:** `serialize` returns `SerializeResult`; the direct-document overload creates a default `SerializeContext` internally.

### Step `2 / 7` — Update serializer index exports

**Goal:** Export the serializer config so the pipeline tests can assemble it.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Replace `$PROJECT/libs/serializer/src/index.ts`:

```ts
export { createDefaultSerializerConfig } from './config';
export { serialize } from './serializer';

export type { SerializerConfig } from './config';
```

**Expected:** `createDefaultSerializerConfig` and `SerializerConfig` are importable from `@art-md/serializer`.

### Step `3 / 7` — Update `serializeFixture` (sync change)

**Goal:** Update the serializer pipeline test to assemble the config and read the content from the `SerializeResult`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Update `$PROJECT/cli/pipeline-tests/scripts/test/serializer/serializeFixture.ts`:

```ts
import * as fs from 'node:fs';
import * as path from 'node:path';

import type { ArtDocument } from '@art-md/primitives';
import { createDefaultSerializerConfig, serialize } from '@art-md/serializer';

import type { SerializeResult } from './types';

export function serializeFixture(snapshotPath: string): SerializeResult {
  const baseName = path.basename(snapshotPath);
  const start = Date.now();

  let artDocument: ArtDocument;
  try {
    artDocument = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
  } catch (error) {
    return {
      success: false,
      error: `Cannot read snapshot ${baseName}: ${(error as Error).message}`,
      durationMs: 0,
    };
  }

  try {
    const result = serialize(artDocument, createDefaultSerializerConfig());
    const parsed = result.content;
    const durationMs = Date.now() - start;

    if (!parsed || parsed.length === 0) {
      return {
        success: false,
        error: `ROUNDTRIP FAIL ${baseName} — serializer returned empty output`,
        durationMs,
      };
    }
    return { durationMs, success: true };
  } catch (err) {
    const durationMs = Date.now() - start;
    return {
      success: false,
      error: `ROUNDTRIP FAIL ${baseName} — serializer threw: ${(err as Error).message}`,
      durationMs,
    };
  }
}
```

**Expected:** `test-serializer` still passes against the stable fixtures (sync change).

### Step `4 / 7` — Update `diffFixtureResults` (sync change)

**Goal:** Update the roundtrip diff helper to assemble the config and read the content from the `SerializeResult`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Update `$PROJECT/cli/pipeline-tests/scripts/test/serializer/diffFixtureResults.ts`:

```ts
import * as fs from 'node:fs';
import * as path from 'node:path';

import { createDefaultSerializerConfig, serialize } from '@art-md/serializer';

import { diffLines } from '../shared/diffLines';
import { readFileUtf8 } from '../shared/readFileUtf8';

export function diffFixtureResults(
  inputPath: string,
  snapshotPath: string,
  writeDebugResult: boolean,
): { hasDiff: boolean; diffCount: number } {
  const baseName = path.basename(inputPath);

  const artDocument = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
  const result = serialize(artDocument, createDefaultSerializerConfig());
  const parsed = result.content;
  const source = readFileUtf8(inputPath);
  const diffs = diffLines(source, parsed);

  if (diffs.length === 0) {
    console.info(`LOSSLESS ROUNDTRIP ${baseName}`);
    return { hasDiff: false, diffCount: 0 };
  }

  console.error(`ROUNDTRIP DIFF ${baseName}: ${diffs.length} line(s) differ`);
  for (const d of diffs) {
    console.error(
      `  L${d.line}: expected ${JSON.stringify(d.expected)} actual ${JSON.stringify(d.actual)}`,
    );
  }

  if (writeDebugResult) {
    const parsedPath = snapshotPath
      .replace('.art.json', '.parsed.md')
      .replace('.md.json', '.parsed.md');
    fs.writeFileSync(parsedPath, parsed, 'utf-8');
    console.info(`  wrote ${parsedPath}`);
  }

  return { hasDiff: true, diffCount: diffs.length };
}
```

**Expected:** The roundtrip diff helper uses the new `serialize` signature (sync change).

### Step `5 / 7` — Update and extend unit tests

**Goal:** Update the serializer unit tests for the new signature and add coverage for the context overload.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Read the unit-test conventions: `$PROJECT/conventions/unit-tests/index.md`. Key rules to apply:
   - Context mocks use `{contextName}Mock`; function mocks use `{functionName}Mock` (no `make` prefix).
   - Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
   - Separate setup, invocation, and assertion blocks with empty lines.
   - Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

2. Replace `$PROJECT/libs/serializer/src/serializer.test.ts`:

```ts
import type { FieldBlock, NaturalBlock, SectionBlock } from '@art-md/constructs';
import { createSerializeContext, type ArtDocument } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createDefaultSerializerConfig } from './config/createDefaultSerializerConfig';
import { serialize } from './serializer';

describe('serialize', () => {
  it('throws on unknown construct', () => {
    const doc = {
      construct: 'Document',
      children: [{ construct: 'UnknownConstruct' }],
    } as unknown as ArtDocument;
    expect(() => serialize(doc, createDefaultSerializerConfig())).toThrow(
      'Unknown construct: UnknownConstruct',
    );
  });

  it('serializes a Document with nested SectionBlocks', () => {
    const doc: ArtDocument = {
      construct: 'Document',
      children: [
        {
          construct: 'SectionBlock',
          name: 'Title',
          depth: 1,
          children: [],
        } as SectionBlock,
      ],
    };
    const result = serialize(doc, createDefaultSerializerConfig());
    expect(result.content).toContain('# Title');
  });

  it('serializes a Document with FieldBlocks', () => {
    const doc: ArtDocument = {
      construct: 'Document',
      children: [
        {
          construct: 'SectionBlock',
          name: 'Module',
          depth: 1,
          children: [
            {
              construct: 'FieldBlock',
              name: 'Purpose',
              children: [
                {
                  construct: 'NaturalBlock',
                  type: 'text',
                  value: ' Test purpose',
                  children: [],
                } as NaturalBlock,
              ],
            } as FieldBlock,
          ],
        } as SectionBlock,
      ],
    };
    const result = serialize(doc, createDefaultSerializerConfig());
    expect(result.content).toContain('**Purpose:**');
    expect(result.content).toContain('Test purpose');
  });

  it('serializes a Document with NaturalBlocks', () => {
    const doc: ArtDocument = {
      construct: 'Document',
      children: [
        {
          construct: 'NaturalBlock',
          type: 'text',
          value: ' Hello world',
          children: [],
        } as NaturalBlock,
      ],
    };
    const result = serialize(doc, createDefaultSerializerConfig());
    expect(result.content).toContain('Hello world');
  });

  it('serializes nested SectionBlocks without introducing extra blank lines', () => {
    const doc: ArtDocument = {
      construct: 'Document',
      children: [
        {
          construct: 'SectionBlock',
          name: 'Hello World',
          depth: 1,
          children: [
            {
              construct: 'NaturalBlock',
              type: 'text',
              value: '\n\n',
            } as NaturalBlock,
            {
              construct: 'SectionBlock',
              name: 'Details',
              depth: 2,
              children: [],
            } as SectionBlock,
          ],
        } as SectionBlock,
      ],
    };
    const result = serialize(doc, createDefaultSerializerConfig());

    expect(result.content).toBe('# Hello World\n\n## Details\n');
  });

  it('GIVEN a serialize context, returns it on the result', () => {
    const doc: ArtDocument = {
      construct: 'Document',
      children: [],
    };
    const context = createSerializeContext({ uri: 'file:///a.md' });

    const result = serialize(context, doc, createDefaultSerializerConfig());

    expect(result.context).toBe(context);
  });
});
```

3. Review the unit tests you added or modified and confirm they follow the conventions in `$PROJECT/conventions/unit-tests/index.md` (naming, `WHEN`/`FOR`/`GIVEN` prefixes, block spacing, helper headers).

**Expected:** The serializer unit tests pass with the new signature and cover the context overload.

### Step `6 / 7` — Update `api.md`

**Goal:** Update the serializer API documentation entry point description.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Update the `## Entry Point` section of `$PROJECT/libs/serializer/architecture/api.md`:

```ts
function serialize(document: ArtDocument, config: SerializerConfig): SerializeResult;
function serialize(
  context: SerializeContext,
  document: ArtDocument,
  config: SerializerConfig,
): SerializeResult;
```

Update the surrounding prose to state that `serialize` accepts either an `ArtDocument` or a `SerializeContext` (each with a `SerializerConfig`) and returns a `SerializeResult`; the document and config are always mandatory, and the context is the first argument when provided.

**Expected:** `api.md` reflects the overloaded entry point.

### Step `7 / 7` — Commit `update-serializer-entry-point`

---

#### Commit: `update-serializer-entry-point`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(serializer): add context overload to serialize entry point
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `serialize` in `libs/serializer/src/serializer/serialize.ts` has the two overloads and returns `SerializeResult`.
- Verify `serializer.ts` is gone (renamed to `serialize.ts`).
- Verify `createDefaultSerializerConfig` and `SerializerConfig` are exported from `@art-md/serializer`.
- Verify `serializeFixture.ts` and `diffFixtureResults.ts` assemble the config and read `result.content`.
- Verify unit tests were updated/extended for the new signature and follow the unit-test conventions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
