# Sub-Agent REPORT (#producer)

**Plan:** `implement-primitives-contracts`

**Iteration Id:** `add-codec-contract`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Change                                                                                                                   | Location                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Declared `ParseResult` in parser types                                                                                   | `$PROJECT/libs/primitives/src/parser/types.ts`                                                                                   |
| Declared `SerializeResult` in serializer types                                                                           | `$PROJECT/libs/primitives/src/serializer/types.ts`                                                                               |
| Carried `parseContext` on `ParserVisitContext` (type + factories, transitional default; threaded through `childContext`) | `$PROJECT/libs/primitives/src/parser/context/types.ts`, `createParserVisitContext.ts`, `private/createParserVisitContextBase.ts` |
| Added `ArtCodec` contract (4 overloaded `parse`/`serialize` signatures)                                                  | `$PROJECT/libs/primitives/src/codec/types.ts`                                                                                    |
| Wired package exports (`codec`, serializer types)                                                                        | `$PROJECT/libs/primitives/src/index.ts`, `serializer/index.ts`                                                                   |
| Extended unit tests for `parseContext` threading (default and provided)                                                  | `$PROJECT/libs/primitives/src/parser/context/createParserVisitContext.test.ts`                                                   |

#### Files changed

| File                                                                                  | Description                                                                                                |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `$PROJECT/libs/primitives/src/codec/types.ts` (new)                                   | declares `ArtCodec` with the four overloaded `parse`/`serialize` signatures matching the design attachment |
| `$PROJECT/libs/primitives/src/parser/types.ts`                                        | appends `ParseResult { document, context }`                                                                |
| `$PROJECT/libs/primitives/src/serializer/types.ts` (new)                              | declares `SerializeResult { content, context }`                                                            |
| `$PROJECT/libs/primitives/src/parser/context/types.ts`                                | adds `readonly parseContext: ParseContext` to `ParserVisitContext`                                         |
| `$PROJECT/libs/primitives/src/parser/context/createParserVisitContext.ts`             | accepts optional `parseContext` (defaults via `createParseContext`) and forwards it                        |
| `$PROJECT/libs/primitives/src/parser/context/private/createParserVisitContextBase.ts` | adds `parseContext` param with default and passes it through `childContext` recursion                      |
| `$PROJECT/libs/primitives/src/test/helpers/parser/makeParserVisitContextMock.ts`      | adds `parseContext` to the context mock to keep the repo green                                             |
| `$PROJECT/libs/primitives/src/parser/context/createParserVisitContext.test.ts`        | adds `GIVEN` cases covering default and provided `parseContext`                                            |

### Verification

- `npm run ci` from the repository root — passed (6/6 tasks: lint, build, tests incl. coverage).
- `npm run test` from `cli/pipeline-tests/` — 43 fixtures tested, all passed.
- Pre-commit hook ran `npm run ci` on commit — all green.
- Commit executed; NOT pushed (policy `NOPUSH`).
- `ParserVisitContext` requires `parseContext`, but `createParserVisitContext(document, source)` still compiles via the transitional default.
- `ArtCodec`, `ParseResult`, and `SerializeResult` are exported from the `@art-md/primitives` package index.

**Commit:** `351bb36` `build(codec): add codec contract and results to primitives`

## Blockers (if any)

None.

## Feedback

Not requested — no `DIRECTIVE FEEDBACK` was provided in the prompt, so the feedback sections are omitted.
