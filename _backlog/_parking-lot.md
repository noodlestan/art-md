# Parking Lot: Art MD Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **PENDING** (waiting), **BLOCKERS** (blocking work), **FOLLOW-UPS** (not in scope). Done items, answered questions, removed blockers, are deleted from the parking lot (tracked in plans if applicable).

## Ongoing

- **Participate in the Art Records Whiteboard (owned by `ART_JS`)** — board at `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`; this project is the highest priority. Our blocking plan `plan-drop-kind-and-reword-claims` is `DONE` and `@art-md/constructs` is at `0.0.6`; the whiteboard still requires resolving the records API blockers before `ART_JS` delegates `implement-record-model`.

---

## ACTIONABLE

- **Reproduce the root vs `checkouts/art-md` prettier divergence** — same hand-written file passed `$WORKSPACE`'s `npx prettier --check` and failed art-md's `prettier . -c`, which rejected commit `47cc5f7` until art-md's own prettier rewrote 17 table-alignment lines. Confirm which root resolves which prettier/config before deciding whether to pin them.

Step by step (manual, nothing committed, delete the probe when done):

```bash
# 1. What each root resolves — versions are the suspected cause
cd $WORKSPACE && npm ls prettier @noodlestan/prettier-config
cd $WORKSPACE/checkouts/art-md && npm ls prettier @noodlestan/prettier-config

# 2. Untracked probe inside the repo, so BOTH binaries resolve art-md's config
git -C checkouts/art-md show HEAD:_backlog/3-now/plan-expose-construct-creation-in-codec/plan.md \
  > checkouts/art-md/_backlog/3-now/plan-expose-construct-creation-in-codec/plan.probe.md

# 3. Same file, workspace binary (the command I used)
cd $WORKSPACE && npx prettier --check checkouts/art-md/_backlog/3-now/plan-expose-construct-creation-in-codec/plan.probe.md

# 4. Same file, art-md binary (what the pre-commit hook runs)
cd $WORKSPACE/checkouts/art-md && npx prettier --check _backlog/3-now/plan-expose-construct-creation-in-codec/plan.probe.md
# -> any pass/fail mismatch between steps 3 and 4 reproduces it

# 5. Round trip: format with the binary that passed, then check with the other
npx prettier --write <probe-from-the-passing-root>
cd checkouts/art-md && npx prettier --check <probe>

# 6. Output diff of the two binaries on one file
npx prettier <probe> | diff <probe> -

# 7. Prescribed fixers per guide, then clean up
cd $WORKSPACE/checkouts/art-md && npm run lint:fix && npm run lint
rm checkouts/art-md/_backlog/3-now/plan-expose-construct-creation-in-codec/plan.probe.md
```

## PENDING

- **Adopt `@art-lib/logger` and retire the local copy** — `cli/bin/src/private/logger/createLogger.ts` duplicates the package (it carries its own `setVerbosity()` rather than `setOutputMode()`) and repeats its defect: `quiet` **discards** the buffer instead of flushing it, so a warning logged before the mode was set is never written — `createLogger.test.ts` asserts precisely that ("GIVEN a quiet output mode set after logging, drops the buffer"). `@art-lib/logger@0.0.1` is published, `0.0.2` adds the `normal` mode, and every mode there flushes then filters, so adopting it removes the bug and lets `cli/bin/knowledge/design/operations.md` (which documents "`quiet` discards the buffered operations") be corrected in the same pass. Same shape as the adoption Art Works already landed in `bf2fc78`; art-lib tracks the source package as `Plan: Add Logger Package` (`$ART_LIB/_backlog/3-now/plan-add-logger/plan.md`).
- **Ops: Package Records Dependencies** — add `dependencies` back to package records, generate a dependencies.md file in knowledge with graph of internal packages and list of external runtime deps.
- **Routine: Knowledge Files** — There is a draft for 3 different types os files in `knowledge/_routines/draft-knowledge-file.md` - abstract, deduplicate, compact and publish to `art-domains`. All useful routines (along with other architect tasks) to expose in a skill. Eventually, an abstract slice of reusable code, belongs in the knowledge domain.

## BLOCKER

None.

---

## Follow-ups

None.
