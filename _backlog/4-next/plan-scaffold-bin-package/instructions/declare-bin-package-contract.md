# Instructions: `declare-bin-package-contract`

**Plan:** `scaffold-bin-package`

**Iteration Id:** `declare-bin-package-contract`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-scaffold-bin-package/instructions/declare-bin-package-contract__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `declare-bin-package-contract`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                 | Purpose                                                     |
| ------------ | ----------------------------- | ----------------------------------------------------------- |
| `$WORKSPACE` | Current working directory     | Workspace root directory.                                   |
| `$PROJECT`   | `checkouts/art-md-planning`   | Planning checkout for Art MD.                               |
| `$BUILD`     | `checkouts/art-md-building`   | Building checkout for Art MD (implementation).              |
| `$ART_WORK`  | `checkouts/art-work-building` | Art Work checkout (reference CLI implementation to follow). |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `declare-bin-package-contract`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make the `@art-md/bin` package installable, buildable, and lintable with the three CLI entry points declared in its manifest.

## Mandatory Reading

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$ART_WORK/cli/work/package.json` (Reference) — Art Work CLI manifest: the `bin` export shape and the `esbuild-cli` build wiring to mirror. Relevant for Implementing.
::READ `$BUILD/node_modules/@noodlestan/esbuild/src/config/esm.mjs` (Reference) — Build config: globs every `src/**/*.ts`, including test files, into a separate bundle under `dist/esm/`. Determines where the three entry points must live. Note that it configures no shebang banner; hashbang preservation is esbuild's own entry-point behaviour. Relevant for Implementing.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/knowledge/conventions/writing-commit-message.art`)

Commit message pattern: `{Type}({Scope}): {Description}.` max 120 chars, optionally followed by up 3 bullet points, max 100 chars each.

Allowed values for commit Type, Scope, and valid Type–Scope associations are defined in `$WORKSPACE/knowledge/conventions/writing-commit-message.art`, along with examples, and rules.

RULE: Do not invent commit types or scopes or assume a combination is valid. Always read the "Writing Commit Message" guide first.

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

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

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

**Purpose:** Confirms that a step is correct before continuing. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-step.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

When making changes to the CLI package, execute from `$BUILD/cli/bin/`:

```bash
npm run test # runs vitest against the CLI unit tests
```

---

## Changes

- Step 1 / 9 — Add runtime dependencies to `$BUILD/cli/bin/package.json` and update the lockfile
- Step 2 / 9 — Complete the manifest contract: `bin` block, `publishConfig`, and `exports`
- Step 3 / 9 — Create `.eslintrc.cjs`
- Step 4 / 9 — Create three shebang stub entry points under `src/bin/`
- Step 5 / 9 — Replace the placeholder `src/index.ts` with a type-only export surface
- Step 6 / 9 — Extend the `vitest.config.ts` coverage `exclude` to cover `src/bin/*`
- Step 7 / 9 — Add `src/bin/binManifest.test.ts`
- Step 8 / 9 — Update `_records/package.art`
- Step 9 / 9 — Commit `declare-bin-package-contract`

## Steps

### Step `1 / 9` — Add runtime dependencies to `$BUILD/cli/bin/package.json` and update the lockfile

Add a `dependencies` field to `$BUILD/cli/bin/package.json`:

```json
"dependencies": {
  "@art-md/codec": "*",
  "@art-md/primitives": "*",
  "commander": "^12.0.0"
}
```

RULE: Pin the two `@art-md/*` workspace packages as `"*"`. Sibling packages in `libs/` declare intra-workspace dependencies this way (`libs/codec` pins `"@art-md/primitives": "*"`); do not invent a semver range for them.

`commander` is a real external dependency and is not installed in this checkout. After editing the manifest, run from the repository root:

```bash
npm install
```

Expected outcome: the manifest lists the three runtime dependencies and `package-lock.json` records them, so that `npm ci` succeeds.

RULE: Commit the updated `package-lock.json` in this step's commit. `npm ci` fails on a lockfile-manifest mismatch, so leaving the lockfile stale breaks every later verification command.

### Step `2 / 9` — Complete the manifest contract

In `$BUILD/cli/bin/package.json`:

- Add the `bin` block, mapping each command to the bundle `esbuild-cli` emits for its entry point source:

```json
"bin": {
  "art-codec": "./dist/esm/bin/codec.mjs",
  "art-parse": "./dist/esm/bin/parse.mjs",
  "art-serialize": "./dist/esm/bin/serialize.mjs"
}
```

- Add `"publishConfig": { "access": "public" }`. The package is `private: false` and scoped, so publishing fails without it. `@art-md/codec` carries the same field.
- Remove the `types` condition from `exports["."]`. It points at `./dist/esm/index.d.ts`, which `esbuild-cli` never emits; the file currently in `dist` is stale output from an earlier `build:types:esm` run. Leave the `import` and `require` conditions alone.
- Leave `files` as `["dist", "LICENSE-MIT", "README.md"]` — the built bins are published through it.

Expected outcome: the manifest declares the three CLI entry points against the build output, and no export condition points at a build artefact that does not exist.

### Step `3 / 9` — Create `.eslintrc.cjs`

Create `$BUILD/cli/bin/.eslintrc.cjs` re-exporting the repository root ESLint config, matching the sibling `libs/*/.eslintrc.cjs` pattern.

Example content, mirroring `libs/codec/.eslintrc.cjs`:

```js
const config = require('../../.eslintrc.cjs');

module.exports = {
  ...config,
};
```

### Step `4 / 9` — Create three shebang stub entry points under `src/bin/`

Create `$BUILD/cli/bin/src/bin/codec.ts`, `$BUILD/cli/bin/src/bin/parse.ts`, and `$BUILD/cli/bin/src/bin/serialize.ts`. Each file must:

- Start with `#!/usr/bin/env node`
- Print a not-yet-implemented notice naming its program and exit non-zero
- Export nothing, and self-execute when imported

Example for `parse.ts`:

```ts
#!/usr/bin/env node

const runParse = () => {
  console.error('art-parse: not yet implemented');
  process.exit(1);
};

runParse();
```

The other two stubs follow the same pattern with their respective program names.

RULE: Do not export a placeholder constant, type, or symbol from these files. They have no real runtime surface until Plan: Implement Bin Commands replaces them, and an invented export would exist only to satisfy a test and would have to be deleted there.

RULE: No test may import these modules. They call `process.exit`, which would terminate the vitest process.

### Step `5 / 9` — Replace the placeholder `src/index.ts` with a type-only export surface

Replace the `// placeholder` content of `$BUILD/cli/bin/src/index.ts` with a type-only re-export of the `@art-md/primitives` types this package consumes:

```ts
export type { ArtCodec, ParseResult, SerializeResult } from '@art-md/primitives';
```

Adjust the exported type names to those the package actually re-exports — read `$BUILD/libs/primitives/src/index.ts` to confirm.

Expected outcome: `src/index.ts` is valid, compiling TypeScript that publishes the package's real type surface, and adds no runtime value.

### Step `6 / 9` — Extend the `vitest.config.ts` coverage `exclude`

In `$BUILD/cli/bin/vitest.config.ts`, extend the coverage `exclude` from `['src/index.ts']` to also exclude the stub entry points:

```ts
exclude: ['src/index.ts', 'src/bin/*'],
```

Expected outcome: `npm run test:ci` does not measure the self-executing stubs, which this iteration's tests do not exercise.

RULE: This exclusion is temporary. Plan: Implement Bin Commands removes `src/bin/*` from the list once the entry points hold real, tested logic. Do not extend it to any other path.

### Step `7 / 9` — Add `src/bin/binManifest.test.ts`

Create `$BUILD/cli/bin/src/bin/binManifest.test.ts` asserting the `bin` contract declared in Step 2. For each of the three commands, assert that:

- The manifest declares the command, and its target is `./dist/esm/bin/<name>.mjs`
- The target path corresponds to an existing source file at `src/bin/<name>.ts`
- That source file begins with `#!/usr/bin/env node`
- The three declared names are exactly `art-codec`, `art-parse`, and `art-serialize`

RULE: Read the manifest and the source files as text; do not import the entry point modules. They self-execute and call `process.exit`, which would terminate the test process. This is the regression guard for the manifest mapping this iteration establishes.

### Step `8 / 9` — Update `_records/package.art`

Update `$BUILD/cli/bin/_records/package.art`:

- Replace the bundler/validator/compiler/watcher `Purpose` and `Description` with the parse/serialise CLI role
- Record the three entry points under `Files:`
- Add the `Dependencies:` entries for `commander`, `@art-md/codec`, and `@art-md/primitives`

### Step `9 / 9` — Commit `declare-bin-package-contract`

Commit the manifest, the lockfile, `.eslintrc.cjs`, the three entry point stubs, `src/index.ts`, `vitest.config.ts`, the manifest test, and the updated record.

#### Commit: `declare-bin-package-contract`

**Policy:** NOPUSH — Agent should commit but not push, then proceed to the next step.

**Message:**

```text
build(bin): declare package contract and entry point exports
```

---

## Final Verification

**Instructions:**

- Verify that the commit has been executed with the correct message and not pushed.
- Verify that `npm run ci` from the repository root passes (lint, build, test).
- Verify that `npm run test` from `$BUILD/cli/bin/` passes.
- Verify that the three entry point stubs build successfully and the `bin` exports resolve to `dist/esm/bin/*.mjs`.
- Verify that `npm ci` succeeds from the repository root, proving `package-lock.json` was updated and committed.
- Verify that `npm run test:ci` from `$BUILD/cli/bin/` passes its coverage thresholds with `src/bin/*` excluded.
- Report according to the "How to Report Back to the Delegator" instructions.
