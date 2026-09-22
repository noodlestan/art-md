# Instructions: `update-parser-entry-point`

**Plan:** `update-parser-serializer-entry-points`

**Iteration Id:** `update-parser-entry-point`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-update-parser-serializer-entry-points/instructions/update-parser-entry-point__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-parser-entry-point`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-parser-entry-point`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Change the parser `parse` entry point to accept raw markdown or a `ParseContext` with a `ParserConfig`, returning `ParseResult`, and update the parser pipeline test as a sync change so the commit stays green. Commit `build(parser): add context overload to parse entry point`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Entry Point Changes` (parser entry point) and `### createDocumentVisitContext()`.
- Primitives layout (file locations): `$PROJECT/architecture/codec.md` — read `## Layout`.
- Prerequisite: this iteration depends on `implement-primitives-contracts` having landed (`ParseContext`, `createParseContext`, and `ParseResult` already exist in `@art-md/primitives`).
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

This iteration changes the parser entry point to accept a `ParseContext` and return a `ParseResult`, and updates the parser pipeline test as a sync change.

- Step 1 / 7 — Rename and update `createDocumentVisitContext`
- Step 2 / 7 — Change `parse.ts` to the overloaded signature
- Step 3 / 7 — Update parser index exports
- Step 4 / 7 — Update `parseFixture` (sync change)
- Step 5 / 7 — Update and extend unit tests
- Step 6 / 7 — Update `api.md`
- Step 7 / 7 — Commit `update-parser-entry-point`

## Steps

### Step `1 / 7` — Rename and update `createDocumentVisitContext`

**Goal:** Rename `createDocumentParserContext` to `createDocumentVisitContext` and make it carry the `ParseContext`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Rename `$PROJECT/libs/parser/src/private/createDocumentParserContext.ts` to `createDocumentVisitContext.ts` and update its content:

```ts
import { createArtDocumentFromNode } from '@art-md/constructs';
import { createParserVisitContext, type ParseContext } from '@art-md/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';

import type { DocumentVisitContext } from './types';

export function createDocumentVisitContext(
  markdown: string,
  parseContext: ParseContext,
): DocumentVisitContext {
  const tree = fromMarkdown(markdown);
  const document = createArtDocumentFromNode(tree);

  const source = {
    tree,
    markdown,
  };

  return createParserVisitContext(document, source, parseContext) as DocumentVisitContext;
}
```

2. Update `$PROJECT/libs/parser/src/private/index.ts`:

```ts
export { createDocumentVisitContext } from './createDocumentVisitContext';

export type * from './types';
```

3. Rename `$PROJECT/libs/parser/src/private/createDocumentParserContext.test.ts` to `createDocumentVisitContext.test.ts` and update it:

```ts
import { createParseContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createDocumentVisitContext } from './createDocumentVisitContext';

describe('createDocumentVisitContext', () => {
  it('WHEN creating a document context', async () => {
    const markdown = '# Hello';
    const parseContext = createParseContext({ uri: 'file:///a.md' });

    const result = createDocumentVisitContext(markdown, parseContext);

    expect(result.construct.construct).toBe('Document');
    expect(result.source.markdown).toBe('# Hello');
    expect(result.source.tree.type).toBe('root');
    expect(result.parseContext).toBe(parseContext);
  });
});
```

**Expected:** `createDocumentVisitContext(markdown, parseContext)` builds the document visit context carrying the `ParseContext`.

### Step `2 / 7` — Change `parse.ts` to the overloaded signature

**Goal:** Change `parse` to accept raw markdown or a `ParseContext`, each with a `ParserConfig`, returning `ParseResult`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Replace `$PROJECT/libs/parser/src/parse/parse.ts`:

```ts
import { createParseContext, type ParseContext, type ParseResult } from '@art-md/primitives';

import { buildDocument } from '../buildDocument/buildDocument';
import type { ParserConfig } from '../config';
import { createDocumentVisitContext } from '../private';

export function parse(markdown: string, config: ParserConfig): ParseResult;
export function parse(context: ParseContext, markdown: string, config: ParserConfig): ParseResult;
export function parse(
  markdownOrContext: string | ParseContext,
  markdownOrConfig: string | ParserConfig,
  config?: ParserConfig,
): ParseResult {
  const hasContext = typeof markdownOrContext !== 'string';
  const markdown = hasContext ? (markdownOrConfig as string) : markdownOrContext;
  const resolvedConfig = hasContext ? (config as ParserConfig) : (markdownOrConfig as ParserConfig);
  const context = hasContext
    ? (markdownOrContext as ParseContext)
    : createParseContext({ uri: '' });

  const docContext = createDocumentVisitContext(markdown, context);
  const defaultConstruct = resolvedConfig.defaultConstruct();
  const constructParsers = resolvedConfig.constructs.map(create => create());

  const document = buildDocument(defaultConstruct, constructParsers, docContext);
  return { document, context };
}
```

**Expected:** `parse` returns `ParseResult`; the raw-markdown overload creates a default `ParseContext` internally.

### Step `3 / 7` — Update parser index exports

**Goal:** Export the parser config so the pipeline test can assemble it.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Replace `$PROJECT/libs/parser/src/index.ts`:

```ts
export { createDefaultConfig } from './config';
export { parse } from './parse/parse';

export type { ParserConfig } from './config';
```

**Expected:** `createDefaultConfig` and `ParserConfig` are importable from `@art-md/parser`.

### Step `4 / 7` — Update `parseFixture` (sync change)

**Goal:** Update the parser pipeline test to assemble the config and read the document from the `ParseResult`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Update `$PROJECT/cli/pipeline-tests/scripts/test/parser/parseFixture.ts`:

```ts
import * as fs from 'node:fs';

import { createDefaultConfig, parse } from '@art-md/parser';

import type { ParseResult } from './types';

export function parseFixture(filePath: string): ParseResult {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      durationMs: 0,
    };
  }

  const startTime = Date.now();
  try {
    const result = parse(content, createDefaultConfig());
    const durationMs = Date.now() - startTime;
    return { success: true, document: result.document, durationMs };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: (error as Error).message,
      durationMs,
    };
  }
}
```

**Expected:** `test-parser` still passes against the stable fixtures (sync change).

### Step `5 / 7` — Update and extend unit tests

**Goal:** Update the parser unit tests for the new signature and add coverage for the context overload.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Read the unit-test conventions: `$PROJECT/conventions/unit-tests/index.md`. Key rules to apply:
   - Context mocks use `{contextName}Mock`; function mocks use `{functionName}Mock` (no `make` prefix).
   - Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
   - Separate setup, invocation, and assertion blocks with empty lines.
   - Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

2. Replace `$PROJECT/libs/parser/src/parse/parse.test.ts`:

```ts
import { createParseContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createDefaultConfig } from '../config';
import { parse } from './parse';

describe('parse', () => {
  it('WHEN called with an empty string returns a Document', () => {
    const result = parse('', createDefaultConfig());

    expect(result.document.construct).toBe('Document');
    expect(result.document.children).toEqual([]);
  });

  it('WHEN parsing a heading into a SectionBlock', () => {
    const result = parse('# Hello', createDefaultConfig());

    expect(result.document.construct).toBe('Document');
    expect(result.document.children).toHaveLength(1);
    expect(result.document.children[0]).toMatchObject({
      construct: 'SectionBlock',
      name: 'Hello',
      depth: 1,
    });
  });

  it('WHEN parsing a paragraph into a NaturalBlock', () => {
    const result = parse('Hello world', createDefaultConfig());

    expect(result.document.construct).toBe('Document');
    expect(result.document.children).toHaveLength(1);
    expect(result.document.children[0]).toMatchObject({
      construct: 'NaturalBlock',
      value: 'Hello world',
    });
  });

  it('WHEN parsing a field inline value into a FieldInline', () => {
    const result = parse('**Greeting:** Hello world', createDefaultConfig());

    expect(result.document.construct).toBe('Document');
    expect(result.document.children).toHaveLength(1);
    expect(result.document.children[0]).toMatchObject({
      construct: 'FieldInline',
      name: 'Greeting',
    });
  });

  it('WHEN parsing a field block into a FieldBlock', () => {
    const result = parse('**Purpose:**', createDefaultConfig());

    expect(result.document.construct).toBe('Document');
    expect(result.document.children).toHaveLength(1);
    expect(result.document.children[0]).toMatchObject({
      construct: 'FieldBlock',
      name: 'Purpose',
    });
  });

  it('WHEN parsing a field block with tags', () => {
    const result = parse('**Purpose:** (#tag)', createDefaultConfig());

    expect(result.document.construct).toBe('Document');
    expect(result.document.children).toHaveLength(1);
    expect(result.document.children[0]).toMatchObject({
      construct: 'FieldBlock',
      name: 'Purpose',
    });
    expect((result.document.children[0] as unknown as { tags: unknown[] }).tags).toHaveLength(1);
  });

  it('GIVEN a parse context, returns it on the result', () => {
    const context = createParseContext({ uri: 'file:///a.md' });

    const result = parse(context, '# Hello', createDefaultConfig());

    expect(result.context).toBe(context);
    expect(result.document.construct).toBe('Document');
  });
});
```

3. Review the unit tests you added or modified and confirm they follow the conventions in `$PROJECT/conventions/unit-tests/index.md` (naming, `WHEN`/`FOR`/`GIVEN` prefixes, block spacing, helper headers).

**Expected:** The parser unit tests pass with the new signature and cover the context overload.

### Step `6 / 7` — Update `api.md`

**Goal:** Update the parser API documentation entry point description.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Update the `## Entry Point` section of `$PROJECT/libs/parser/architecture/api.md`:

```ts
function parse(markdown: string, config: ParserConfig): ParseResult;
function parse(context: ParseContext, markdown: string, config: ParserConfig): ParseResult;
```

Update the surrounding prose to state that `parse` accepts either raw markdown or a `ParseContext` (each with a `ParserConfig`) and returns a `ParseResult`; markdown and config are always mandatory, and the context is the first argument when provided.

**Expected:** `api.md` reflects the overloaded entry point.

### Step `7 / 7` — Commit `update-parser-entry-point`

---

#### Commit: `update-parser-entry-point`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(parser): add context overload to parse entry point
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `parse` in `libs/parser/src/parse/parse.ts` has the two overloads and returns `ParseResult`.
- Verify `createDocumentVisitContext(markdown, parseContext)` exists and `createDocumentParserContext` is gone.
- Verify `createDefaultConfig` and `ParserConfig` are exported from `@art-md/parser`.
- Verify `parseFixture.ts` assembles the config and reads `result.document`.
- Verify unit tests were updated/extended for the new signature and follow the unit-test conventions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
