# Instructions: `reword-round-trip-claims`

**Plan:** `drop-kind-and-reword-claims`

**Iteration Id:** `reword-round-trip-claims`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-drop-kind-and-reword-claims/instructions/reword-round-trip-claims__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `reword-round-trip-claims`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path              | Purpose                                |
| -------------- | -------------------------- | -------------------------------------- |
| `$WORKSPACE`   | Current working directory  | Workspace root; run `npm ci` here.     |
| `$PROJECT`     | Provided with prompt       | Where work execution is taking place.  |
| `$CODEC_TESTS` | `$PROJECT/cli/codec-tests` | Round-trip fixture harness.            |
| `$SPEC`        | `$PROJECT/spec`            | The artificial language specification. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `reword-round-trip-claims`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Every live claim states structural fidelity, not byte-identity or losslessness: the codec preserves all valid Markdown structure; extraneous whitespace (blank-line runs, trailing spaces, CRLF, heading indentation) is normalised to canonical Markdown per CommonMark by the `unified` substrate; serialisation enforces exactly one final newline. Verified: `"# One\n\n\n\n# Two\n"` serialises to `"# One\n\n# Two\n"`. The ADR gains this decision (it makes no fidelity claim today), and the fixture suite is labelled for what it is: byte-equality against canonically-authored fixtures.

## Mandatory Reading

- The round-trip decisions this iteration records: `$PROJECT/knowledge/adr/art-md.md`
- Harness and fixture anatomy: `$PROJECT/knowledge/design/art-md-fixture-tests.md`
- Conventions: TypeScript – `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

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

From `$CODEC_TESTS`:

```bash
npm run test # test-parser (snapshot equality) + test-serializer (serialised diff)
```

Expect 43/43 on both suites; the serializer line for each fixture now reads `CANONICAL ROUNDTRIP {fixture}`.

### Verifying Completion

**Purpose:** Confirms the work item completed satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, build and test
```

---

## Changes

Summary of changes: record the structural-fidelity decision in the ADR, reword the harness label and the design-doc description, soften the spec claim on `NaturalBlock.value`, and sweep for leftovers.

- Step 1 / 5 — Add the structural-fidelity decision to `adr/art-md.md`
- Step 2 / 5 — Reword the harness label in `diffFixtureResults.ts`
- Step 3 / 5 — Note canonical-input equality in `art-md-fixture-tests.md`
- Step 4 / 5 — Reword the `lossless round-trip` claim in `natural-block.art` and sweep for leftovers
- Step 5 / 5 — Commit `reword-round-trip-claims`

## Steps

### Step `1 / 5` — Add the structural-fidelity decision to `adr/art-md.md`

Goal: the round-trip guarantee is a recorded decision, checkable against the substrate's behaviour.

Append a decision entry to `$PROJECT/knowledge/adr/art-md.md`, following the file's existing entry shape (Decision / Status / Context / Decision / Consequences):

- **Decision:** Round-Trip Fidelity Is Structural — **Status:** Adopted.
- **Context:** Claims of byte-identity or lossless round-trip overstate the guarantee. Probes show the codec normalises whitespace: blank-line runs collapse, trailing spaces strip, CRLF becomes LF, heading indentation canonicalises, a missing final newline is added.
- **Decision:** The codec preserves all valid Markdown structure. Extraneous whitespace and invalid syntax are normalised to canonical Markdown per CommonMark by the `unified` substrate (`mdast-util-from-markdown` / `mdast-util-to-markdown`), and serialisation enforces exactly one final newline. Verified: `"# One\n\n\n\n# Two\n"` serialises to `"# One\n\n# Two\n"`.
- **Consequences:** Consumers needing byte-identity must retain the original content — the records layer line-splices content strings and never re-emits untouched text through the codec. The fixture corpus under `$PROJECT/libs/constructs/test/fixtures/` is authored in canonical form, so the suite verifies byte-equality for canonical input only.

### Step `2 / 5` — Reword the harness label in `diffFixtureResults.ts`

Goal: the suite's own output stops claiming losslessness.

In `$CODEC_TESTS/scripts/test/serializer/diffFixtureResults.ts`, replace the success line:

```ts
console.info(`LOSSLESS ROUNDTRIP ${baseName}`);
```

with:

```ts
console.info(`CANONICAL ROUNDTRIP ${baseName}`);
```

The failure line (`ROUNDTRIP DIFF ...`) and the rest of the file stay unchanged. Nothing else in the repository asserts on the old label (verified at planning time).

### Step `3 / 5` — Note canonical-input equality in `art-md-fixture-tests.md`

Goal: the harness doc states what the serializer check actually compares.

In `$PROJECT/knowledge/design/art-md-fixture-tests.md`, in the `Overview` section, add one short paragraph after the two-script diagram: the serializer check compares serialised output against the source **byte-for-byte**, which holds because fixtures are authored in canonical form; a source outside canonical form is normalised per CommonMark (blank-line runs, trailing spaces, CRLF, heading indentation, final newline) — see the Round-Trip Fidelity decision in `$PROJECT/knowledge/adr/art-md.md`.

### Step `4 / 5` — Reword the `lossless round-trip` claim in `natural-block.art` and sweep for leftovers

1. In `$SPEC/grammar/constructs/structural/natural-block.art`, in the Schema block, change:

   ```
   value: string              // raw markdown content (lossless round-trip)
   ```

   to:

   ```
   value: string              // raw markdown content, captured verbatim from the source
   ```

2. Sweep for remaining live claims:

   ```bash
   grep -rn -i "lossless\|byte-identical\|byte-exact" $PROJECT/knowledge $PROJECT/libs $PROJECT/cli $SPEC --include='*.md' --include='*.ts' --include='*.art'
   ```

   Expected: matches only in historical material (`_backlog/0-archive/**`, `_backlog/1-done/**`, `CHANGELOG.md`) — archived history MUST NOT be edited. Every live match is either fixed by this iteration or reported in your report with the reason it was left.

### Step `5 / 5` — Commit `reword-round-trip-claims`

Execute the commit defined below, then continue to the Final Verification.

---

#### Commit: `reword-round-trip-claims`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
docs(art-md): Reword round-trip claims to structural fidelity.

- Add the structural-fidelity decision to `adr/art-md.md`; normalisation is CommonMark.
- Label the fixture suite `CANONICAL ROUNDTRIP` in the harness and design doc.
- Reword the `lossless round-trip` claim in `natural-block.art`.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and not pushed, according to the commit's policy (`NOPUSH`).
- Verify `adr/art-md.md` records the structural-fidelity decision with the verified normalisation example.
- Verify the harness prints `CANONICAL ROUNDTRIP` and the design doc describes canonical-input byte-equality.
- Verify no live doc, spec, or script claims lossless or byte-identical round-trip outside archived history.
- Verify from `$CODEC_TESTS` that `npm run test` still passes 43/43.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
