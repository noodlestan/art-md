# Sub-Agent REPORT (worker)

**Plan:** `use-website-url-in-docs`

**Iteration Id:** `reword-pipeline-prose`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| #   | Goal (from instruction `## Goals`)                            | Commit    | Status      |
| --- | ------------------------------------------------------------- | --------- | ----------- |
| 1   | Describe the architecture accurately instead of as a pipeline | `fa51737` | `COMMITTED` |

| Commit                            | Repository / Checkout / Branch   | Policy   | Push       |
| --------------------------------- | -------------------------------- | -------- | ---------- |
| `fa51737` `reword-pipeline-prose` | Art MD / `$PROJECT` / `building` | `NOPUSH` | Not pushed |

#### Files changed

- `$PROJECT/architecture/principles.md` — reworded the "Runtime Config and Context Injection" paragraph: "The pipeline is configured via factories" became "The parser and the serializer map between Markdown and the Art AST in both directions, and each direction is configured via factories". The rest of the paragraph (factory names, one call per factory at setup, `ParserVisitContext` injection, config injection as a future direction) is unchanged.
- `$PROJECT/architecture/adr/art-md.md` — reworded the record **Purpose** to "Decisions about the art-md round-trip between markdown and the Art AST" and the `Decision: Parser/Serializer Independent from Constructs` sentence to "The parser and the serializer are construct-agnostic".

No decision, ADR status, path, code reference, file name, heading, or link was changed; the only edits are the three sentences above.

### Occurrences left alone

`grep -rniI "pipeline" architecture _roadmap --exclude-dir=0-archive --exclude-dir=1-done` still reports four hits after the commit, each out of scope per the instruction rules:

- `$PROJECT/architecture/adr/_research.md:18` — describes the third-party `remarkjs/remark` "parse → transform → compile pipeline on micromark" inside a survey table; it does not describe the Art MD architecture.
- `$PROJECT/_roadmap/6-plan/milestone-art-constructs/milestone.md:123` — a `cli/pipeline-tests/` path reference; the instruction forbids changing paths, code references, or file names.
- `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md:166` and `:214` — "the build/CI pipeline has a real module to resolve"; CI tooling, not the Art MD architecture.

Nothing under `_roadmap/0-archive/` or `_roadmap/1-done/` was read for rewording or edited.

### Verification

| Check                                                      | Command                                                                                    | Result                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Setting Up                                                 | `npm ci` (from `$WORKSPACE` and from `$PROJECT`)                                           | Both installs completed, no errors                    |
| Markdown formatting before commit                          | `npx prettier . -c` (from `$PROJECT`)                                                      | `All matched files use Prettier code style!`          |
| Verifying Completion before commit                         | `npm run ci` (from `$PROJECT`)                                                             | 7/7 turbo tasks successful; 43 codec fixtures passed  |
| Pre-commit hook                                            | `npm run ci` (from `$PROJECT`, run by the hook)                                            | `0-clean`, `1-extract`, `2-ci` all ✔️; commit created |
| One commit created, none pushed                            | `git --no-pager log -1 --format='%h %s'`                                                   | `fa51737 knowledge(art-md): reword pipeline prose`    |
| Branch has no upstream, no push performed                  | `git branch -vv`                                                                           | `building fa51737` with no upstream tracking ref      |
| No live architecture or roadmap prose describes a pipeline | `grep -rniI "pipeline" architecture _roadmap --exclude-dir=0-archive --exclude-dir=1-done` | Only the four out-of-scope occurrences listed above   |
| Formatting holds on the committed tree                     | `npx prettier . -c` (from `$PROJECT`)                                                      | `All matched files use Prettier code style!`          |
| Working tree clean after the commit                        | `git status --short`                                                                       | No output                                             |
| Commit touches only the two declared files                 | `git --no-pager show --stat --format='%h %s' fa51737`                                      | 2 files changed, 3 insertions(+), 3 deletions(-)      |

### Findings

- **The plan's mandatory-reading path is stale** — the instruction points at `$PROJECT/_backlog/4-next/plan-use-website-url-in-docs/plan.md`, but the plan now lives in the planning checkout at `_backlog/3-now/plan-use-website-url-in-docs/plan.md` (moved by commit `77fd876`). Read from the planning checkout as directed by the delegation prompt; the plan's `## Scope` and the `reword-pipeline-prose` iteration were otherwise intact.
- **The prescribed commit type is not an allowed type** — the instruction and the plan both prescribe `knowledge(art-md): ...`, but `knowledge` is a group name, not a type, in `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (the closest allowed types for architecture prose are `arch` and `docs`, both `$KNOWLEDGE(%project | %feature | %resource)`). The message was used verbatim as instructed, since the commit message is part of the commit blueprint.
- **The instruction's grep is case-sensitive and `.md`-only** — it was run verbatim and also run case-insensitively over all text files; both agree on the four remaining live occurrences, so no extra hits were missed.

## Blockers (if any)

None.
