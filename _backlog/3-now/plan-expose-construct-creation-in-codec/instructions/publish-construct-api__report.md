# Sub-Agent REPORT (#producer)

**Plan:** `expose-construct-creation-in-codec`

**Iteration Id:** `publish-construct-api`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                                 | Result                                                                                                                                                                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Republish `@art-md/primitives` with the extended `ArtCodec` contract | Version bumped `0.0.6` → `0.0.7`, `## 0.0.7` changelog section added, verified, committed, and published as `latest` on `registry.npmjs.org`.                                  |
| Republish `@art-md/codec` with the construct factory API             | Version bumped `0.0.3` → `0.0.4`, `## 0.0.4` changelog section added, verified, committed, and published as `latest` on `registry.npmjs.org` (primitives first, codec second). |
| Land the whole release as the single `publish-construct-api` commit  | One commit `332d1da` touching exactly the four release files; **not pushed** per `NOPUSH` policy.                                                                              |
| Confirm consumers can adopt the new surface                          | `npm view @art-md/primitives version` → `0.0.7`; `npm view @art-md/codec version` → `0.0.4`.                                                                                   |

#### Files changed

- `$PROJECT/libs/primitives/package.json` — version `0.0.6` → `0.0.7`; no dependency ranges touched (package has no `@art-md/*` dependencies).
- `$PROJECT/libs/primitives/CHANGELOG.md` — new `## 0.0.7` section above `0.0.6`: `ArtCodec` gains `getConstructFactory`, `create`, `toText`; `ConstructFactoryFunction` and `ConstructFactoryEntry` added.
- `$PROJECT/libs/codec/package.json` — version `0.0.3` → `0.0.4`; all four `@art-md/*` dependency ranges left as `"*"`.
- `$PROJECT/libs/codec/CHANGELOG.md` — new `## 0.0.4` section above `0.0.3`: `ArtCodecConfig.factories` with the `FACTORIES` default, lazy `name => factory` index with `Document` not creatable, and the recursive `toText`.

### Commits

- `332d1da` — `release(art-md): Republish primitives and codec with construct API` — 4 files, +17/−2. Created; **not pushed** per `NOPUSH` (branch `main` is ahead 6 of `origin/main`).

### Verification

- `npm ci` from `$PROJECT/` — dependencies installed cleanly (Setting Up).
- `npm run ci` from `$PROJECT/` (Step 3) — 12/12 turbo tasks: root prettier, per-package lint (prettier + eslint + tsc), builds, unit tests, codec fixtures, CLI unit (92) + integration (29) tests.
- `git status --porcelain` after Step 3 — exactly the four release files changed (two `package.json`, two `CHANGELOG.md`) and nothing else.
- `npm run lint:fix` from `$PROJECT/` — all files already Prettier-clean before staging.
- Pre-commit hook (`npm run clean` + `npm run ci`, 12/12 tasks) passed for commit `332d1da`.
- `npm whoami` — authenticated as `noodlestan` (no OTP/2FA prompt encountered).
- `npm publish` from `$PROJECT/libs/primitives/` — `+ @art-md/primitives@0.0.7` (shasum `3fd343f95a81ce009146662de55877edf6f66236`), public access, `registry.npmjs.org`.
- `npm publish` from `$PROJECT/libs/codec/` — `+ @art-md/codec@0.0.4` (shasum `b05ab7586c205f8abfa56d3d27d4a16a7ce3deb8`), public access, `registry.npmjs.org`.
- Note: registry propagation for `npm view` took a few minutes after publish; both versions were confirmed once the registry metadata updated.

### Final Verification

- Commit `332d1da` exists and has NOT been pushed — `main` is 6 commits ahead of `origin/main` (`NOPUSH` honored).
- `$PROJECT/libs/primitives/package.json` reads `0.0.7` and `$PROJECT/libs/codec/package.json` reads `0.0.4`; every `@art-md/*` dependency range is still `"*"`.
- Both CHANGELOG files open with the new section above the previous one (`0.0.7` above `0.0.6`; `0.0.4` above `0.0.3`).
- `npm view @art-md/primitives version` → `0.0.7`; `npm view @art-md/codec version` → `0.0.4`.
- No file outside `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/` was changed — the commit touches only the four release files and the working tree is clean.
- Verifying Completion (`npm run ci` from `$PROJECT/`) executed in Step 3 and again on the pre-commit hook — passed both times.

## Blockers (if any)

**None.**
