# Instructions: `update-architecture-documents`

**Plan:** `integrate-knowledge`

**Iteration Id:** `update-architecture-documents`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `$PROJECT/_backlog/6-plan/plan-integrate-knowledge/instructions/update-architecture-documents__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-architecture-documents`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory             |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |
| `$ARCH`      | `$PROJECT/architecture`   | Root architecture documents          |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-architecture-documents`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Refresh the root architecture documents to reflect the refactored package set, moved contracts, and changed constructs-vs-parser semantics. The last iterations refactored `libs/primitives`, `libs/constructs`, `libs/parser`, and `libs/serializer`; package-level architecture knowledge was updated everywhere except primitives, but the root architecture documents were not touched and are stale.

## Mandatory Reading

- `$PROJECT/_guide.md` — System guide.
- `$PROJECT/architecture/_routines/draft-architecture-file.md` — Architecture document drafting routine (audience, include/exclude guidelines).
- `$ARCH/index.md` — Architecture index (current state).
- `$ARCH/overview.md` — Architecture overview (current state).
- `$ARCH/components.md` — Architecture components (current state).
- `$ARCH/principles.md` — Architecture principles (current state).
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

Update the four root architecture documents: `components.md`, `index.md`, `overview.md`, and `principles.md`.

Authoring decisions (do not revert these):

- **The delta to reflect** (verified against the package knowledge):
  - Contracts moved to `@art-js/primitives`: `ArtDocument`, `ConstructBase`, `ContainerConstructBase`, `MdastNode`, `Point`, `Position`, `ParserVisitContext`, `ParserSource`.
  - Constructs semantics changed: the package is the contract layer binding parser and serializer, split into three slices (factories, parsers, serializers); hooks are `ConstructProcessor` (`captureNode`) and `ConstructIntegrator` (`integrate`); serializer hook is `ConstructSerializer` (`toMdast`). The old names `ConstructCreator`, `ConstructPreProcessor`, `ConstructHandler`, `ConstructToMdast` are gone.
  - Parser entry point is `parse(markdown)`; config is `ParserConfig` (`defaultConstruct` + `constructs`); dispatch is processors in order → default construct fallback.
  - Serializer entry point is `serialize(document)`; `artAstToMdast` is the internal conversion core; dispatch through a registry keyed by construct name.
  - Parser and serializer DO depend on `@art-js/primitives` directly (package.json) — the old claim "neither the parser nor the serializer depend on prisms directly" is wrong.
- `components.md`: update the four core package sections (Primitives, Constructs, Parser, Serializer). Leave the planned/scaffolded package sections (Validator, Program, Bundler, Bin, Dev Server, Watcher, Language Server, Tools, Spec) untouched.
- `index.md`: move the Principles section to `principles.md`; add Primitives to the Package Architecture References table.
- `overview.md`: eliminate "## Supporting Packages" (move the primitives bullet into the pipeline section); rename "## Md-Art-Md Roundtrip" to "## Art MD"; replace "is the glue of the ecosystem" with the actual purpose of constructs (contract layer binding parser and serializer); update contract names, entry points, and the dependency claim.
- `principles.md`: move the four principles from `index.md` (Composition Over Hardcoding, Open Registry, Separation of Concerns, Natural Fallback); add the "Runtime Config and Context Injection" principle (pipeline configured via factories; context injected into hooks; config injection is a future direction).
- Follow the `draft-architecture-file.md` briefing steps per file.
- Apply the "Writing Decisions" style to all prose.

- Step 1 / 6 — Read mandatory reading and apply the drafting routine
- Step 2 / 6 — Update `components.md`
- Step 3 / 6 — Update `index.md`
- Step 4 / 6 — Update `overview.md`
- Step 5 / 6 — Update `principles.md`
- Step 6 / 6 — Commit `refresh-architecture-docs`

## Steps

### Step `1 / 6` — Read mandatory reading and apply the drafting routine

Read all files under "## Mandatory Reading". For each of the four files to update, apply the **Routine: Create Architecture Document** briefing steps from `$PROJECT/architecture/_routines/draft-architecture-file.md`:

- audience — who reads this document and what they need.
- use cases — concrete scenarios the document supports.
- approach — summary vs detail, example vs enumeration, prose vs tables.
- what to include / what NOT to include.
- draft outline.
- code quoting rules.
- example rules.

Keep the briefings in your working notes; they guide the writing steps below.

### Step `2 / 6` — Update `components.md`

Update `$ARCH/components.md`:

- Primitives section: owns `ArtDocument`, `ConstructBase`, `ContainerConstructBase`, `ParserVisitContext`, `MdastNode`, `Point`, `Position`, and the parser helpers (`nodePosition`, `sectionDepth`). No internal dependencies; all other libs consume it.
- Constructs section: contract layer — factories, `ConstructProcessor`/`ConstructIntegrator`, `ConstructSerializer`, open registry (`BlockConstructMap`/`InlineConstructMap`), concrete constructs. Fix the stale contract type list.
- Parser section: entry `parse(markdown)`, config `ParserConfig`, processor dispatch → default construct, context `ParserVisitContext` stack.
- Serializer section: entry `serialize(document)`, config `SerializerConfig`, registry dispatch.
- Do not touch the planned/scaffolded package sections (Validator, Program, Bundler, Bin, Dev Server, Watcher, Language Server, Tools, Spec).

### Step `3 / 6` — Update `index.md`

Update `$ARCH/index.md`:

- Remove the "## Principles" section (moves to `principles.md`).
- Add Primitives to the "## Package Architecture References" table: `libs/primitives/architecture/index.md`.

### Step `4 / 6` — Update `overview.md`

Update `$ARCH/overview.md`:

- Eliminate "## Supporting Packages"; move the primitives bullet into the pipeline section (primitives provides the low-level types the contract layer and pipeline build on).
- Rename "## Md-Art-Md Roundtrip" to "## Art MD".
- Replace "is the glue of the ecosystem" with the actual purpose of constructs: the contract layer that binds the parser and serializer — it owns the factory functions, the parser/serializer interfaces, and the data shapes.
- Update contract names throughout: `ConstructProcessor`/`ConstructIntegrator`/`ConstructSerializer` (and their factories) instead of `ConstructCreator`/`ConstructPreProcessor`/`ConstructHandler`/`ConstructToMdast`.
- Update the parse direction description: processors consulted in order; first claim wins; fall back to the default construct (`NaturalBlock`). No separate pre-processor stage.
- Update entry points: parser `parse(markdown)`, serializer `serialize(document)`.
- Fix the dependency claim: parser and serializer DO depend on `@art-js/primitives`.

### Step `5 / 6` — Update `principles.md`

Update `$ARCH/principles.md`:

- Move the four principles from `index.md`: Composition Over Hardcoding, Open Registry, Separation of Concerns, Natural Fallback.
- Add the "Runtime Config and Context Injection" principle: the pipeline is configured via factories (`ConstructParserFactory`, `ConstructSerializerFactory`); context (`ParserVisitContext`) is injected into hooks; config injection is a future direction.

### Step `6 / 6` — Commit

#### Commit: `refresh-architecture-docs`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
knowledge(art-js): Refresh ecosystem architecture docs after refactor.

- Update `components.md`, `index.md`, `overview.md`, `principles.md`.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `components.md` reflects the four core package sections with the updated contract names, entry points, and dependency claim, and that planned/scaffolded package sections are untouched.
- Verify that `index.md` no longer contains the Principles section and lists Primitives in the Package Architecture References table.
- Verify that `overview.md` has no "## Supporting Packages" section, has "## Art MD" instead of "## Md-Art-Md Roundtrip", and no longer claims parser/serializer do not depend on primitives.
- Verify that `principles.md` contains the four moved principles plus "Runtime Config and Context Injection".
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
