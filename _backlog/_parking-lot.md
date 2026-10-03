# Parking Lot: Art MD Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## ACTIONABLE

- None.

## PENDING

- **Ops: Package Records Dependencies** — add `dependencies` back to package records, generate a dependencies.md file in architecture with graph of internal packages and list of external runtime deps.
- **Routine: Architecture Files** — There is a draft for 3 different types os files in `architecture/_routines/draft-architecture-file.md` - abstract, deduplicate, compact and publish to `art-domains`. All useful routines (along with other architect tasks) to expose in a skill. Eventually, an abstract slice of reusable code, belongs in the knowledge domain.
- **Plan: Fix Library Exports** — the published libs (`@art-md/primitives`, `constructs`, `parser`, `serializer`, `codec`) set `"main": "./src/index.ts"` and their sources use extensionless relative imports, so a plain `node dist/esm/bin/{codec,parse,serialize}.mjs` fails with `ERR_MODULE_NOT_FOUND`. Root cause is in the lib manifests and build config, not in `@art-md/bin`: `esbuild-cli` correctly externalises workspace packages, so the bin bundle keeps `import … from "@art-md/codec"` and Node cannot load TypeScript source. Canonical fix: give each lib a real `exports` map (conditions `types`/`import`/`require`) pointing at built output, as `@art-md/bin` already does; make relative imports extensionful (`./createArtCodec.js`) so the built ESM is Node-loadable; and make the libs emit Node-targeted ESM — today `libs/codec/dist/esm` is browser-targeted and its decoder entry calls `document.createElement`. Rejected alternatives: bundling workspace deps into the bin (`esbuild-plugin-file-path-extensions` marks cross-root imports external and rewrites them to relative `.mjs` paths that do not exist), and pointing the test resolver at the libs' `dist` (browser build). Unowned — Plan: Consolidate Codec Bin covers duplication extraction into `@art-lib`, not packaging. Add an `npm pack` → install → run test, which is where the defect bites a consumer.
- **Plan: Update CLI Documentation** — `cli/bin/README.md` and `cli/bin/_guide.md` are contradicted by the code: the README still says the command behaviour is unimplemented, that the export surface is types only, and omits operation logging; the guide's Package Layout omits `src/private/{commander,operations,present,logger,log,io,config,context}/` and `src/test/helpers/`, and closes by saying the behaviour behind `src/bin/` is still to land. Both files were in Plan: Implement Bin Commands' "Knowledge to Update" and were never touched. Depends on the `--json` decision below and on Plan: Fix Library Exports for the install story.

## BLOCKERS

- None current.

### Decisions Needed: `serialize` output options

`--json` on `art-parse` prints the parsed `ArtDocument` as JSON instead of the human-readable form, so `art-parse --json > doc.json` yields something a program can consume. `doSerialize` accepts and honours a `json` flag through `presentContent`, but no commander spec exposes it — the plan's `buildSerializeCommand` scope line listed only `[file]`, `-o`, and `-w`. Raised in three consecutive delegation reports and still open. Proposal: **drop `json` from `SerializeOptions` and add `--document <file>` to the serialise command**, reading an `ArtDocument` as input — the mirror of parse's `--write` output. Rationale: serialise _consumes_ a document rather than emitting one, so its symmetric need is a document input, not a JSON output mode; `art-parse --json | art-serialize --document -` then becomes the real roundtrip, and the JSON roundtrip loses a flag. Alternative if the `--json | --json` pairing is preferred: add `--json` to the serialise spec as planned-omission fix. Decision owner: user.

- None current.
