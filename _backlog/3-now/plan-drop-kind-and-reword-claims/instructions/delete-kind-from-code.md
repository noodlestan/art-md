# Instructions: `delete-kind-from-code`

**Plan:** `drop-kind-and-reword-claims`

**Iteration Id:** `delete-kind-from-code`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-drop-kind-and-reword-claims/instructions/delete-kind-from-code__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `delete-kind-from-code`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable              | Resolved Path              | Purpose                                  |
| --------------------- | -------------------------- | ---------------------------------------- |
| `$WORKSPACE`          | Current working directory  | Workspace root; run `npm ci` here.       |
| `$PROJECT`            | Provided with prompt       | Where work execution is taking place.    |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs` | Library owning the `SectionBlock` model. |
| `$CODEC_TESTS`        | `$PROJECT/cli/codec-tests` | Round-trip fixture harness.              |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `delete-kind-from-code`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Delete `kind` from Art MD so a heading's text is never split: the section name becomes the whole heading text (`## Checkout: Art Work` names the section `Checkout: Art Work`). The serializer already emits `# ${name}` with no kind logic, so full-text names round-trip once the parser stops splitting. The regression guard is a `## Module: Greeting` heading sneaked into the existing fixture `010-section-block-simple.md` — no new fixture, no new test.

## Mandatory Reading

- Harness and fixture anatomy: `$PROJECT/knowledge/design/art-md-fixture-tests.md` — the snapshot workflow this iteration uses (`test-parser --write`, `test-serializer` diff).
- Conventions: TypeScript – `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write a message following: `{Type}({Scope}): {Description}.` max 120 chars, optionally followed by up 3 bullet points, max 100 chars each.

### Verifying Step

**Purpose:** Confirms a step is correct before continuing. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-step/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

From `$CODEC_TESTS`:

```bash
npm run test # test-parser (snapshot equality) + test-serializer (serialised diff)
```

Before this iteration a heading carrying a `Kind: Name`-shaped prefix loses the prefix on write (`## Module: Greeting` serialises as `## Greeting`). After this iteration the parser no longer splits headings, the fixture snapshot regenerates without `kind`, and both suites pass 43/43.

### Verifying Completion

**Purpose:** Confirms the work item completed satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, build and test
```

---

## Changes

Summary of changes: delete `kind` from the model, the factory, and the parser; update the tests and mocks that assert it; sneak the kind-shaped heading into fixture `010` and regenerate its snapshot.

- Step 1 / 6 — Delete `kind` from `SectionBlock`, `SectionBlockFactoryData`, and `createSectionBlock`
- Step 2 / 6 — Delete the kind-split in `createSectionBlockFromNode`
- Step 3 / 6 — Delete `KIND_PATTERN` and its test
- Step 4 / 6 — Update tests and helpers asserting `kind`
- Step 5 / 6 — Sneak `## Module: Greeting` into fixture `010` and regenerate its snapshot
- Step 6 / 6 — Commit `delete-kind-from-code`

## Steps

### Step `1 / 6` — Delete `kind` from `SectionBlock`, `SectionBlockFactoryData`, and `createSectionBlock`

Goal: the construct model carries no `kind` member.

1. In `$PACKAGE_CONSTRUCTS/src/factories/constructs/SectionBlock/types.ts` delete the line `kind?: string;` from the `SectionBlock` type.
2. In `$PACKAGE_CONSTRUCTS/src/factories/constructs/SectionBlock/factory/types.ts` delete the line `kind?: string;` from `SectionBlockFactoryData`.
3. In `$PACKAGE_CONSTRUCTS/src/factories/constructs/SectionBlock/factory/createSectionBlock.ts` delete the line `if (data.kind) section.kind = data.kind;`.

Expected outcome: `SectionBlock` is `{ construct, name, tags?, children, depth?, position }` — exactly the frozen shape agreed on the Art Records whiteboard (contract `AGREED` 2026-10-16; `position` is carried as today, untouched by this iteration).

### Step `2 / 6` — Delete the kind-split in `createSectionBlockFromNode`

Goal: the section name is the whole heading text, after tag extraction.

1. In `$PACKAGE_CONSTRUCTS/src/parser/constructs/SectionBlock/private/helpers/createSectionBlockFromNode.ts`:
   - Delete the import line `import { KIND_PATTERN } from '../constants.js';`.
   - Delete the line `const kindMatch = stripped.match(KIND_PATTERN);`.
   - In the `createSectionBlock({...})` call, replace `name: kindMatch?.[2]?.trim() ?? stripped,` with `name: stripped,` and delete the line `kind: kindMatch?.[1],`.

Expected outcome: for `# Module: Hello` the block is `{ name: 'Module: Hello', depth: 1 }` — no split, no `kind`. Tag extraction (`extractTags`), `depth`, `children: []`, and `section.position` are unchanged.

### Step `3 / 6` — Delete `KIND_PATTERN` and its test

Goal: the pattern concept is gone, not dormant.

1. Delete `$PACKAGE_CONSTRUCTS/src/parser/constructs/SectionBlock/private/constants.ts` — `KIND_PATTERN` is its only export and nothing else imports it (`private/index.ts` does not re-export it).
2. Delete `$PACKAGE_CONSTRUCTS/src/parser/constructs/SectionBlock/private/constants.test.ts` — it tests `KIND_PATTERN` only.

Verification: `grep -rn "KIND_PATTERN" $PACKAGE_CONSTRUCTS/src` returns nothing.

### Step `4 / 6` — Update tests and helpers asserting `kind`

Goal: the unit suite describes the new behaviour.

1. In `$PACKAGE_CONSTRUCTS/src/parser/constructs/SectionBlock/private/helpers/createSectionBlockFromNode.test.ts`, replace the case `'WHEN the heading declares a kind extracts it'` with a case `'WHEN the heading contains a colon keeps the whole text as name'`: markdown `# Module: Hello`, asserting `createSectionBlock` was called with `expect.objectContaining({ name: 'Module: Hello', depth: 1 })` — no `kind` in the expectation. The other two cases stay (plain heading, trailing tags).
2. In `$PACKAGE_CONSTRUCTS/src/factories/constructs/SectionBlock/factory/createSectionBlock.test.ts`, in the case `'WHEN provided includes optional properties'`, delete `kind: 'Module',` from the input data and delete the assertion `expect(result.kind).toBe('Module');`.
3. In `$PACKAGE_CONSTRUCTS/src/test/helpers/constructs/SectionBlock/makeSectionBlockFixture.ts`, delete the `kind?: string;` option and the line `...(options?.kind !== undefined ? { kind: options.kind } : {}),`.
4. Confirm `createSectionBlockFromNodeMock.ts` and `createSectionBlockMock.ts` need no change (they never reference `kind`).

Verification: from `$PACKAGE_CONSTRUCTS` run `npm run test` — all unit tests pass; `grep -rn "kind" $PACKAGE_CONSTRUCTS/src` returns nothing.

### Step `5 / 6` — Sneak `## Module: Greeting` into fixture `010` and regenerate its snapshot

Goal: the silent regression is pinned by an existing fixture; no new fixture file.

1. In `$PROJECT/libs/constructs/test/fixtures/010-section-block-simple.md` add the heading as a second section (blank line between), so the file reads:

   ```md
   # Hello World

   ## Module: Greeting
   ```

2. Regenerate the accepted snapshot (see Mandatory Reading for the flag):

   ```bash
   cd $CODEC_TESTS && npm run test-parser -- --fixture 010 --write
   ```

3. Review the diff of `010-section-block-simple.md.json`: the `Hello World` section now has one child `SectionBlock` with `"name": "Module: Greeting"`, `"depth": 2`, and **no** `kind` field anywhere in the snapshot.
4. Run the round-trip check:

   ```bash
   cd $CODEC_TESTS && npm run test
   ```

   Expect: `test-parser` 43/43 pass; `test-serializer` reports no diff — the `## Module: Greeting` heading is reproduced byte-for-byte (the heading previously serialised as `## Greeting`).

### Step `6 / 6` — Commit `delete-kind-from-code`

Execute the commit defined below, then continue to the Final Verification.

---

#### Commit: `delete-kind-from-code`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
fix(drop-kind-and-reword-claims): Delete `kind`; a section name is the whole heading text.

- Delete `kind?` from `SectionBlock`, factory data, and `createSectionBlock`.
- Stop splitting headings in `createSectionBlockFromNode`; delete `KIND_PATTERN`.
- Sneak `## Module: Greeting` into fixture `010`; regenerate its snapshot.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and not pushed, according to the commit's policy (`NOPUSH`).
- Verify `SectionBlock` has no `kind` member anywhere in `$PACKAGE_CONSTRUCTS/src` (type, factory, parser, tests, helpers).
- Verify `010-section-block-simple.md` contains `## Module: Greeting` and its snapshot carries `"name": "Module: Greeting"` with no `kind` field.
- Verify from `$CODEC_TESTS` that `npm run test` passes 43/43 and the serializer reports no diff for `010`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
