# Sub-Agent REPORT (#producer)

**Plan:** `implement-codec-package`

**Iteration Id:** `scaffold-codec-package`

**Outcome:** `BLOCKER`

## Evidence

### Changes

#### Files changed

All files below were created under `$PROJECT/libs/codec/` and are present in the working tree **uncommitted** (commit `scaffold-codec-package` was NOT created).

- `libs/codec/package.json` — package manifest `@art-md/codec` (v0.0.1) with scripts and deps on `@art-md/primitives`, `@art-md/constructs`, `@art-md/parser`, `@art-md/serializer`.
- `libs/codec/tsconfig.json`, `tsconfig.vite.json`, `vite.config.ts`, `vitest.config.ts`, `.eslintrc.cjs`, `.npmignore`, `.prettierignore`, `LICENSE-MIT` — copied unchanged from `libs/parser/` per Step 1.
- `libs/codec/README.md` — package readme (verbatim content from the instruction).
- `libs/codec/CHANGELOG.md` — `0.0.1` initial entry (required by the Final Verification checklist; no explicit step created it — see Blockers).
- `libs/codec/_guide.md` — package layout and Operating Instructions mirroring the parser guide.
- `libs/codec/_records/package.art` — Package: Codec record.
- `libs/codec/_records/npm-deployment.art` — NPM Package Deployment: Codec record.

Verification evidence:

- `npm run lint` (Step 3.1, run from `$PROJECT/libs/codec/`) — PASSES after formatting with `npm run lint:fix` (prettier, eslint, `tsc --noEmit` all clean).
- `npm run build` (Step 3.2, run from `$PROJECT/libs/codec/`) — FAILS.

## Blockers (if any)

The scaffold cannot satisfy its own verification, so the commit was not created.

**Failure:** `vite build` errors with `[UNRESOLVED_ENTRY] Cannot resolve entry module src/index.ts.` The `vite.config.ts` (copied verbatim from `libs/parser/`) declares the library entry as `resolve(__dirname, 'src/index.ts')`. The package ships no source by design: Step 1 creates manifest + configs only, Step 2 docs/records only, and the Goals state "no source code yet". The plan confirms `src/` (`src/types.ts`, `src/createArtCodec.ts`, `src/index.ts`, tests) is created by the **next** iteration `implement-codec`.

**Contradiction:** the instruction's Goals ("so the package builds and lints cleanly with no source code yet"), Step 3 ("Confirm both pass with no errors") and Expected outcome ("The scaffolded package lints and builds cleanly") require `npm run build` to pass, but the mirrored config requires a `src/index.ts` entry that this iteration must not create.

**Impact:** the pre-commit hook (`lefthook`) runs `npm run ci` from the repo root, which runs `turbo run ci` over the `libs/**` workspaces — the codec package's `ci` script (lint + build + test:ci) fails at `build`. The commit is blocked and `--no-verify` is forbidden, so no commit was made.

**Suggested resolutions (for the planner):**

- Add a minimal `src/index.ts` (empty entry) to the scaffold iteration so the lib builds; `implement-codec` then replaces it with the real exports. Verify `vitest run --coverage` behaviour with no tests — `passWithNoTests: true` plus `src/index.ts` in `coverage.exclude` may still be safe, but must be confirmed.
- Or split this iteration so `build`/`ci` verification is deferred to the `implement-codec` iteration, removing the build-pass expectation from the scaffold.

## Feedback

### For the planner

- The instruction is internally contradictory: it requires a passing `npm run build` while forbidding source files, yet the mirrored `vite.config.ts` mandates a `src/index.ts` entry. One of the two must change.
- The Final Verification checklist requires `CHANGELOG.md` in `libs/codec/`, but no step creates it (Step 2's numbered items skip item 4, jumping 3 → 5). I created a minimal conventional `CHANGELOG.md` to satisfy the checklist; please confirm this is the intended step.
- The README content supplies heading `# @art-mdc` which does not match the package name `@art-md/codec`. Rendered verbatim per the instruction; likely a typo to correct.

### For the technical writers

- The `vite.config.ts` mirror includes `rollupOptions.tsconfig: './tsconfig.vite.json'` and `external: ['solid-js']` inherited from parser; the `external: ['solid-js']` entry is irrelevant for the codec and worth dropping in a following cleanup.

### For the crew

- `vite build` fails hard on a missing entry module, which turned a "no source" scaffold into an unverifiable one. Consider documenting that a lib-package scaffold must ship at least the `src/index.ts` entry.
