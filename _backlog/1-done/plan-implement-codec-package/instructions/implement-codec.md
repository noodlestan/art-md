# Instructions: `implement-codec`

**Plan:** `implement-codec-package`

**Iteration Id:** `implement-codec`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-codec-package/instructions/implement-codec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `implement-codec`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-codec`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Implement the codec config types (`ArtCodecConfig`, `PartialArtCodecConfig`) and `createArtCodec()` in `@art-md/codec`, exposing the overloaded `parse`/`serialize` API against the `ArtCodec` contract, and register the package. Commit `feat(codec): implement createArtCodec`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/1-done/milestone-art-codec/milestone__design.md` — read `### ArtCodec (contract in @art-md/primitives under codec/)` and `## Codec Package (@art-md/codec)`.
- Primitives layout (file locations): `$PROJECT/architecture/codec.md` — read `## Layout`.
- Prerequisite: this iteration depends on `implement-primitives-contracts` (the `ArtCodec` contract, `ParseContext`, `SerializeContext`, `ParseResult`, `SerializeResult` in `@art-md/primitives`) and `update-parser-serializer-entry-points` (the overloaded `parse`/`serialize` entry points).
- Constructs exports (the registry factories): `$PROJECT/libs/constructs/src/parser/public.ts` and `$PROJECT/libs/constructs/src/serializer/public.ts` — read `CONSTRUCT_PARSERS`, `DEFAULT_CONSTRUCT_PARSER`, `CONSTRUCT_SERIALIZERS`.
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

This iteration implements the codec types and `createArtCodec()` and registers the package.

- Step 1 / 6 — Add `src/types.ts` (`ArtCodecConfig`, `PartialArtCodecConfig`)
- Step 2 / 6 — Add `src/createArtCodec.ts` (`createArtCodec`)
- Step 3 / 6 — Add `src/index.ts` (exports)
- Step 4 / 6 — Add unit tests
- Step 5 / 6 — Register the package
- Step 6 / 6 — Commit `implement-codec`

## Steps

### Step `1 / 6` — Add `src/types.ts` (`ArtCodecConfig`, `PartialArtCodecConfig`)

**Goal:** Define the codec config types, reusing the existing parser and serializer config types.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/codec/src/types.ts`:

```ts
import type { ParserConfig } from '@art-md/parser';
import type { SerializerConfig } from '@art-md/serializer';

export type ArtCodecConfig = {
  parserConfig: ParserConfig;
  serializerConfig: SerializerConfig;
};

export type PartialArtCodecConfig = {
  parserConfig?: Partial<ParserConfig>;
  serializerConfig?: Partial<SerializerConfig>;
};
```

**Expected:** `ArtCodecConfig` holds the parser and serializer configs directly, reusing the existing `ParserConfig` and `SerializerConfig` types; `PartialArtCodecConfig` makes both optional and partial so `createArtCodec` can fall back to defaults.

### Step `2 / 6` — Add `src/createArtCodec.ts` (`createArtCodec`)

**Goal:** Implement `createArtCodec(config?)` returning an `ArtCodec` that wraps the parser and serializer entry points, using the provided config values or the default constructs.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/codec/src/createArtCodec.ts`:

```ts
import {
  CONSTRUCT_PARSERS,
  CONSTRUCT_SERIALIZERS,
  DEFAULT_CONSTRUCT_PARSER,
} from '@art-md/constructs';
import { parse } from '@art-md/parser';
import type {
  ArtCodec,
  ArtDocument,
  ParseContext,
  ParseResult,
  SerializeContext,
  SerializeResult,
} from '@art-md/primitives';
import { serialize } from '@art-md/serializer';

import type { PartialArtCodecConfig } from './types';

export function createArtCodec(config: PartialArtCodecConfig = {}): ArtCodec {
  const parserConfig = {
    defaultConstruct: config.parserConfig?.defaultConstruct ?? DEFAULT_CONSTRUCT_PARSER,
    constructs: config.parserConfig?.constructs ?? CONSTRUCT_PARSERS,
  };
  const serializerConfig = {
    constructs: config.serializerConfig?.constructs ?? CONSTRUCT_SERIALIZERS,
  };

  return {
    parse(markdownOrContext: string | ParseContext, markdown?: string): ParseResult {
      if (typeof markdownOrContext === 'string') {
        return parse(markdownOrContext, parserConfig);
      }
      return parse(markdownOrContext, markdown as string, parserConfig);
    },
    serialize(
      documentOrContext: ArtDocument | SerializeContext,
      document?: ArtDocument,
    ): SerializeResult {
      if ('uri' in documentOrContext) {
        return serialize(
          documentOrContext as SerializeContext,
          document as ArtDocument,
          serializerConfig,
        );
      }
      return serialize(documentOrContext as ArtDocument, serializerConfig);
    },
  };
}
```

**Expected:** `createArtCodec` returns an `ArtCodec` whose `parse`/`serialize` accept either the raw input or a context. Each provided config value is used as-is (no array merging); missing values fall back to the default constructs (`DEFAULT_CONSTRUCT_PARSER`, `CONSTRUCT_PARSERS`, `CONSTRUCT_SERIALIZERS`).

### Step `3 / 6` — Add `src/index.ts` (exports)

**Goal:** Export the codec public API.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/codec/src/index.ts`:

```ts
export { createArtCodec } from './createArtCodec';

export type { ArtCodecConfig, PartialArtCodecConfig } from './types';
```

**Expected:** `createArtCodec`, `ArtCodecConfig`, and `PartialArtCodecConfig` are importable from `@art-md/codec`.

### Step `4 / 6` — Add unit tests

**Goal:** Add unit tests covering the overloaded `parse`/`serialize` entry points.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Read the unit-test conventions: `$PROJECT/conventions/unit-tests/index.md`. Key rules to apply:
   - Fixture factories use `make{Construct}Mock`; context mocks use `{contextName}Mock`.
   - Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.
   - Separate setup, invocation, and assertion blocks with empty lines.
   - Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

2. Create `$PROJECT/libs/codec/src/createArtCodec.test.ts`:

```ts
import { createParseContext, createSerializeContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createArtCodec } from './createArtCodec';

describe('createArtCodec', () => {
  it('WHEN parsing raw markdown returns a ParseResult', () => {
    const codec = createArtCodec();

    const result = codec.parse('# Hello');

    expect(result.document.construct).toBe('Document');
    expect(result.document.children).toHaveLength(1);
  });

  it('GIVEN a parse context, returns it on the result', () => {
    const codec = createArtCodec();
    const context = createParseContext({ uri: 'file:///a.md' });

    const result = codec.parse(context, '# Hello');

    expect(result.context).toBe(context);
  });

  it('WHEN serializing a document returns a SerializeResult', () => {
    const codec = createArtCodec();

    const result = codec.serialize({
      construct: 'Document',
      children: [{ construct: 'SectionBlock', name: 'Title', depth: 1, children: [] }],
    });

    expect(result.content).toContain('# Title');
  });

  it('GIVEN a serialize context, returns it on the result', () => {
    const codec = createArtCodec();
    const context = createSerializeContext({ uri: 'file:///a.md' });

    const result = codec.serialize(context, {
      construct: 'Document',
      children: [{ construct: 'SectionBlock', name: 'Title', depth: 1, children: [] }],
    });

    expect(result.context).toBe(context);
  });
});
```

3. Review the unit tests you added and confirm they follow the conventions in `$PROJECT/conventions/unit-tests/index.md` (naming, `WHEN`/`FOR`/`GIVEN` prefixes, block spacing, helper headers).

**Expected:** The codec unit tests pass and cover the overloaded entry points using the default codec config (`createArtCodec()` with no arguments).

### Step `5 / 6` — Register the package

**Goal:** Register `@art-md/codec` in the architecture components and project records.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Update the `### Codec (@art-md/codec)` section of `$PROJECT/architecture/components.md` to reflect the implemented package: change `**Status:** PLANNED` to `**Status:** IMPLEMENTED` and update the primary types line to `Primary types: ArtCodecConfig, PartialArtCodecConfig, createArtCodec(). Responsibility: parse and serialise ArtDocument using configured constructs.`
2. Add `- Package: Codec` to the `**Resources:**` list in `$PROJECT/_records/project.art` (after `- Package: Primitives`).

**Expected:** The codec package is registered in the architecture components and project records.

### Step `6 / 6` — Commit `implement-codec`

---

#### Commit: `implement-codec`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(codec): implement createArtCodec
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `libs/codec/src/types.ts` defines `ArtCodecConfig` (`parserConfig: ParserConfig`, `serializerConfig: SerializerConfig`) and `PartialArtCodecConfig` (optional partial parser/serializer configs).
- Verify `libs/codec/src/createArtCodec.ts` implements `createArtCodec(config?): ArtCodec` with the overloaded `parse`/`serialize`, using the provided values or the default constructs.
- Verify `libs/codec/src/index.ts` exports `createArtCodec`, `ArtCodecConfig`, and `PartialArtCodecConfig`.
- Verify unit tests were added and follow the unit-test conventions.
- Verify the package is registered in `architecture/components.md` and `_records/project.art`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
