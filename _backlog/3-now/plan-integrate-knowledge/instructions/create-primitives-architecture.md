# Instructions: `create-primitives-architecture`

**Plan:** `integrate-knowledge`

**Iteration Id:** `create-primitives-architecture`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `$PROJECT/_backlog/6-plan/plan-integrate-knowledge/instructions/create-primitives-architecture__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `create-primitives-architecture`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path              | Purpose                              |
| ------------ | -------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory  | Workspace root directory             |
| `$PROJECT`   | Provided with prompt       | Repository root for all code changes |
| `$PACKAGE`   | `$PROJECT/libs/primitives` | Package to document                  |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `create-primitives-architecture`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create the missing `libs/primitives/architecture/` knowledge so the primitives package is documented like its siblings (constructs, parser, serializer). The package is a small dependency of all other packages but is currently undocumented — its `_guide.md` states "This package does not maintain a dedicated architecture reference."

## Mandatory Reading

- `$PROJECT/_guide.md` — System guide.
- `$PROJECT/architecture/_routines/draft-architecture-file.md` — Architecture document drafting routine (audience, include/exclude guidelines).
- `$PACKAGE/_guide.md` — Package guide (currently states no architecture reference exists).
- `$PACKAGE/src/index.ts` — Package exports.
- `$PACKAGE/src/constructs/types.ts` — Base construct types (`ConstructBase`, `ContainerConstructBase`).
- `$PACKAGE/src/document/types.ts` — `ArtDocument` types.
- `$PACKAGE/src/document/createArtDocument.ts` — `createArtDocument` factory.
- `$PACKAGE/src/parser/types.ts` — Parser types (`MdastNode`, `Point`, `Position`, `ParserSource`).
- `$PACKAGE/src/parser/context/types.ts` — `ParserVisitContext` types.
- `$PACKAGE/src/parser/context/createParserVisitContext.ts` — Root context factory.
- `$PACKAGE/src/parser/context/private/createParserVisitContextBase.ts` — Context base (`captureChildConstruct`, `childContext`, `parent`, `onBeforeConstruct`).
- `$PACKAGE/src/parser/helpers/nodePosition.ts` — `nodePosition` helper.
- `$PACKAGE/src/parser/helpers/sectionDepth.ts` — `sectionDepth` helper.
- `$PROJECT/libs/constructs/architecture/index.md` — Constructs package knowledge (updated).
- `$PROJECT/libs/parser/architecture/index.md` — Parser package knowledge (updated).
- `$PROJECT/libs/serializer/architecture/index.md` — Serializer package knowledge (updated).

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

Create the primitives architecture knowledge: `index.md`, `api.md`, and `implementation.md` under `$PACKAGE/architecture/`, and link it from `$PACKAGE/_guide.md`.

Authoring decisions (do not revert these):

- The architecture is **simple and link-don't-copy**. The visit context API and implementation details are already described from the parser and constructs perspectives — reference those documents, do not duplicate their content.
- `implementation.md` is **really shallow and link-heavy**: a brief description of the visit context mechanics, with links to `libs/parser/architecture/parser.md` (builder perspective) and `libs/constructs/architecture/parsers.md` (construct perspective) for the details.
- Follow the `draft-architecture-file.md` briefing steps per file: identify audience, use cases, approach, what to include / what NOT to include, outline, code quoting rules, example rules.
- Apply the "Writing Decisions" style to all prose.

- Step 1 / 6 — Read mandatory reading and apply the drafting routine
- Step 2 / 6 — Create `index.md`
- Step 3 / 6 — Create `api.md`
- Step 4 / 6 — Create `implementation.md`
- Step 5 / 6 — Update `_guide.md`
- Step 6 / 6 — Commit `add-primitives-architecture`

## Steps

### Step `1 / 6` — Read mandatory reading and apply the drafting routine

Read all files under "## Mandatory Reading". For each of the three files to create, apply the **Routine: Create Architecture Document** briefing steps from `$PROJECT/architecture/_routines/draft-architecture-file.md`:

- audience — who reads this document and what they need.
- use cases — concrete scenarios the document supports.
- approach — summary vs detail, example vs enumeration, prose vs tables.
- what to include / what NOT to include.
- draft outline.
- code quoting rules.
- example rules.

Keep the briefings in your working notes; they guide the writing steps below.

### Step `2 / 6` — Create `index.md`

Create `$PACKAGE/architecture/index.md`:

- H1 title `Primitives Architecture` with a one-sentence purpose statement.
- A documents table listing `api.md` and `implementation.md` with descriptions.
- A layout section describing the `src/` folders: `constructs/` (base construct types), `document/` (`ArtDocument`), `parser/` (mdast types, visit context, helpers).
- Links to the sibling package knowledge: constructs, parser, serializer architecture indexes.

### Step `3 / 6` — Create `api.md`

Create `$PACKAGE/architecture/api.md`:

- H1 title `Primitives API` with a one-sentence purpose statement.
- The public surface:
  - Types: `ConstructBase`, `ContainerConstructBase`, `ArtDocument`, `MdastNode`, `Point`, `Position`, `ParserVisitContext`, `ParserSource`, `OnBeforeConstruct`.
  - Functions: `createArtDocument`, `createParserVisitContext`, `nodePosition`, `sectionDepth`.
- For each type/function: a short description of its role. Do not copy type definitions from dependent packages — show the shape and link to their `api.md` docs.
- A contract reference section: list the packages that consume these types (constructs, parser, serializer) and link to their `api.md` sections.

### Step `4 / 6` — Create `implementation.md`

Create `$PACKAGE/architecture/implementation.md`:

- H1 title `Primitives Implementation` with a one-sentence purpose statement.
- Keep it **shallow and link-heavy**.
- Briefly describe the visit context mechanics: `createParserVisitContext` (root context) and `createParserVisitContextBase` (recursive base) — `captureChildConstruct`, `childContext`, `parent`, `onBeforeConstruct`.
- Link to `$PROJECT/libs/parser/architecture/parser.md` for the builder perspective (how the context stack is mutated during the visit loop) and `$PROJECT/libs/constructs/architecture/parsers.md` for the construct perspective (how hooks use the context).
- Do not reproduce the parser's visit loop or the constructs' hook scenarios.

### Step `5 / 6` — Update `_guide.md`

Update `$PACKAGE/_guide.md`:

- Replace the line "This package does not maintain a dedicated architecture reference." with a link to the new architecture index (`architecture/index.md`).

### Step `6 / 6` — Commit

#### Commit: `add-primitives-architecture`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
knowledge(primitives): Add primitives architecture knowledge.

- Create `architecture/index.md`, `api.md`, `implementation.md`.
- Link architecture index from `_guide.md`.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PACKAGE/architecture/` contains `index.md`, `api.md`, and `implementation.md`.
- Verify that `$PACKAGE/_guide.md` links the new architecture index.
- Verify that the primitives docs reference (not duplicate) the parser and constructs knowledge for the visit context details.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
