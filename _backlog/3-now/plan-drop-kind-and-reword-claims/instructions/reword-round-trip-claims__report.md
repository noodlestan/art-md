# Sub-Agent REPORT (#producer)

**Plan:** `drop-kind-and-reword-claims`

**Iteration Id:** `reword-round-trip-claims`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Every live round-trip claim now states structural fidelity rather than byte-identity: the ADR records the decision, the harness and design doc label the suite as canonical-input byte-equality, and the spec's `lossless round-trip` claim is reworded — with a sweep confirming no live claim survives outside archived history.

| Goal                                                  | Outcome | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Record the structural-fidelity decision in the ADR    | Done    | `## Decision: Round-Trip Fidelity Is Structural` (Status: Adopted) appended to `$PROJECT/knowledge/adr/art-md.md` with the verified example: `"# One\n\n\n\n# Two\n"` serialises to `"# One\n\n# Two\n"`.                                                                                                                                                                                                                                                 |
| Stop the harness claiming losslessness                | Done    | `$CODEC_TESTS/scripts/test/serializer/diffFixtureResults.ts` success line now prints `CANONICAL ROUNDTRIP {fixture}`; failure line unchanged.                                                                                                                                                                                                                                                                                                             |
| State canonical-input byte-equality in the design doc | Done    | New paragraph in the `Overview` of `$PROJECT/knowledge/design/art-md-fixture-tests.md`: serializer output is compared byte-for-byte because fixtures are authored in canonical form; non-canonical input is normalised per CommonMark; cross-references the ADR decision.                                                                                                                                                                                 |
| Reword the spec claim and sweep for leftovers         | Done    | `$SPEC/grammar/constructs/structural/natural-block.art` schema comment now reads `// raw markdown content, captured verbatim from the source`. Sweep for `lossless\|byte-identical\|byte-exact` across `$PROJECT/knowledge`, `$PROJECT/libs`, `$PROJECT/cli`, `$SPEC` (md/ts/art) returns only the ADR `Context:` line, which describes the claims as overstated (part of the decision record, not a live claim). No archived or CHANGELOG matches exist. |
| Commit with the prescribed message (NOPUSH)           | Done    | Commit `b56d759` on `main`; not pushed — `origin/main` remains at `46648da`, local `main` is 3 commits ahead (this + the two prior iterations). Working tree clean.                                                                                                                                                                                                                                                                                       |

#### Files changed

- `$PROJECT/knowledge/adr/art-md.md` — appended the `Round-Trip Fidelity Is Structural` decision entry (Context / Decision / Consequences).
- `$PROJECT/knowledge/design/art-md-fixture-tests.md` — added the canonical-input byte-equality paragraph to `Overview`.
- `$CODEC_TESTS/scripts/test/serializer/diffFixtureResults.ts` — reworded the success label to `CANONICAL ROUNDTRIP`.
- `$SPEC/grammar/constructs/structural/natural-block.art` — reworded the `NaturalBlock.value` schema comment.

### Verification

- `npm ci` at `$WORKSPACE` root: OK.
- Verifying Step from `$CODEC_TESTS` (`npm run test`): test-parser 43/43 pass, test-serializer 43/43 pass; every serializer line reads `CANONICAL ROUNDTRIP {fixture}`.
- Verifying Completion: `npm run ci` ran on the pre-commit hook from `$PROJECT` root — 7/7 turbo tasks successful (lint, build, tests across all packages); commit created only after it passed.
- Formatting: `npm run lint:fix` (prettier) clean; only the four in-scope files modified.
- Final Verification: commit present and unpushed per `NOPUSH` policy; ADR carries the decision with the verified normalisation example; harness label and design doc wording confirmed by grep; no live lossless/byte-identical/byte-exact claim outside the ADR's own decision context.

## Blockers (if any)

None.
