# Sub-Agent REPORT (#producer)

**Plan:** `expose-construct-creation-in-codec`

**Iteration Id:** `define-construct-api-on-codec`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Open construct surface on `ArtCodec` — `getConstructFactory`, `create`, `toText` — implemented in `@art-md/codec` over the configured construct factory list, with `Document` discarded at index build.

| Goal                                         | Result                                                                                                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extend the `ArtCodec` contract in primitives | `ArtCodec` declares `getConstructFactory`, `create`, `toText`; `ConstructFactoryFunction` and `ConstructFactoryEntry` added and re-exported from the codec barrel.                                      |
| Configure the codec's construct factories    | `ArtCodecConfig.factories` (required) and `PartialArtCodecConfig.factories` (optional) added; `FACTORIES` from `@art-md/constructs` wired as the default input behind one commented cast.               |
| Implement the three members                  | Lazy per-instance index built from `config.factories ?? defaultConstructFactories`; `Document` discarded while building; no `Document` branch in any member.                                            |
| Cover the new API with tests                 | 11 new tests (15 total) covering default registry, `create` data pass-through, `Document`-as-unknown error, configured registry replacement, `toText` in three shapes, and factory-reference stability. |
| `@art-md/constructs` untouched               | `libs/constructs/`, `libs/parser/`, `libs/serializer/` unmodified (verified against the commit diff).                                                                                                   |

#### Files changed

- `$PROJECT/libs/primitives/src/codec/types.ts` — added `ConstructFactoryFunction` and `ConstructFactoryEntry`; added `getConstructFactory`, `create`, `toText` to the `ArtCodec` interface (kept as `interface`, type-only `ConstructBase` import from the constructs barrel).
- `$PROJECT/libs/primitives/src/codec/index.ts` — re-exports both new types so `@art-md/codec` can see them through the root entry.
- `$PROJECT/libs/primitives/src/source/createArtDocumentSource.test.ts` — three `codecMock` literals extended with the new members (in-scope ripple of the contract change).
- `$PROJECT/libs/codec/src/types.ts` — `factories` added to `ArtCodecConfig` and `PartialArtCodecConfig`.
- `$PROJECT/libs/codec/src/createArtCodec.ts` — imports `FACTORIES`, declares `defaultConstructFactories` (single commented cast), builds the index lazily via the `getFactoryIndex` closure, and serves the three members.
- `$PROJECT/libs/codec/src/private/createFactoryIndex.ts` — new; filters `DISCARDED_CONSTRUCT_FACTORY_NAMES` (`['Document']`) and returns the `Map` index.
- `$PROJECT/libs/codec/src/private/readConstructText.ts` — new; recursive reader (`value` → joined children → `''`).
- `$PROJECT/libs/codec/src/createArtCodec.test.ts` — 11 new tests; no test imports a `create*` function from `@art-md/constructs` or anything from `src/private/`.

### Commits

- `b6396ef` — `build(codec): Expose construct creation and toText on ArtCodec` — 8 files, +207/−2. Created; **not pushed** per `NOPUSH` (branch `main` is ahead 3 of `origin/main`).

### Verification

- `npm run test:ci` from `$PROJECT/libs/primitives/` — 8 files, 22 tests passed; 100% statements/branches/functions/lines.
- `npm run test:ci` from `$PROJECT/libs/codec/` — 1 file, 15 tests passed; 100% statements/branches/functions/lines (thresholds 95/95/100/95).
- `npm run ci` from `$PROJECT/` — 12/12 turbo tasks: root prettier, per-package lint (prettier + eslint + tsc), builds, unit tests, 43 parser + 43 serializer fixtures, CLI unit (92) + integration (29) tests.
- `npm run lint:fix` from `$PROJECT/` — all files already Prettier-clean before staging.
- Pre-commit hook (`npm run clean` + `npm run ci`) passed for commit `b6396ef`.
- Note: Step 3's standalone `npm run test:ci` in codec reported coverage-threshold failures until Step 4's tests landed; expected sequencing, resolved within the iteration.

### Final Verification

- `ArtCodec` declares `getConstructFactory`, `create`, `toText`; both new types re-exported from `$PROJECT/libs/primitives/src/codec/index.ts`.
- `createArtCodec` builds its index lazily from `config.factories ?? defaultConstructFactories`; `Document` discarded only in `createFactoryIndex`; no `Document` branch in any member.
- `readConstructText` and `createFactoryIndex` live in `$PROJECT/libs/codec/src/private/`, imported with flat private paths (`./private/*.js`), and are not exported from `$PROJECT/libs/codec/src/index.ts`.
- `create('Document', ...)` and an unknown name throw the identical `TypeError: Unknown construct name: {name}` — asserted by tests.
- Nothing under `$PROJECT/libs/constructs/`, `$PROJECT/libs/parser/`, or `$PROJECT/libs/serializer/` was modified.

## Blockers (if any)

**None.**
