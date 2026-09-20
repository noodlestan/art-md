# Instructions: `update-architecture-adrs`

**Plan:** `integrate-knowledge`

**Iteration Id:** `update-architecture-adrs`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `$PROJECT/_backlog/6-plan/plan-integrate-knowledge/instructions/update-architecture-adrs__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-architecture-adrs`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path               | Purpose                              |
| ------------ | --------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory   | Workspace root directory             |
| `$PROJECT`   | Provided with prompt        | Repository root for all code changes |
| `$ADR`       | `$PROJECT/architecture/adr` | ADR files                            |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-architecture-adrs`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Restore and update the ADR set: rename the restored ADR files to `.md`, create `architecture/adr/art-md.md` capturing the art-md pipeline decisions lifted from the package api/implementation knowledge, and trim the existing ADRs following the WIP comments.

## Mandatory Reading

- `$PROJECT/_guide.md` — System guide.
- `$ADR/compiler.art` — Restored ADR (carries WIP comments — the authoring intent; follow them exactly).
- `$ADR/language.art` — Restored ADR (carries WIP comments; also holds the "Example Localization" style example).
- `$ADR/configuration.art` — Restored ADR (carries WIP comments).
- `$ADR/_research.md` — Restored ADR research notes.
- `$PROJECT/libs/constructs/architecture/index.md` — Constructs package knowledge (updated).
- `$PROJECT/libs/parser/architecture/index.md` — Parser package knowledge (updated).
- `$PROJECT/libs/serializer/architecture/index.md` — Serializer package knowledge (updated).
- `$PROJECT/libs/primitives/architecture/index.md` — Primitives package knowledge (created in iteration `create-primitives-architecture`).

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Before you Start:** Verify you are on branch `building` and that git status is clean.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the `$PROJECT` root:

```bash
npm run install
npm run ci # to verify there are no pre-existing failures.
```

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the `$PROJECT` root:

```bash
npm run lint:fix # autofix formatting issues
npm run lint # report remaining issues
```

---

## Writing Decisions

Apply this style to all prose you write in this iteration:

- **Context** is optional but usually valuable.
- **Consequences** is optional — include it only when important consequences arise.
- Make everything short. Short sentences.
- No adjectives.
- No cargo-cult terminology.
- A good example of the style: `## Decision: Example Localization` in `$PROJECT/architecture/adr/language.art`.

## Changes

Authoring decisions (do not revert these):

- **All decisions live at `$ADR`** — there is no `records` directory for ADRs.
- **Rename all restored files to `.md`**: `compiler.art` → `compiler.md`, `language.art` → `language.md`, `configuration.art` → `configuration.md` (`_research.md` is already `.md`).
- **Create `$ADR/art-md.md`** with decisions lifted from the package api/implementation knowledge:
  - **Decision: MD Substrate MDAST** — the starting decision. Another option was micromark. This was previously captured as "## Decision: Compiler Based on Unified" in `compiler.art` — but it must be TRIMMED (the old version is too long) and REWORDED around this reason: with mdast, art-md becomes a thin layer for classifying and nesting nodes. Other benefits: the unified-js ecosystem provides all we will ever need to work with markdown extensions, convert to HTML, and even solid (https://github.com/bigmistqke/solid-mdast-renderer). NOTE: the old decision proposed building directly on micromark; the implemented parser builds on mdast (`mdast-util-from-markdown`) — the decision reflects the implemented choice.
  - **Decision: Visitor Architecture** — the parser walks the mdast tree with `unist-util-visit`; constructs claim nodes via processors in order; the builder stays construct-agnostic.
  - **Decision: Context Pattern** — `ParserVisitContext` stack (`captureChildConstruct`, `childContext`, `parent`, `onBeforeConstruct`) injected into hooks; constructs mutate the context to enter/leave capturing mode.
  - **Decision: Constructs Package Structure** — three independent slices: factories, parsers, serializers; one folder per construct per slice.
  - **Decision: Parser/Serializer Independent from Constructs** — construct-agnostic pipeline; wiring happens through config factories; neither names a concrete construct.
  - **Decision: Natural Block Fallback** — unrecognised markdown is preserved as `NaturalBlock`/`NaturalExpression` rather than dropped; the parser classifies, it does not validate.
  - **Decision: Tags Parsing** — `Tag` has no parser factory; tags are extracted by owning constructs' processors via the shared `extractTags` helper.
  - You may lift additional decisions from the api/implementation knowledge where they are clearly design decisions.
- **Trim the existing ADRs** (`compiler.md`, `language.md`, `configuration.md`) following the WIP comments written by the user. These cover a much bigger scope than art-md alone and are restored from an old copy; superseded/scaffold state must not remain in the repo. The WIP comments are the authoring intent — follow them exactly.
- Apply the "Writing Decisions" style to all prose.

- Step 1 / 5 — Read mandatory reading
- Step 2 / 5 — Rename ADR files to `.md`
- Step 3 / 5 — Create `art-md.md`
- Step 4 / 5 — Trim existing ADRs following WIP comments
- Step 5 / 5 — Commit `restore-and-update-adrs`

## Steps

### Step `1 / 5` — Read mandatory reading

Read all files under "## Mandatory Reading", including the restored ADRs and their WIP comments. Note the WIP comments in each file — they are the authoring intent for the trimming step.

### Step `2 / 5` — Rename ADR files to `.md`

Rename in `$ADR`:

- `compiler.art` → `compiler.md`
- `language.art` → `language.md`
- `configuration.art` → `configuration.md`

(`_research.md` keeps its name.)

### Step `3 / 5` — Create `art-md.md`

Create `$ADR/art-md.md`:

- H1 title `Art MD` with a one-sentence purpose statement.
- Capture the decisions listed under "## Changes" as `## Decision: {Name}` sections, each with `**Status:**` and the optional `**Context:**` / `**Consequences:**` fields per the "Writing Decisions" style.
- Start with **Decision: MD Substrate MDAST**, trimmed and reworded around the reason given (mdast makes art-md a thin classification/nesting layer; unified-js ecosystem benefits; solid-mdast-renderer link).
- Lift the decision content from the package api/implementation knowledge — do not invent new decisions beyond what the knowledge supports.

### Step `4 / 5` — Trim existing ADRs following WIP comments

Trim `$ADR/compiler.md`, `$ADR/language.md`, `$ADR/configuration.md`:

- Follow the WIP comments written by the user exactly.
- Remove superseded/scaffold state — these files cover a much bigger scope than art-md alone and are restored from an old copy.
- Keep the decisions that remain valid; apply the "Writing Decisions" style to the kept content.

### Step `5 / 5` — Commit

#### Commit: `restore-and-update-adrs`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
knowledge(art-js): Restore and update ADR set.

- Rename ADR files to `.md`; create `art-md.md`.
- Trim existing ADRs following WIP comments.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$ADR` contains `compiler.md`, `language.md`, `configuration.md`, `_research.md`, and the new `art-md.md` — and no `.art` files remain.
- Verify that `art-md.md` starts with **Decision: MD Substrate MDAST** and covers the decisions listed under "## Changes".
- Verify that the existing ADRs were trimmed following the WIP comments and no superseded/scaffold state remains.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
