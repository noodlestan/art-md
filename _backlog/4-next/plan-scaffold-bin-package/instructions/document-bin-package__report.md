# Sub-Agent REPORT (#producer)

**Plan:** `scaffold-bin-package`

**Iteration Id:** `document-bin-package`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                                   | Change                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document the package layout                                            | `_guide.md` `## Package Layout` now expands `src/` to `index.ts`, `bin/` (one entry point per command: `codec.ts`, `parse.ts`, `serialize.ts`), `commands/`, `private/`, and `test/`, with the Directory Module Structure / File as Function rule that puts non-public functions in `private/`.                                         |
| Add records management instructions                                    | `_guide.md` keeps the co-located `_records/package.art` and `_records/npm-deployment.art` pointers and adds the trigger for updating the package record when role, entry points, dependencies, or published files change.                                                                                                               |
| Add operating instructions `npm run test` and `npm run ci`             | `_guide.md` gains `### Operating Instructions: Verifying Step` (`npm run test` from the package directory) and `### Operating Instructions: Verifying Completion` (`npm run ci` from the repository root), alongside the existing Setting Up.                                                                                           |
| Remove stale bundler/validator/compiler/watcher roles                  | `README.md`'s blockquote — "Static entry point to parser, validator, compiler, bundler, watcher." — is gone, replaced with "Parse and serialise Art MD from the command line." A repo-wide grep over `cli/bin/` now finds the role words only in `tsconfig.*.json` `compilerOptions`, which are not roles.                              |
| Rewrite the package description                                        | `README.md` and `_guide.md` both describe the package as a CLI exposing the Art MD codec, parser, and serializer as commands — matching the `Purpose` landed in `_records/package.art` by `f130ff2`.                                                                                                                                    |
| Document the three commands                                            | `README.md` gains a `## Commands` table mapping `art-codec`, `art-parse`, and `art-serialize` to their `./dist/esm/bin/*.mjs` bin entries and their roles, plus a note that each is a self-executing entry point under `src/bin/` built into its own bundle, and that the stubs currently report not-yet-implemented and exit non-zero. |
| Document build and scripts sections                                    | `README.md`'s `### Build` now states that `esbuild` emits one bundle per `src/**/*.ts` under `dist/esm/` and `dist/cjs/`, and that the published bins are the `dist/esm/bin/*.mjs` bundles. `### Scripts` lists `dev`, `build`, `lint`, `lint:fix`, `test`, and `ci` for this package directory.                                        |
| Create `CHANGELOG.md` with an initial entry for the three entry points | New `CHANGELOG.md` opens at `0.0.1` with a single `### Added` bullet recording `art-codec`, `art-parse`, and `art-serialize` and the `src/bin/*.ts` → `dist/esm/bin/*.mjs` mapping they resolve through.                                                                                                                                |

#### Files changed

- `$BUILD/cli/bin/_guide.md` — Realigned the opening description to the codec/parser/serializer CLI role; expanded `## Package Layout` to the `src/` directory tree; added records-management guidance and the `Verifying Step` / `Verifying Completion` operating instructions.
- `$BUILD/cli/bin/README.md` — Replaced the stale bundler/validator/compiler/watcher blockquote; added the `## Commands` table for the three bins, a build-output description, and a populated `### Scripts` list.
- `$BUILD/cli/bin/CHANGELOG.md` — New: initial `0.0.1` entry recording the three entry points.

### Commits

| Id                     | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ---------------------- | ------------------------------ | -------- | --------- | ----------- |
| `document-bin-package` | Art MD / `$BUILD` / `building` | `NOPUSH` | `1662a5e` | `COMMITTED` |

**Message:** `docs(bin): document package role, entry points, and operations`

**Push:** Not pushed, per the `NOPUSH` policy. No `git push` was run; the `building` branch has no configured upstream (`git rev-parse --abbrev-ref @{u}` → `fatal: no upstream configured for branch 'building'`), so `1662a5e` exists only in the local repository.

The lefthook `pre-commit` hook (`0-clean`, `1-extract`, `2-ci`) ran on the commit and passed without `--no-verify`.

### Validation

| Command                  | Working directory          | Outcome                                                                                                              |
| ------------------------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npx prettier --write`   | `$BUILD`                   | PASS — 3 files processed; only `cli/bin/README.md` reflowed, the other 2 already conformed.                          |
| `npx prettier . -c`      | `$BUILD`                   | PASS — exit 0; "All matched files use Prettier code style!"                                                          |
| `npm run test`           | `$BUILD/cli/bin`           | PASS — exit 0; 1 test file, 4 tests passed.                                                                          |
| `npm run ci`             | `$BUILD` (repository root) | PASS — exit 0; `ci:root` prettier clean, 7/7 turbo tasks successful, 43 codec fixtures round-tripped.                |
| `git log -1 --format=%B` | `$BUILD`                   | PASS — message is exactly `docs(bin): document package role, entry points, and operations`.                          |
| `git status --short`     | `$BUILD`                   | PASS — nothing staged; only the delegator's pre-existing edits and the previous iteration's untracked report remain. |

## Blockers (if any)

None.

## Feedback

### For the planner

- **The `src/` layout in the instruction is ahead of the tree.** Step 1 names `src/bin/`, `src/commands/`, `src/private/`, and `src/test/`, but the checkout only contains `src/index.ts` and `src/bin/` — `commands/`, `private/`, and `test/` do not exist. I documented all four as the instruction requires, with an explicit sentence stating that `src/bin/` holds the entry points today and the other three are filled as the command behaviour lands. If the intent was to document only what exists, drop the three from the layout list; if the intent was the target layout, the guard sentence should become a standard phrase for forward-looking layouts.
- **The `CHANGELOG.md` example diverges from repo house style.** The instruction's example uses `# @art-md/bin` with a flat bullet; all seven existing `CHANGELOG.md` files in this repository use `# CHANGELOG` with `### Added` / `### Fixed` / `### Documented` subsections. I followed the repository convention, since a single divergent changelog would be the only one of its kind. Worth normalising the example in the instruction template if the house style is the intent.
- **`exports["."].types` is still unresolved.** The previous iteration's report flags that `@noodlestan/esbuild` does emit `dist/esm/index.d.ts`, yet the instruction's summary still says "drop the dangling `exports["."].types`". The published package currently declares no `types` condition. Nothing in this iteration depends on it, but the README's claim that the public surface is "types only" is only half-true until a `types` condition ships.
- **`module` and `main` are still half-declared** alongside `exports` in `package.json`, carried over from the previous iteration and out of this iteration's scope.

### For the technical writers

- No ambiguity or contradiction blocked execution. The instruction was self-contained, every mandatory-reading file resolved, and all four `RULE:` lines were satisfiable as written.
- The instruction's Path Variables table again defines `$PROJECT` as the planning checkout while every step operates on `$BUILD`. The "Setting Up" and "Verifying Completion" blocks inherit `$PROJECT/_guide.md` as their source, so a worker reading literally installs in the wrong checkout. A one-line note that `$PROJECT` supplies knowledge and `$BUILD` supplies the work would remove the misread.
- The instruction's `CHANGELOG.md` example is the only place in either this instruction or the previous one that contradicts a repository convention, and it is the reason the new file needed a judgement call.
- `README.md`'s `## Commands` table has a `role` column that describes intended behaviour while the commands are stubs. I added a sentence directly beneath it stating the current stub behaviour, so the table cannot be read as a claim that the commands work.

### For the crew

- The package `ci` chain is green end to end and the three docs now agree with `package.json`, so `art-codec`/`art-parse`/`art-serialize` are discoverable from the README without reading the manifest.
- `_guide.md`'s layout is the first orientation document for whoever implements the command behaviour next; the explicit "not yet, and here is why" sentence is the part worth keeping if the layout list is ever re-cut to what exists today.
- The repository-wide `prettier . -c` is clean, so the next commit's `2-ci` pre-commit hook is not at risk of the formatting abort seen after the previous iteration.
- `git status` in this checkout is not clean and will not be: the delegator's `plan.md` and `declare-bin-package-contract.md` edits, plus the untracked `declare-bin-package-contract__report.md`, are all still there. That is expected, but a worker that stages with `git add -A` will sweep them into its commit.
