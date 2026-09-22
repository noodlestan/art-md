# Instructions: `scaffold-codec-package`

**Plan:** `implement-codec-package`

**Iteration Id:** `scaffold-codec-package`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-codec-package/instructions/scaffold-codec-package__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `scaffold-codec-package`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `scaffold-codec-package`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Scaffold the `@art-md/codec` package in `libs/codec/` following the sibling libs pattern (mirroring `libs/parser/`), so the package builds and lints cleanly with no source code yet. Commit `build(codec): scaffold codec package`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Codec Package (@art-md/codec)`.
- Sibling package pattern (the scaffold source): `$PROJECT/libs/parser/` — read `package.json`, `tsconfig.json`, `tsconfig.vite.json`, `vite.config.ts`, `vitest.config.ts`, `.eslintrc.cjs`, `.npmignore`, `.prettierignore`, `LICENSE-MIT`, `_records/package.art`, `_records/npm-deployment.art`.
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

This iteration scaffolds the `@art-md/codec` package. No source code is written yet.

- Step 1 / 4 — Create the package manifest and build/test configs
- Step 2 / 4 — Create the package docs and records
- Step 3 / 4 — Verify the scaffold
- Step 4 / 4 — Commit `scaffold-codec-package`

## Steps

### Step `1 / 4` — Create the package manifest and build/test configs

**Goal:** Create `libs/codec/` with the package manifest and build/test configs mirroring `libs/parser/`.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/codec/package.json`:

```json
{
  "name": "@art-md/codec",
  "version": "0.0.1",
  "description": "Configured codec implementation for document-level parsing and serialisation.",
  "author": "Noodlestan Collective",
  "license": "MIT",
  "private": false,
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/noodlestan/art-md",
    "directory": "libs/codec/"
  },
  "type": "module",
  "sideEffects": false,
  "main": "./src/index.ts",
  "files": ["dist", "LICENSE-MIT", "README.md"],
  "scripts": {
    "dev": "vite build --watch",
    "lint": "prettier . -c && eslint . && tsc --noEmit",
    "lint:fix": "prettier . -c --write && eslint . --fix",
    "build": "vite build",
    "build:clean": "rm -rf dist",
    "test": "vitest run",
    "test:ci": "vitest run --coverage",
    "test:watch": "vitest",
    "ci": "npm run lint && npm run build && npm run test:ci"
  },
  "dependencies": {
    "@art-md/primitives": "*",
    "@art-md/constructs": "*",
    "@art-md/parser": "*",
    "@art-md/serializer": "*"
  },
  "devDependencies": {
    "vitest": "4.1.8"
  }
}
```

2. Copy the following config files from `$PROJECT/libs/parser/` to `$PROJECT/libs/codec/` unchanged: `tsconfig.json`, `tsconfig.vite.json`, `vite.config.ts`, `vitest.config.ts`, `.eslintrc.cjs`, `.npmignore`, `.prettierignore`, `LICENSE-MIT`.

**Expected:** `libs/codec/` contains the package manifest and build/test configs.

### Step `2 / 4` — Create the package docs and records

**Goal:** Create the package documentation and records.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. Create `$PROJECT/libs/codec/README.md`:

```markdown
# @art-md/codec

Configured codec implementation for document-level parsing and serialisation.

The `@art-md/codec` package owns the configured codec implementation and `createCodec()`. It stays small so alternative/configured codecs can exist independently. The `ArtCodec` contract lives in `@art-md/primitives`.
```

2. Create `$PROJECT/libs/codec/_guide.md` with the package layout and operations, mirroring the structure of `$PROJECT/libs/parser/_guide.md` (Setting Up, Verifying Completion, Verifying Step) adapted for the codec package.

3. Create `$PROJECT/libs/codec/CHANGELOG.md` with an initial entry:

```markdown
# Changelog

## 0.0.1

- Initial scaffold of the `@art-md/codec` package.
```

4. Create `$PROJECT/libs/codec/_records/package.art`:

```text
# Module

## Package: Codec

**Purpose:** Configured codec implementation for document-level parsing and serialisation.

**Description:** Owns the configured codec implementation and `createCodec()`.

**Owner:** Project: Art MD

**Author:** Noodlestan Collective

**Path:** `libs/codec/`

**Canonical Name:** `@art-md/codec`

**Published:** `true`

**Private:** `false`

**Deployment:** NPM Package Deployment: Codec

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

- Runtime:
  - `@art-md/primitives`
  - `@art-md/constructs`
  - `@art-md/parser`
  - `@art-md/serializer`

**License:** License: Noodlestan 2026 MIT
```

5. Create `$PROJECT/libs/codec/_records/npm-deployment.art`:

```text
# Module

## NPM Package Deployment: Codec

**Owner:** Package: Codec

**Status:** `DEPLOYED`

**Build:** Deployment Build: NPM Command

**Deploy:** Deployment Command: NPM Package CLI

**Canonical Name:** `@art-md/codec`

**Registry:** `https://registry.npmjs.org`

**Access:** `public`
```

**Expected:** `libs/codec/` contains the package docs and records.

### Step `3 / 4` — Verify the scaffold

**Goal:** Confirm the scaffolded package builds and lints cleanly.

**Execute:**

Follow the TypeScript conventions (see Mandatory Reading) for all code written in this step.

1. From `$PROJECT/libs/codec/`, run:

```bash
npm run lint # prettier, eslint, tsc --noEmit
```

2. From `$PROJECT/libs/codec/`, run:

```bash
npm run build # vite build
```

3. Confirm both pass with no errors. The `vitest.config.ts` uses `passWithNoTests: true`, so the empty package passes the test step.

**Expected:** The scaffolded package lints and builds cleanly.

### Step `4 / 4` — Commit `scaffold-codec-package`

---

#### Commit: `scaffold-codec-package`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(codec): scaffold codec package
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `libs/codec/` contains `package.json`, `tsconfig.json`, `tsconfig.vite.json`, `vite.config.ts`, `vitest.config.ts`, `.eslintrc.cjs`, `.npmignore`, `.prettierignore`, `LICENSE-MIT`, `README.md`, `_guide.md`, `CHANGELOG.md`, and `_records/` (`package.art`, `npm-deployment.art`).
- Verify the package name is `@art-md/codec` and the dependencies include `@art-md/primitives`, `@art-md/constructs`, `@art-md/parser`, `@art-md/serializer`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
