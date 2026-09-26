# Sub-Agent REPORT (#producer)

**Plan:** `implement-codec-package`

**Iteration Id:** `rename-pipeline-tests-to-codec-tests`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Change                                                                                    | Status |
| ----------------------------------------------------------------------------------------- | ------ |
| Rename `cli/pipeline-tests` to `cli/codec-tests`                                          | Done   |
| Point the test scripts at the codec dependency (`codec.parse`/`codec.serialize`)          | Done   |
| Remove the temporary config assembly and the direct parser/serializer dependencies        | Done   |
| Commit `build(codec): rename pipeline-tests to codec-tests` (policy `NOPUSH`, not pushed) | Done   |

#### Files changed

- `cli/pipeline-tests/` → `cli/codec-tests/` — directory renamed via `git mv`; package becomes `@art-md/codec-test-cli`.
- `cli/codec-tests/package.json` — name `@art-md/codec-test-cli`, `repository.directory` `cli/codec-tests`; dependencies replaced with `"@art-md/codec": "*"` (parser/serializer/constructs removed).
- `cli/codec-tests/scripts/test/shared/makeCodec.ts` — new helper: `makeCodec(): ArtCodec` calling `createArtCodec()`.
- `cli/codec-tests/scripts/test/parser/parseFixture.ts` — uses `codec.parse(content)` instead of assembling a parser config.
- `cli/codec-tests/scripts/test/serializer/serializeFixture.ts` — uses `codec.serialize(artDocument)` instead of assembling a serializer config.
- `cli/codec-tests/scripts/test/serializer/diffFixtureResults.ts` — uses `codec.serialize(artDocument)`; imports ordered per `import/order`.
- `cli/codec-tests/_records/package.art`, `cli/codec-tests/_records/npm-deployment.art` — renamed to Codec Test CLI / `@art-md/codec-test-cli`.
- `cli/codec-tests/_guide.md`, `cli/codec-tests/README.md`, `cli/codec-tests/CHANGELOG.md` — reflect the rename and the codec-based test scripts.
- `_records/project.art` — `Package: Pipeline Tests` → `Package: Codec Tests`.
- `architecture/components.md` — section renamed to `Codec Tests (@art-md/codec-test-cli)`; description mentions "through the codec".
- `_guide.md` — `Pipeline Test CLI` row → `Codec Test CLI` (`cli/codec-tests/_guide.md`); Verifying Step path → `cli/codec-tests/`.
- `package-lock.json` — workspace rekeyed to `cli/codec-tests` / `@art-md/codec-test-cli` with `@art-md/codec` dependency.

## Feedback

### For the planner

The instruction's literal file contents do not pass the repository's own `eslint` rules: `makeCodec()` needs an explicit return type (`explicit-module-boundary-types`), `diffFixtureResults.ts` import order must be alphabetical (`import/order`), and `serializeFixture.ts` needs an empty line between the `../shared` and `./types` import groups. The files were committed with minimal lint-conformance adjustments; behavior and semantics are unchanged.

### For the technical writers

`package-lock.json` retains an `extraneous: true` entry for `cli/pipeline-tests` after `npm ci`/`npm prune`; `npm ci` still succeeds, so it is harmless but worth revisiting.
