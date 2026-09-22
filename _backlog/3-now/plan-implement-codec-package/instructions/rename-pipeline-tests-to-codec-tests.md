# Instructions: `rename-pipeline-tests-to-codec-tests`

**Plan:** `implement-codec-package`

**Iteration Id:** `rename-pipeline-tests-to-codec-tests`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-codec-package/instructions/rename-pipeline-tests-to-codec-tests__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `rename-pipeline-tests-to-codec-tests`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `rename-pipeline-tests-to-codec-tests`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Rename `cli/pipeline-tests` to `cli/codec-tests` and point the test scripts at the codec dependency, removing the temporary config assembly and the direct parser/serializer dependencies. Commit `build(codec): rename pipeline-tests to codec-tests`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Codec Package (@art-md/codec)`.
- Prerequisite: this iteration depends on `implement-codec` (the `@art-md/codec` package with `createArtCodec`) and `update-parser-serializer-entry-points` (the temporary config assembly in the test scripts).
- Guide: `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
- ::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.
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

When making changes to parser, serializer, or constructs packages, execute from `cli/codec-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Changes

This iteration renames `cli/pipeline-tests` to `cli/codec-tests` and points the test scripts at the codec.

- Step 1 / 6 — Rename the CLI directory and update `package.json`
- Step 2 / 6 — Add the shared codec helper and update the test scripts
- Step 3 / 6 — Update the records and docs
- Step 4 / 6 — Verify the codec-tests suite
- Step 5 / 6 — Update workspace references
- Step 6 / 6 — Commit `rename-pipeline-tests-to-codec-tests`

## Steps

### Step `1 / 6` — Rename the CLI directory and update `package.json`

**Goal:** Rename `cli/pipeline-tests` to `cli/codec-tests` and update the package metadata.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Rename the directory:

```bash
git mv cli/pipeline-tests cli/codec-tests
```

2. Replace `$PROJECT/cli/codec-tests/package.json`:

```json
{
  "name": "@art-md/codec-test-cli",
  "version": "0.0.1",
  "description": "Test scripts for the parser and serializer through the codec.",
  "author": "Noodlestan Collective",
  "license": "MIT",
  "private": false,
  "repository": {
    "type": "git",
    "url": "https://github.com/noodlestan/art-md",
    "directory": "cli/codec-tests"
  },
  "type": "module",
  "files": ["scripts", "LICENSE-MIT", "README.md"],
  "scripts": {
    "dev": "echo no dev configured",
    "lint": "prettier . -c && eslint . && tsc --noEmit",
    "lint:fix": "prettier . -c --write && eslint . --fix",
    "build": "echo no build configured",
    "build:clean": "rm -rf dist",
    "test-parser": "npx tsx scripts/test-parser.ts",
    "test-serializer": "npx tsx scripts/test-serializer.ts",
    "test": "npm run test-parser && npm run test-serializer",
    "ci": "npm run lint && npm run build && npm run test"
  },
  "dependencies": {
    "@art-md/codec": "*"
  },
  "devDependencies": {
    "tsx": "4.8.1"
  }
}
```

**Expected:** The CLI directory is renamed and the package is `@art-md/codec-test-cli` depending on `@art-md/codec`.

### Step `2 / 6` — Add the shared codec helper and update the test scripts

**Goal:** Point the test scripts at the codec and remove the temporary config assembly.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/cli/codec-tests/scripts/test/shared/makeCodec.ts`:

```ts
import { createArtCodec } from '@art-md/codec';

export function makeCodec() {
  return createArtCodec();
}
```

2. Replace `$PROJECT/cli/codec-tests/scripts/test/parser/parseFixture.ts`:

```ts
import * as fs from 'node:fs';

import { makeCodec } from '../shared/makeCodec';

import type { ParseResult } from './types';

const codec = makeCodec();

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
    const result = codec.parse(content);
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

3. Replace `$PROJECT/cli/codec-tests/scripts/test/serializer/serializeFixture.ts`:

```ts
import * as fs from 'node:fs';
import * as path from 'node:path';

import type { ArtDocument } from '@art-md/primitives';

import { makeCodec } from '../shared/makeCodec';
import type { SerializeResult } from './types';

const codec = makeCodec();

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
    const result = codec.serialize(artDocument);
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

4. Replace `$PROJECT/cli/codec-tests/scripts/test/serializer/diffFixtureResults.ts`:

```ts
import * as fs from 'node:fs';
import * as path from 'node:path';

import { makeCodec } from '../shared/makeCodec';
import { diffLines } from '../shared/diffLines';
import { readFileUtf8 } from '../shared/readFileUtf8';

const codec = makeCodec();

export function diffFixtureResults(
  inputPath: string,
  snapshotPath: string,
  writeDebugResult: boolean,
): { hasDiff: boolean; diffCount: number } {
  const baseName = path.basename(inputPath);

  const artDocument = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
  const result = codec.serialize(artDocument);
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

**Expected:** The test scripts use `codec.parse`/`codec.serialize` and no longer assemble the config.

### Step `3 / 6` — Update the records and docs

**Goal:** Update the CLI records and docs for the rename.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Replace `$PROJECT/cli/codec-tests/_records/package.art`:

```text
# Module

## Package: Codec Test CLI

**Purpose:** Test scripts for the parser and serializer through the codec.

**Description:** Provides test scripts to exercise the parser and serializer through the codec against a shared fixture suite.

**Owner:** Project: Art MD

**Author:** Noodlestan Collective

**Path:** `cli/codec-tests/`

**Canonical Name:** `@art-md/codec-test-cli`

**Published:** `true`

**Private:** `false`

**Deployment:** NPM Package Deployment: Codec Test CLI

**Files:**

- `dist`
- `LICENSE-MIT`
- `README.md`

**Language:** Typescript

**Engines:**

- Node: `>= 22`

**PackageManager:** `npm@10.2.3`

**PackageFile:** `package.json`

**Dependencies:**

**License:** License: Noodlestan 2026 MIT
```

2. Replace `$PROJECT/cli/codec-tests/_records/npm-deployment.art`:

```text
# Module

## NPM Package Deployment: Codec Test CLI

**Owner:** Package: Codec Test CLI

**Status:** `DEPLOYED`

**Build:** Deployment Build: NPM Command

**Deploy:** Deployment Command: NPM Package CLI

**Canonical Name:** `@art-md/codec-test-cli`

**Registry:** `https://registry.npmjs.org`

**Access:** `public`
```

3. Update `$PROJECT/cli/codec-tests/_guide.md`, `README.md`, and `CHANGELOG.md` to reflect the rename to `@art-md/codec-test-cli` and the codec-based test scripts.

**Expected:** The CLI records and docs reflect the rename.

### Step `4 / 6` — Verify the codec-tests suite

**Goal:** Confirm the renamed test suite passes against the stable fixtures.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. From `$PROJECT/cli/codec-tests/`, run:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

2. Confirm all fixtures pass. If any fixture fails, investigate and fix the test script before committing.

**Expected:** The codec-tests suite passes against the stable fixtures.

### Step `5 / 6` — Update workspace references

**Goal:** Update the workspace docs that reference the renamed CLI.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. In `$PROJECT/_records/project.art`, change `- Package: Pipeline Tests` to `- Package: Codec Tests`.
2. In `$PROJECT/architecture/components.md`, rename the `### Pipeline Tests (@art-md/pipeline-tests)` section to `### Codec Tests (@art-md/codec-test-cli)` and update the description to "Fixture-based test suite for the parser and serializer roundtrip through the codec."
3. In `$PROJECT/_guide.md`, update the `Pipeline Test CLI` row to `Codec Test CLI` with path `cli/codec-tests/_guide.md`, and update the `cli/pipeline-tests/` path in the Verifying Step section to `cli/codec-tests/`.

**Expected:** Workspace docs reference the renamed CLI.

### Step `6 / 6` — Commit `rename-pipeline-tests-to-codec-tests`

---

#### Commit: `rename-pipeline-tests-to-codec-tests`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(codec): rename pipeline-tests to codec-tests
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `cli/pipeline-tests` is gone and `cli/codec-tests` exists with package name `@art-md/codec-test-cli`.
- Verify the test scripts use `codec.parse`/`codec.serialize` and no longer assemble the config.
- Verify `package.json` depends on `@art-md/codec` (not `@art-md/parser`/`@art-md/serializer`/`@art-md/constructs`).
- Verify the records, docs, and workspace references reflect the rename.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
