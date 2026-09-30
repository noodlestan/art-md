# Sub-Agent REPORT (#producer)

**Plan:** `scaffold-bin-package`

**Iteration Id:** `declare-bin-package-contract`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                               | Change                                                                                                                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Make `@art-md/bin` installable                     | Added the `commander` (`^12.0.0`), `@art-md/codec` (`*`), and `@art-md/primitives` (`*`) runtime dependencies and updated `package-lock.json` with `npm install` at the repository root. |
| Declare the three CLI entry points in the manifest | Added the `bin` block mapping `art-codec`, `art-parse`, and `art-serialize` to `./dist/esm/bin/{codec,parse,serialize}.mjs` — the bundles `esbuild-cli` emits.                           |
| Complete the rest of the manifest contract         | Added `publishConfig.access: "public"` and removed the dangling `exports["."].types` → `./dist/esm/index.d.ts`; `import` and `require` left untouched, `files` unchanged.                |
| Make the package lintable                          | Created `.eslintrc.cjs` re-exporting the repository root config, matching the sibling `libs/*/.eslintrc.cjs` pattern.                                                                    |
| Give the build real entry point modules            | Created three self-executing shebang stubs under `src/bin/` that print a not-yet-implemented notice and exit non-zero. They export nothing.                                              |
| Publish a real type surface                        | Replaced the `// placeholder` `src/index.ts` with a type-only re-export of `ArtCodec`, `ParseResult`, and `SerializeResult` from `@art-md/primitives`.                                   |
| Guard the `bin` → source → build-path mapping      | Added `src/bin/binManifest.test.ts` (4 tests) reading `package.json` and the sources as text; extended the coverage `exclude` to `['src/index.ts', 'src/bin/*']`.                        |
| Realign the package record                         | `_records/package.art` now carries the parse/serialise CLI purpose and description, the three entry points under `Files:`, and the runtime `Dependencies:`.                              |

#### Files changed

- `$BUILD/cli/bin/package.json` — Added `dependencies` (`@art-md/codec` `*`, `@art-md/primitives` `*`, `commander` `^12.0.0`), the `bin` block for the three commands, `publishConfig.access: "public"`, and removed `exports["."].types`.
- `$BUILD/package-lock.json` — Records the `cli/bin` `dependencies` and resolves `node_modules/commander@12.1.0`; the two `@art-md/*` entries resolve as workspace links.
- `$BUILD/cli/bin/.eslintrc.cjs` — New: spreads the repository root `@noodlestan/eslint-config` into a package-local config.
- `$BUILD/cli/bin/src/bin/codec.ts` — New stub: `#!/usr/bin/env node`, prints `art-codec: not yet implemented`, `process.exit(1)`.
- `$BUILD/cli/bin/src/bin/parse.ts` — New stub: same pattern for `art-parse`.
- `$BUILD/cli/bin/src/bin/serialize.ts` — New stub: same pattern for `art-serialize`.
- `$BUILD/cli/bin/src/bin/binManifest.test.ts` — New: asserts the three declared command names, that each target is `./dist/esm/bin/<name>.mjs`, that the matching `src/bin/<name>.ts` exists, and that it starts with the shebang. Reads files as text; imports no entry point.
- `$BUILD/cli/bin/src/index.ts` — Replaced the placeholder with `export type { ArtCodec, ParseResult, SerializeResult } from '@art-md/primitives';`.
- `$BUILD/cli/bin/vitest.config.ts` — Coverage `exclude` extended to `['src/index.ts', 'src/bin/*']`.
- `$BUILD/cli/bin/_records/package.art` — Purpose/description realigned to the CLI role, the three entry points recorded under `Files:`, and the three runtime dependencies added under `Dependencies:`.

### Commits

| Id                             | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------------------------------ | ------------------------------ | -------- | --------- | ----------- |
| `declare-bin-package-contract` | Art MD / `$BUILD` / `building` | `NOPUSH` | `efde40b` | `COMMITTED` |

**Message:** `build(bin): declare package contract and entry point exports`

**Push:** Not pushed, per the `NOPUSH` policy. No `git push` was run; the `building` branch has no configured upstream, and `efde40b` exists only in the local repository.

The lefthook `pre-commit` hook (`0-clean`, `1-extract`, `2-ci`) ran on the commit and passed without `--no-verify`.

### Validation

| Command                                         | Working directory          | Outcome                                                                                                                        |
| ----------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `npm ci`                                        | `$WORKSPACE`               | PASS — 15 packages audited.                                                                                                    |
| `npm ci`                                        | `$BUILD` (repository root) | PASS — 604 packages installed; proves `package-lock.json` matches the manifest.                                                |
| `npm install`                                   | `$BUILD` (repository root) | PASS — 1 package added (`commander@12.1.0`); lockfile updated and committed.                                                   |
| `npm run ci`                                    | `$BUILD` (repository root) | PASS — exit 0; 7/7 turbo tasks successful, `ci:root` prettier clean.                                                           |
| `npm run lint:fix`                              | `$BUILD/cli/bin`           | PASS — prettier reformatted `package.json`; `npm run lint` then clean on re-run.                                               |
| `npm run test`                                  | `$BUILD/cli/bin`           | PASS — exit 0; 1 test file, 4 tests passed.                                                                                    |
| `npm run test:ci`                               | `$BUILD/cli/bin`           | PASS — exit 0; 4 tests passed, coverage thresholds met with `src/bin/*` excluded (0/0 measured).                               |
| `npm run build`                                 | `$BUILD/cli/bin`           | PASS — exit 0; emitted `dist/esm/bin/{codec,parse,serialize}.mjs` plus maps and declarations.                                  |
| `node dist/esm/bin/{codec,parse,serialize}.mjs` | `$BUILD/cli/bin`           | PASS — each prints its own not-yet-implemented notice to stderr and exits 1; shebang preserved.                                |
| Manifest `bin` target existence check           | `$BUILD/cli/bin`           | PASS — all three targets resolve to files on disk.                                                                             |
| `git status`                                    | `$BUILD`                   | Clean apart from the delegator's pre-existing `plan.md` edit (`READY` → `WORKING`), not staged or committed by this iteration. |

## Blockers (if any)

None.

## Feedback

### For the planner

- **The `exports["."].types` rationale is inaccurate.** The instruction and the plan's Findings both state that `esbuild-cli` never emits `./dist/esm/index.d.ts`. The `@noodlestan/esbuild` wrapper does emit it: `esbuild-cli` runs `build:types:esm` (`tsc --project tsconfig.esm.json`) after the bundle step, and `dist/esm/index.d.ts` was regenerated by the build I ran. The removal was executed as instructed, but as it stands the published package declares no `types` condition and ships declarations nobody resolves. Worth deciding explicitly whether the bin wants a `types` condition (and a `build:types:*` wiring that always runs) or a genuine types-free surface.
- **The plan's "build globs test files too" finding is now live.** `src/bin/binManifest.test.ts` emits `dist/esm/bin/binManifest.test.mjs` into the published `files` list. The follow-up already tracks this; it just got closer.
- **`module` and `main` remain half-declared.** `main: dist/cjs/index.js` and `module: dist/esm/index.mjs` are still present alongside `exports`. The instruction scoped the change to the `exports` conditions, so I left them; flag if they should be dropped in the same follow-up.

### For the technical writers

- No ambiguity or contradiction blocked execution. The instruction was self-contained and every referenced file resolved, including the seven linked TypeScript convention pages.
- One wording nit in Step 2: the instruction says the stale `dist` file is "output from an earlier `build:types:esm` run", which invites the reader to treat the `types` condition as vestigial. See the planner note above.
- The instruction's Path Variables table defines `$PROJECT` as the planning checkout while every step operates on `$BUILD`; reading the project conventions and setup from `$PROJECT` while working in `$BUILD` is easy to misread. Consider a one-line note that `$PROJECT` supplies knowledge and `$BUILD` supplies the work.

### For the crew

- The package `ci` chain (`lint && build && test:ci`) is now green end to end, and the stubs are executable and correctly non-zero — a developer running `npx art-parse` from the checkout gets an honest "not yet implemented" rather than a missing module.
- `src/bin/*` is excluded from coverage, so `npm run test:ci` reports `0/0` for every metric. That passes the thresholds but gives no signal; the manifest test is the real guard here, and the exclusion is explicitly temporary.
- `eslint` resolves for the package now that `.eslintrc.cjs` exists, but it required a new file to be added at all — worth checking the same file exists in every package directory during the `audit-conventions` sweep.
