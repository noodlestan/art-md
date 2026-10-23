# Plan: Drop Kind and Reword Claims

**ID:** `drop-kind-and-reword-claims`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Eliminate `kind` as an internal feature of Art MD — code, docs, and language spec — and reword the round-trip claim to what the codec actually guarantees: structural fidelity.

**Description:** The parser currently splits a heading `## Kind: Name` into a `kind` and a `name`, and the serializer then drops `kind` on write — verified: a fixture heading `## Module: Greeting` round-trips to `## Greeting`, losing text. The fix is not to emit `kind` correctly; the fix is to remove the concept. After this plan, a section's name is the whole heading text — `## Checkout: Art Work` is one section named `Checkout: Art Work`, and Art MD never splits it. Records-layer consumers that treat headings as `Kind: Name` do that parsing themselves, downstream. The work is deletion: the `kind` field, the kind-split in the parser, `KIND_PATTERN`, and every doc, record, and spec statement that presents `kind` as a language feature — except where the spec discusses Resources or other higher-level concepts, whose material partly belongs to other packages. Alongside it, the round-trip claim is softened: the codec preserves all valid Markdown structure, and normalises extraneous whitespace (blank-line runs, trailing spaces, CRLF, heading indentation) and enforces a final newline — behaviour of our `unified` substrate (`mdast-util-from-markdown` / `mdast-util-to-markdown`) per CommonMark. We claim structural round-trip safety, not byte-identity.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable              | Resolved Path                          | Purpose                                                                  |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `$WORKSPACE`          | Current working directory              | Workspace root directory.                                                |
| `$PROJECT`            | Provided with prompt.                  | Checkout for Art MD implementation.                                      |
| `$ART_JS`             | `$WORKSPACE/checkouts/art-js-planning` | Whiteboard owner (live board); both contracts `AGREED` (2026-10-16).     |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs`             | Library owning the `SectionBlock` model and its knowledge.               |
| `$CODEC_TESTS`        | `$PROJECT/tests/codec`                 | Round-trip fixture harness (corpus in `libs/constructs/test/fixtures/`). |
| `$SPEC`               | `$PROJECT/spec`                        | The artificial language specification.                                   |

## Summary

Delete `kind` from the constructs model, parser, and serializer; sweep `kind` out of docs, records, and the language spec (keeping Resource/higher-level discussions); reword the round-trip claim to structural fidelity. The regression guard is a heading sneaked into an existing fixture — no new fixture, no new test.

## Context

### Upstream Work

| Kind       | Path                                                       | Role                                                                                                                                                         |
| ---------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Milestone  | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md` | Coordinates this plan; the round-trip claim is codec-domain.                                                                                                 |
| Whiteboard | `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`    | Both my contracts were re-proposed to match this plan and are now `AGREED` — `ART_LIB` signed 2026-10-16. Live board lives in `$ART_JS`'s planning checkout. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                                 | Description                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating. |
| Domain: Packages `$DOMAINS/packages/index.md` | Represents publishable libraries and CLIs.                                   |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — project operations and verification. Relevant for Setting Up, Verifying Step, Verifying Completion.
::READ `$PROJECT/knowledge/design/art-md-fixture-tests.md` (Knowledge) — fixture anatomy; the harness this plan uses as its guard. Relevant for Refactoring.
::READ `$PROJECT/knowledge/adr/art-md.md` (Knowledge) — the round-trip decisions this plan rewords. Relevant for Refactoring.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — TypeScript conventions for the code changes. Relevant for Refactoring.

_Note: the unit-test conventions package declared in `$PROJECT/_guide.md` (`@noodlestan/conventions-unit-tests`) is not installed — no directive references it._

## Scope

Locate and eliminate `kind` as an internal feature of `@art-md`, and reword the round-trip claim. No new constructs; no new fixtures; no new tests beyond pinning the normalisation the reworded claim describes.

### (Scope) Package: Constructs

**Record:** `$PROJECT/libs/constructs/_records/package.art`

**Role:** Owns the `SectionBlock` model, its parser, and its serializer.

**Partial:**

- `owner` — Project: Art MD
- `canonicalName` — `@art-md/constructs`

**Changes:**

- Delete `kind?: string` from the `SectionBlock` type and from `SectionBlockFactoryData`; delete the `kind` handling in `createSectionBlock`.
- Delete the kind-split in `createSectionBlockFromNode` — the section name becomes the whole heading text — and delete `KIND_PATTERN` with it.
- Confirm `createSectionBlockToMdast` emits `# ${name}` with no kind logic, so full-text names round-trip verbatim.
- Delete or reword the parser/constructs tests and mocks that assert `kind`.

**Dependencies:**

- None.

### (Scope) Knowledge and Spec

**Partial:**

- `canonicalName` — `@art-md/spec`

**Changes:**

- Remove `kind` from the `SectionBlock` samples in `$PROJECT/libs/constructs/knowledge/factories.md` and `parsers.md` (verified: `api.md` carries no `kind`) and from every knowledge document that presents it as a language feature.
- Remove `kind` from the grammar spec (`$PROJECT/spec/grammar/**` — only `constructs/structural/section-block.art` carries it); **keep** resource discussions where the spec treats higher-level concepts.
- Reword the round-trip claim everywhere it appears live: structural fidelity, not byte-identical or lossless; attribute whitespace normalisation to CommonMark and the `unified` substrate. Archived milestones stay untouched — historical record.

**Dependencies:**

- Iteration `delete-kind-from-code` — docs describe the code after it changes, not before.

### (Scope) Package: Codec Tests

**Record:** `$PROJECT/tests/codec/_records/package.art`

**Role:** Owns the fixture harness that guards the deletion.

**Changes:**

- Execution sneaks a `## Module: Greeting` heading into the existing fixture `010-section-block-simple.md` — the silent regression, no new fixture. The corpus lives at `$PROJECT/libs/constructs/test/fixtures/`; the harness scripts live at `$CODEC_TESTS/scripts/test/`. After deletion its snapshot regenerates with no `kind` field and the section name `Module: Greeting`, and `test-serializer` must reproduce the heading byte-for-byte. No other numbered fixture carries a `Kind: Name`-shaped heading (verified), so `010` is the only snapshot that changes.
- All fixtures stay `LOSSLESS ROUNDTRIP`.

**Dependencies:**

- Iteration `delete-kind-from-code`.

## Work

### Next

All three iterations are `DONE`: `delete-kind-from-code` (`9567358`), `delete-kind-from-docs-and-spec` (`78f0e02`), `reword-round-trip-claims` (`b56d759`) — all `NOPUSH`, local `main` 3 commits ahead of `origin/main`. Remaining: push decision, and the `@art-md/constructs` release that unblocks `ART_JS`'s `implement-record-model` on the Art Records whiteboard.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write a message following: `{Type}({Scope}): {Description}.` max 120 chars, optionally followed by up 3 bullet points, max 100 chars each.

### Verifying Step

**Purpose:** Confirms a step is correct before continuing. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-step/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

From `$PROJECT/tests/codec/`:

```bash
npm run test # test-parser (snapshot equality) + test-serializer (lossless diff)
```

Today `createSectionBlockToMdast` emits `# ${name}` only, so a heading carrying a `Kind: Name`-shaped prefix loses the prefix on write. After iteration 1 the parser no longer splits headings, the fixture's snapshot regenerates without `kind`, and both suites pass 43/43.

### Verifying Completion

**Purpose:** Confirms the work item completed satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, build and test
```

---

## Items:

| Iteration / Instructions                                                                     | Status |
| -------------------------------------------------------------------------------------------- | ------ |
| Iteration: Delete Kind From Code `./instructions/delete-kind-from-code.md`                   | `DONE` |
| Iteration: Delete Kind From Docs and Spec `./instructions/delete-kind-from-docs-and-spec.md` | `DONE` |
| Iteration: Reword Round-Trip Claims `./instructions/reword-round-trip-claims.md`             | `DONE` |

### Iteration: Delete Kind From Code

**Id:** `delete-kind-from-code`

**Status:** `DONE`

**Report:** `./instructions/delete-kind-from-code__report.md`

**Purpose:** A heading's text is never split; the section name is the whole heading.

**Description:** Remove `kind` from the model, the parser, and the factory. The serializer already emits `# ${name}` with no kind logic, so full-text names round-trip once the parser stops splitting. Regenerate the kind fixture's snapshot: no `kind` field, name `Module: Greeting`, and `test-serializer` reproduces `## Module: Greeting` verbatim.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/delete-kind-from-code.md`

**Changes:**

- Delete `kind?: string` from `SectionBlock` (`src/factories/constructs/SectionBlock/types.ts`), from `SectionBlockFactoryData` (`factory/types.ts`), and its handling in `createSectionBlock`.
- Delete the kind-split in `createSectionBlockFromNode` — name is the raw heading text after tag extraction.
- Delete `KIND_PATTERN` (`src/parser/constructs/SectionBlock/private/constants.ts`) and its `constants.test.ts`.
- Update tests and helpers asserting `kind`: `createSectionBlockFromNode.test.ts` (kind case → whole-text name), `createSectionBlock.test.ts`, `makeSectionBlockFixture.ts`.
- Sneak `## Module: Greeting` into `libs/constructs/test/fixtures/010-section-block-simple.md`, regenerate its snapshot (`test-parser --fixture 010 --write`), and run `npm run test` from `$CODEC_TESTS` — expect 43/43.

**Dependencies:** None.

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ----------------------- | ------------------------------ | -------- | --------- | ----------- |
| `delete-kind-from-code` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | `9567358` | `COMMITTED` |

### Iteration: Delete Kind From Docs and Spec

**Id:** `delete-kind-from-docs-and-spec`

**Status:** `DONE`

**Report:** `./instructions/delete-kind-from-docs-and-spec__report.md`

**Purpose:** No doc or spec presents `kind` as a language feature.

**Description:** Sweep knowledge, records, guides, and the grammar spec. Keep resource discussions where the spec treats higher-level concepts — that material partly belongs to other packages.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/delete-kind-from-docs-and-spec.md`

**Changes:**

- Remove `kind` from the `SectionBlock` samples in `libs/constructs/knowledge/factories.md` and `parsers.md` (`api.md` verified clean — no change).
- Remove `kind` from `spec/grammar/constructs/structural/section-block.art` — the only spec file carrying it; keep resource/higher-level discussions intact.
- Sweep-verify no live doc, record, or README names `kind` as part of the language; archived material and CHANGELOGs stay untouched.

**Dependencies:**

- Iteration `delete-kind-from-code`.

#### Commits:

| ID                               | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `delete-kind-from-docs-and-spec` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | `78f0e02` | `COMMITTED` |

### Iteration: Reword Round-Trip Claims

**Id:** `reword-round-trip-claims`

**Status:** `DONE`

**Report:** `./instructions/reword-round-trip-claims__report.md`

**Purpose:** Every live claim states structural fidelity, not byte-identity.

**Description:** Rewrite the round-trip claim to: the codec preserves all valid Markdown structure; extraneous whitespace (blank-line runs, trailing spaces, CRLF, heading indentation) and invalid syntax are normalised to canonical Markdown by the `unified` substrate per CommonMark, and serialisation enforces exactly one final newline. Verified today: `"# One\n\n\n\n# Two\n"` → `"# One\n\n# Two\n"`; trailing spaces stripped; CRLF→LF; `#   Hello` → `# Hello`; a source without final newline gains one. Known prior art: `implement-serialize-command__report.md` already recorded "the roundtrip is not byte-exact". The ADR makes no fidelity claim today — the decision is recorded there, not reworded.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/reword-round-trip-claims.md`

**Changes:**

- Add the structural-fidelity decision to `knowledge/adr/art-md.md` (no claim exists to reword), with the verified normalisation example.
- Reword the harness label `LOSSLESS ROUNDTRIP` → `CANONICAL ROUNDTRIP` in `tests/codec/scripts/test/serializer/diffFixtureResults.ts`, and describe canonical-input byte-equality in `knowledge/design/art-md-fixture-tests.md`.
- Reword the `(lossless round-trip)` claim on `NaturalBlock.value` in `spec/grammar/constructs/structural/natural-block.art`; sweep for leftovers.
- Leave archived milestones, `_backlog` archives, and CHANGELOGs untouched.

**Dependencies:**

- Iteration `delete-kind-from-code`.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `reword-round-trip-claims` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | `b56d759` | `COMMITTED` |

---

## Coordination

### Not In Scope

- **Downstream `Kind: Name` parsing** — records-layer consumers parse heading text themselves; that is their domain, not the codec's.
- **Removing extraneous-whitespace normalisation** — it is correct CommonMark behaviour from `unified`; we describe it, we do not undo it.
- **New constructs** — `milestone-art-constructs` owns those.
- **Amending whiteboard contracts** — discharged: `ART_JS` amended both `@art-md` contracts on their turn; both are now `AGREED` (`ART_LIB` signed 2026-10-16).

### Evidence

- Kind loss, verified by temporarily extending `010-section-block-simple.md` with `## Module: Greeting` (change not kept): `test-serializer` reported `ROUNDTRIP DIFF 010-section-block-simple.md: 1 line(s) differ — L3: expected "## Module: Greeting" actual "## Greeting"`. The parser captures `kind: "Module"` correctly; the serializer drops it. The other 42 fixtures were lossless throughout.
- The serializer already emits `# ${name}` with no kind branch — deletion of the parser split is sufficient.
- Whitespace is not preserved, verified by probe: blank-line runs collapse; trailing/leading blanks drop; `#   Hello   World` → `# Hello   World`; CRLF→LF; missing final newline added by `mdast-util-to-markdown` through `serialize`.
- The harness was never the gap: `diffFixtureResults` genuinely diffs serialised output against source; the other 42 fixtures pass only because they are authored in canonical form.

### Findings

- `kind` is structural only in the parser's imagination — the serializer never emits it, so the concept survives on read and dies on write. Removing it costs one field, one split, one pattern, and a doc sweep.
- The sneaked-in `## Module: Greeting` heading is the whole regression: it must survive byte-for-byte as a plain heading, which is also what makes the parser snapshot regenerate cleanly.
- `kind` touches only `@art-md/constructs` — parser, serializer, primitives, codec, and bin sources are clean (verified 2026-10-17).
- Corpus and harness live apart: fixtures in `libs/constructs/test/fixtures/`, harness scripts in `tests/codec/scripts/test/`; only fixture `010` needs a snapshot regeneration.
- Doc surfaces differ from the original draft: `api.md` carries no `kind`; the live samples are in `factories.md` and `parsers.md`. The ADR makes no fidelity claim — the reword is a new decision entry.
- Iteration `delete-kind-from-code` finding: a checkout-local `npm ci` inside `$PROJECT` is required — the workspace-root `npm ci` installs only the meta-repo, and a stale `@noodlestan/tsconfig` in the checkout broke every vitest run until reinstalled (pre-existing, verified by stash).
- Iteration `delete-kind-from-docs-and-spec` finding: the only remaining `Kind` mention in live spec is the deliberate downstream note in the rewritten `section-block.art` Description; the stale `(e.g. KIND_PATTERN)` example in `parsers.md` was dropped because the constant no longer exists.

### Decisions

- **The section name is the full heading text** — Art MD never splits `## Something: Else`; downstream records layers do their own `Kind: Name` interpretation.
- **Deletion, not emission** — no serializer change is required; the fix removes code.
- **Regression by existing fixture** — the kind heading is sneaked into `010-section-block-simple.md`; no new fixture, no new test.
- **Claim wording follows Markdown semantics + `unified`** — normalisation is attributed to CommonMark and the substrate libraries, so the claim is checkable.
- **Harness label reworded, not the check** — the suite keeps byte-equality against canonically-authored fixtures; only the `LOSSLESS ROUNDTRIP` success line becomes `CANONICAL ROUNDTRIP`.

### Knowledge to Update

- `$PROJECT/knowledge/adr/art-md.md` — record Decision: Round-Trip Fidelity Is Structural (no fidelity claim exists today to reword).
- `$PROJECT/knowledge/design/art-md-fixture-tests.md` — describe the serializer check as canonical-input byte-equality.
- `$PROJECT/libs/constructs/knowledge/factories.md` and `parsers.md` — drop `kind` from the samples.
- `$PROJECT/spec/grammar/constructs/structural/section-block.art` — grammar without `kind`; `$PROJECT/spec/grammar/constructs/structural/natural-block.art` — soften the `lossless round-trip` claim.

### Follow Ups

- **Downstream adaptation tracked on the whiteboard** — `ART_JS` records dropped `kind` entirely (MANAGEMENT decision, 2026-10-14): `ArtRecord{name}` is the whole heading text, records parses nothing, and heading interpretation moves to a consumer-side resources layer. Nothing owed by this plan beyond landing the deletion — this plan is what enables that design.

### Feedback

- None.
