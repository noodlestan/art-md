# Plan: Drop Kind and Reword Claims

**ID:** `drop-kind-and-reword-claims`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Eliminate `kind` as an internal feature of Art MD — code, docs, and language spec — and reword the round-trip claim to what the codec actually guarantees: structural fidelity.

**Description:** The parser currently splits a heading `## Kind: Name` into a `kind` and a `name`, and the serializer then drops `kind` on write — verified: a fixture heading `## Module: Greeting` round-trips to `## Greeting`, losing text. The fix is not to emit `kind` correctly; the fix is to remove the concept. After this plan, a section's name is the whole heading text — `## Checkout: Art Work` is one section named `Checkout: Art Work`, and Art MD never splits it. Records-layer consumers that treat headings as `Kind: Name` do that parsing themselves, downstream. The work is deletion: the `kind` field, the kind-split in the parser, `KIND_PATTERN`, and every doc, record, and spec statement that presents `kind` as a language feature — except where the spec discusses Resources or other higher-level concepts, whose material partly belongs to other packages. Alongside it, the round-trip claim is softened: the codec preserves all valid Markdown structure, and normalises extraneous whitespace (blank-line runs, trailing spaces, CRLF, heading indentation) and enforces a final newline — behaviour of our `unified` substrate (`mdast-util-from-markdown` / `mdast-util-to-markdown`) per CommonMark. We claim structural round-trip safety, not byte-identity.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path               | Purpose                                                 |
| ------------ | --------------------------- | ------------------------------------------------------- |
| `$WORKSPACE` | Current working directory   | Workspace root directory.                               |
| `$PROJECT`   | `checkouts/art-md-planning` | Checkout for Art MD implementation.                     |
| `$ART_JS`    | `checkouts/art-js-planning` | Whiteboard owner; contracts need amending (Follow Ups). |

## Summary

Delete `kind` from the constructs model, parser, and serializer; sweep `kind` out of docs, records, and the language spec (keeping Resource/higher-level discussions); reword the round-trip claim to structural fidelity. The regression guard is a heading sneaked into an existing fixture — no new fixture, no new test.

## Context

### Upstream Work

| Kind       | Path                                                       | Role                                                                                                  |
| ---------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Milestone  | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md` | Coordinates this plan; the round-trip claim is codec-domain.                                          |
| Whiteboard | `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`    | My contracts there describe `kind` and byte-identity; both now wrong — amend on my turn (Follow Ups). |

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

- Remove `kind` from the `SectionBlock` shape in `$PROJECT/libs/constructs/knowledge/api.md` and from every knowledge document that presents it as a language feature.
- Remove `kind` from the grammar spec (`$PROJECT/spec/grammar/**`); **keep** `## Kind: Name` where the spec describes Resources or other higher-level concepts.
- Reword the round-trip claim everywhere it appears live: structural fidelity, not byte-identical or lossless; attribute whitespace normalisation to CommonMark and the `unified` substrate. Archived milestones stay untouched — historical record.

**Dependencies:**

- Iteration `delete-kind-from-code` — docs describe the code after it changes, not before.

### (Scope) Package: Codec Tests

**Record:** `$PROJECT/cli/codec-tests/_records/package.art`

**Role:** Owns the fixture harness that guards the deletion.

**Changes:**

- Execution sneaks a `## Module: Greeting` heading into the existing fixture `010-section-block-simple.md` — the silent regression, no new fixture. After deletion its snapshot regenerates with no `kind` field and the section name `Module: Greeting`, and `test-serializer` must reproduce the heading byte-for-byte.
- All fixtures stay `LOSSLESS ROUNDTRIP`.

**Dependencies:**

- Iteration `delete-kind-from-code`.

## Work

### Next

Write the instructions for iteration `delete-kind-from-code`.

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

From `$PROJECT/cli/codec-tests/`:

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

| Iteration / Instructions                  | Status     |
| ----------------------------------------- | ---------- |
| Iteration: Delete Kind From Code          | `PLANNING` |
| Iteration: Delete Kind From Docs and Spec | `PLANNING` |
| Iteration: Reword Round-Trip Claims       | `PLANNING` |

### Iteration: Delete Kind From Code

**Id:** `delete-kind-from-code`

**Status:** `PLANNING`

**Purpose:** A heading's text is never split; the section name is the whole heading.

**Description:** Remove `kind` from the model, the parser, and the factory. The serializer already emits `# ${name}` with no kind logic, so full-text names round-trip once the parser stops splitting. Regenerate the kind fixture's snapshot: no `kind` field, name `Module: Greeting`, and `test-serializer` reproduces `## Module: Greeting` verbatim.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Delete `kind?: string` from `SectionBlock` (`src/factories/constructs/SectionBlock/types.ts`), from `SectionBlockFactoryData`, and its handling in `createSectionBlock`.
- Delete the kind-split in `createSectionBlockFromNode` — name is the raw heading text after tag extraction.
- Delete `KIND_PATTERN` (`src/parser/constructs/SectionBlock/private/constants.ts`).
- Delete or reword tests and mocks asserting `kind` (e.g. `createSectionBlockFromNode.test.ts`'s "heading declares a kind" case).
- Regenerate `010-section-block-simple.md.json`; run `npm run test` from `$PROJECT/cli/codec-tests/` — expect 43/43 `LOSSLESS ROUNDTRIP`.

**Dependencies:** None.

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ----------------------- | ------------------------------ | -------- | ----- | ---------- |
| `delete-kind-from-code` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | (TBD) | `AUTHORED` |

### Iteration: Delete Kind From Docs and Spec

**Id:** `delete-kind-from-docs-and-spec`

**Status:** `PLANNING`

**Purpose:** No doc or spec presents `kind` as a language feature.

**Description:** Sweep knowledge, records, guides, and the grammar spec. Keep `## Kind: Name` where the spec discusses Resources or other higher-level concepts — that material partly belongs to other packages.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Remove `kind` from the `SectionBlock` shape in `libs/constructs/knowledge/api.md` and any other knowledge statement of the model.
- Remove `kind` from `$PROJECT/spec/grammar/**`; keep Resource/higher-level `Kind: Name` discussions intact.
- Scan and reword every live doc, record, and README that names `kind` as part of the language.

**Dependencies:**

- Iteration `delete-kind-from-code`.

#### Commits:

| ID                               | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| -------------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `delete-kind-from-docs-and-spec` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | (TBD) | `AUTHORED` |

### Iteration: Reword Round-Trip Claims

**Id:** `reword-round-trip-claims`

**Status:** `PLANNING`

**Purpose:** Every live claim states structural fidelity, not byte-identity.

**Description:** Rewrite the round-trip claim to: the codec preserves all valid Markdown structure; extraneous whitespace (blank-line runs, trailing spaces, CRLF, heading indentation) and invalid syntax are normalised to canonical Markdown by the `unified` substrate per CommonMark, and serialisation enforces exactly one final newline. Verified today: `"# One\n\n\n\n# Two\n"` → `"# One\n\n# Two\n"`; trailing spaces stripped; CRLF→LF; `#   Hello` → `# Hello`; a source without final newline gains one. Known prior art: `implement-serialize-command__report.md` already recorded "the roundtrip is not byte-exact".

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Reword live claims in `knowledge/adr/art-md.md`, `knowledge/design/art-md-fixture-tests.md` ("lossless" → canonical-input lossless), `knowledge/components.md`, `knowledge/index.md`, and whatever the scan adds.
- Leave archived milestones untouched.

**Dependencies:**

- Iteration `delete-kind-from-code`.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| -------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `reword-round-trip-claims` | Art MD / `$PROJECT` / `main`   | `NOPUSH` | (TBD) | `AUTHORED` |

---

## Coordination

### Not In Scope

- **Downstream `Kind: Name` parsing** — records-layer consumers parse heading text themselves; that is their domain, not the codec's.
- **Removing extraneous-whitespace normalisation** — it is correct CommonMark behaviour from `unified`; we describe it, we do not undo it.
- **New constructs** — `milestone-art-constructs` owns those.
- **Amending whiteboard contracts** — needs my turn on `$ART_JS`'s board; recorded in Follow Ups.

### Evidence

- Kind loss, verified by temporarily extending `010-section-block-simple.md` with `## Module: Greeting` (change not kept): `test-serializer` reported `ROUNDTRIP DIFF 010-section-block-simple.md: 1 line(s) differ — L3: expected "## Module: Greeting" actual "## Greeting"`. The parser captures `kind: "Module"` correctly; the serializer drops it. The other 42 fixtures were lossless throughout.
- The serializer already emits `# ${name}` with no kind branch — deletion of the parser split is sufficient.
- Whitespace is not preserved, verified by probe: blank-line runs collapse; trailing/leading blanks drop; `#   Hello   World` → `# Hello   World`; CRLF→LF; missing final newline added by `mdast-util-to-markdown` through `serialize`.
- The harness was never the gap: `diffFixtureResults` genuinely diffs serialised output against source; the other 42 fixtures pass only because they are authored in canonical form.

### Findings

- `kind` is structural only in the parser's imagination — the serializer never emits it, so the concept survives on read and dies on write. Removing it costs one field, one split, one pattern, and a doc sweep.
- The sneaked-in `## Module: Greeting` heading is the whole regression: it must survive byte-for-byte as a plain heading, which is also what makes the parser snapshot regenerate cleanly.

### Decisions

- **The section name is the full heading text** — Art MD never splits `## Something: Else`; downstream records layers do their own `Kind: Name` interpretation.
- **Deletion, not emission** — no serializer change is required; the fix removes code.
- **Regression by existing fixture** — the kind heading is sneaked into `010-section-block-simple.md`; no new fixture, no new test.
- **Claim wording follows Markdown semantics + `unified`** — normalisation is attributed to CommonMark and the substrate libraries, so the claim is checkable.

### Knowledge to Update

- `$PROJECT/knowledge/adr/art-md.md` — round-trip decision reworded to structural fidelity; no `kind` in the model.
- `$PROJECT/knowledge/design/art-md-fixture-tests.md` — "lossless" labelled canonical-input lossless.

### Follow Ups

- **Amend my whiteboard contracts** (`$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`, Contracts → `@art-md`): the shape freeze lists `SectionBlock{... kind? ...}` and the round-trip bullet promises byte-identical — both now wrong. Requires my turn; flag to the pen-holder.
- **Downstream plans assume `kind`** — at least one records-layer plan bridges `ArtRecord{kind, name}` from `SectionBlock`; after this plan that bridge must parse the heading text itself. Their owners re-baseline; not my edit.

### Feedback

- None.
