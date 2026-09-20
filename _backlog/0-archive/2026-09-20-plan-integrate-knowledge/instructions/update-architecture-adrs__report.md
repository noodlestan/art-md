# Sub-Agent REPORT (#producer)

**Plan:** `integrate-knowledge`

**Iteration Id:** `update-architecture-adrs`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Context: restore the restored ADR set — rename the restored ADR files to `.md`, create `art-md.md` capturing the art-md pipeline decisions lifted from the package api/implementation knowledge, and trim the existing ADRs following the WIP comments.

| Change (per instruction "## Changes")                                                                                                        | Outcome |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Rename restored ADR files to `.md` (`compiler.art`, `language.art`, `configuration.art`)                                                     | DONE    |
| Create `architecture/adr/art-md.md` with the seven art-md pipeline decisions                                                                 | DONE    |
| Trim `compiler.md`, `language.md`, `configuration.md` following the WIP comments (`configuration.md` has no WIP comments and was kept as-is) | DONE    |

#### Files changed

- `$ADR/compiler.art` → `$ADR/compiler.md` — renamed; trimmed the three WIP-marked, superseded decisions (`Compiler Based on Unified`, `Kind-Agnostic Parser`, `Open Schema Registry for Records`) whose authority lives in `art-md.md` and the constructs/parser knowledge. Kept the five remaining valid compiler decisions (`Reactive Pull Pipeline`, `TypeScript Implementation`, `Entry Point Driven Compilation`, `Deterministic Compilation`, `Reactive Framework: SolidJS Signals`, `Watcher Based on Chokidar`).
- `$ADR/language.art` → `$ADR/language.md` — renamed; moved the WIP-marked `SectionBlock as the Resource Declaration Carrier` (WIP: merge the idea into the parser constructs). Kept the six valid language decisions (`Two Main Use Cases`, `Closed Syntax, Open Semantics`, `Any Markdown is Valid .art`, `Create an accessory Template Language`, `Projection-Aligned Tags`, `Example Localization`). Fixed obvious typos in `Example Localization` per the Writing Decisions style.
- `$ADR/configuration.art` → `$ADR/configuration.md` — renamed; no WIP comments, content unchanged.
- `$ADR/art-md.md` — created; `# Art MD` + one-sentence purpose; seven decisions in the `## Decision: {Name}` style, each with `**Status:**` and optional `**Context:**`/`**Consequences:**`: MD Substrate MDAST (trimmed/reworded from the old `Compiler Based on Unified`, reflecting the implemented mdast choice, with the solid-mdast-renderer link), Visitor Architecture, Context Pattern, Constructs Package Structure, Parser/Serializer Independent from Constructs, Natural Block Fallback, Tags Parsing.
- `$ADR/_research.md` — untouched (already `.md`, no WIP comments).

Path note: the instruction's report-back step referenced `$PROJECT/_backlog/6-plan/plan-integrate-knowledge/...`, but no such directory exists; the plan and instruction live under `$PROJECT/_backlog/3-now/...`. Per the instruction's "write it next to this instruction file" wording and the delegator's prompt, the report was written next to the instruction file.

### Commit and Push

- Commit `327adfd` — `knowledge(art-js): Restore and update ADR set.` on branch `building`.
- Push: `bd42f45..327adfd building -> building` to `github.com:noodlestan/art-js.git`.

### Verification

- Setting up: `npm ci` and `npm run ci` — passed (11 tasks, baseline clean; 43 fixture tests pass).
- Verifying completion: `npm run lint:fix` and `npm run lint` — passed (prettier clean after autofix of the three new/trimmed markdown files).
- Final verification per instruction — all four checks pass: `$ADR` contains `compiler.md`, `language.md`, `configuration.md`, `_research.md`, `art-md.md` and no `.art` files remain; `art-md.md` starts with `## Decision: MD Substrate MDAST` and covers all seven listed decisions; the WIP-marked/superseded decisions were removed from the trimmed ADRs (no WIP comments remain, valid decisions kept); commit pushed per the `AUTONOMOUS` policy.
- Commit pre-hook ran `npm run ci` — 11 tasks successful, 43 fixtures pass (parse and lossless roundtrip).

## Blockers (if any)

None.

## Feedback

None requested.
