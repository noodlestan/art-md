# Instructions: `delete-kind-from-docs-and-spec`

**Plan:** `drop-kind-and-reword-claims`

**Iteration Id:** `delete-kind-from-docs-and-spec`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-drop-kind-and-reword-claims/instructions/delete-kind-from-docs-and-spec__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `delete-kind-from-docs-and-spec`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable              | Resolved Path              | Purpose                                        |
| --------------------- | -------------------------- | ---------------------------------------------- |
| `$WORKSPACE`          | Current working directory  | Workspace root; run `npm ci` here.             |
| `$PROJECT`            | Provided with prompt       | Where work execution is taking place.          |
| `$PACKAGE_CONSTRUCTS` | `$PROJECT/libs/constructs` | Knowledge documents of the constructs package. |
| `$SPEC`               | `$PROJECT/spec`            | The artificial language specification.         |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `delete-kind-from-docs-and-spec`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

No knowledge document and no spec file presents `kind` as a language feature of Art MD. Docs describe the code after iteration `delete-kind-from-code`: a heading's text is never split; the section name is the whole heading text. Where the spec discusses resources as a higher-level concept, the discussion stays — only the claim that the _construct_ parses `kind` is removed.

## Mandatory Reading

- Project operations: `$PROJECT/_guide.md`
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

### Verifying Completion

**Purpose:** Confirms the work item completed satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, build and test
```

---

## Changes

Summary of changes: remove `kind` from the constructs knowledge samples and rewrite the `SectionBlock` grammar spec without it.

- Step 1 / 4 — Remove `kind` from the samples in `factories.md` and `parsers.md`
- Step 2 / 4 — Rewrite `section-block.art` without `kind`
- Step 3 / 4 — Sweep-verify: no live doc or spec presents `kind` as a language feature
- Step 4 / 4 — Commit `delete-kind-from-docs-and-spec`

## Steps

### Step `1 / 4` — Remove `kind` from the samples in `factories.md` and `parsers.md`

Goal: the knowledge samples match the code after iteration `delete-kind-from-code`.

1. In `$PACKAGE_CONSTRUCTS/knowledge/factories.md`:
   - In the `SectionBlockFactoryData` sample, delete the line `kind?: string;`.
   - In the `createSectionBlock` sample, delete the line `if (data.kind) section.kind = data.kind;`.
2. In `$PACKAGE_CONSTRUCTS/knowledge/parsers.md`, in "Scenario 4: Parsing Trailing Tags with `extractTags`":
   - Delete the sample line `const kindMatch = stripped.match(KIND_PATTERN);`.
   - In the sample's `createSectionBlock({...})` call, replace `name: kindMatch?.[2]?.trim() ?? stripped,` with `name: stripped,` and delete the line `kind: kindMatch?.[1],`.
   - The lead sentence ("uses the stripped text for the section name") stays — it is now literally true.
3. In `$PACKAGE_CONSTRUCTS/knowledge/parsers.md`, in "Choosing Hooks for a New Construct", change the bullet `**Nests by a hierarchy (depth / kind)**` to `**Nests by a hierarchy (depth)**`.

### Step `2 / 4` — Rewrite `section-block.art` without `kind`

Goal: the grammar spec describes the construct as it is implemented — one name, whole heading text.

In `$SPEC/grammar/constructs/structural/section-block.art`:

1. **Purpose:** replace "a named, kinded resource" with "a named section" — keep the resource-declaration framing: `Capture named sections — the key construct that turns a markdown heading into a named resource that modules can reference, index, and project.`
2. **Description:** reword to: the heading text is the section name, taken verbatim after tag extraction — `# Checkout: Art Work` names one section `Checkout: Art Work`, and the construct never splits the text. Keep the closing framing (the grammar fixes the form; the meaning of each resource is provided by the structures — closed syntax, open semantics) but drop every claim that the grammar fixes an optional kind. Higher layers that interpret headings as `Kind: Name` resources do that parsing themselves, downstream.
3. **Schema:** delete the line `kind?: string          // optional; present when heading has "Kind: Name" form` and change the `name` comment to `// section name: the whole heading text, tags stripped`.
4. **Syntax:** replace the two forms with the single form:

   ```art
   <SectionBlock> =
       # <name> [<Tags>]
       <NaturalBlock>
   ```

5. **Rules:** change `A SectionBlock declares a resource identified by its kind and name.` to `A SectionBlock declares a resource identified by its name.`; delete the rule `A SectionBlock MAY define a kind.`.
6. **Examples:**
   - Keep `Example of Section Block.` with `## Rules`.
   - Change `Example of Section Block with kind \`rule\`.`to`Example of Section Block whose heading text contains a colon — the text stays one name.` keeping the example verbatim (`### Rule: Maximum 4 items`).
   - Keep the tags example (`### Routine: List Tasks (#generator) (#wip)`) unchanged.

### Step `3 / 4` — Sweep-verify: no live doc or spec presents `kind` as a language feature

Goal: nothing was missed; history stays untouched.

1. Run:

   ```bash
   grep -rn "kind" $PACKAGE_CONSTRUCTS/knowledge $SPEC/grammar
   ```

   Expected: the only remaining match is `spec/CHANGELOG.md`-style historical records — `CHANGELOG` files and archived material are historical records and MUST NOT be edited. Every live match must be gone or a deliberate higher-level resource discussion; if a match is ambiguous, keep the doc edit minimal and record the judgement in your report.

2. `$PACKAGE_CONSTRUCTS/knowledge/api.md` needs no change — verified at planning time: it carries no `kind` reference.
3. Do NOT touch `_backlog/0-archive/**`, `_backlog/1-done/**`, or any `CHANGELOG.md` — archived history.

### Step `4 / 4` — Commit `delete-kind-from-docs-and-spec`

Execute the commit defined below, then continue to the Final Verification.

---

#### Commit: `delete-kind-from-docs-and-spec`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
docs(art-md): Remove `kind` from the constructs knowledge and the grammar spec.

- Remove `kind` from the `SectionBlock` samples in `factories.md` and `parsers.md`.
- Rewrite `section-block.art`: the heading text is the section name; no `kind` in the grammar.
- Keep `Kind: Name` only where the spec discusses resources, not the construct.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and not pushed, according to the commit's policy (`NOPUSH`).
- Verify the `SectionBlock` samples in `factories.md` and `parsers.md` match the post-deletion code (no `kind`).
- Verify `spec/grammar/constructs/structural/section-block.art` has no `kind` in Purpose, Description, Schema, Syntax, Rules, or Examples.
- Verify the sweep grep leaves no live `kind` reference outside historical material.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
