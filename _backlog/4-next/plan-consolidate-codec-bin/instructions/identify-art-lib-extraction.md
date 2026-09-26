# Instructions: `identify-art-lib-extraction`

**Plan:** `consolidate-codec-bin`

**Iteration Id:** `identify-art-lib-extraction`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-consolidate-codec-bin/instructions/identify-art-lib-extraction__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `identify-art-lib-extraction`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                 | Purpose                                                     |
| ------------ | ----------------------------- | ----------------------------------------------------------- |
| `$WORKSPACE` | Current working directory     | Workspace root directory.                                   |
| `$PROJECT`   | `checkouts/art-md-planning`   | Planning checkout for Art MD.                               |
| `$BUILD`     | `checkouts/art-md-building`   | Building checkout for Art MD (implementation).              |
| `$ART_WORK`  | `checkouts/art-work-building` | Art Work checkout (reference CLI implementation to follow). |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `identify-art-lib-extraction`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Produce the evidence-backed inventory that makes `@art-lib` a creatable follow-up instead of a guess.

## Mandatory Reading

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$ART_WORK/cli/work/src/private/operations/types.ts` (Reference) — The Art Work operation model the bin duplicated. Relevant for Refactoring.
::READ `$ART_WORK/cli/work/src/private/logger/createLogger.ts` (Reference) — The Art Work logger the bin duplicated. Relevant for Refactoring.
::READ `$ART_WORK/cli/work/src/private/present/makeOperationLogLine.ts` (Reference) — The Art Work log line the bin adapted. Relevant for Refactoring.
::READ `$ART_WORK/cli/work/architecture/commands.md` (Reference) — How Art Work documents its CLI surface. Relevant for Identifying Follow Ups.
::READ `$PROJECT/architecture/adr/art-md.md` (ADR) — Existing ADR style reference. Use the same terse, purposeful style for the CLI ADR.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/knowledge/conventions/writing-commit-message.art`)

Commit message pattern: `{Type}({Scope}): {Description}.` max 120 chars, optionally followed by up 3 bullet points, max 100 chars each.

Allowed values for commit Type, Scope, and valid Type–Scope associations are defined in `$WORKSPACE/knowledge/conventions/writing-commit-message.art`, along with examples, and rules.

RULE: Do not invent commit types or scopes or assume a combination is valid. Always read the "Writing Commit Message" guide first.

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install workspace dependencies.
```

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

---

## Changes

- Step 1 / 4 — Build side-by-side duplication inventory
- Step 2 / 4 — Recommend `@art-lib` package boundary
- Step 3 / 4 — Record inventory in CLI ADR
- Step 4 / 4 — Commit `identify-art-lib-extraction`

## Steps

### Step `1 / 4` — Build side-by-side duplication inventory

Compare `$BUILD/cli/bin/src/private/` against `$ART_WORK/cli/work/src/private/` and build an inventory covering at minimum:

- Operation model (`types.ts`, `createGenericOperation`, `createOperationSuccess`, `createOperationFailure`)
- Logger
- Operation log line presentation
- Program builder
- Context factory

Per unit record: file pair, what is identical, what diverges, and the shape a shared API would take.

### Step `2 / 4` — Recommend `@art-lib` package boundary

Recommend which units are genuinely shared, which stay project-specific, and the naming the shared API would use.

### Step `3 / 4` — Record inventory in CLI ADR

Create `$BUILD/cli/bin/architecture/records/adr/cli.art`:

- Record the `@art-lib` extraction inventory
- Use the same terse, purposeful style as `$PROJECT/architecture/adr/art-md.md`
- Include the recommended boundary and follow-up

Raise `@art-lib` creation as a Follow Up on this plan and on the milestone.

### Step `4 / 4` — Commit `identify-art-lib-extraction`

#### Commit: `identify-art-lib-extraction`

**Policy:** NOPUSH — Agent should commit but not push, then proceed to the next step.

**Message:**

```text
docs(bin): record art-lib extraction inventory and follow-up
```

---

## Final Verification

**Instructions:**

- Verify that the commit has been executed with the correct message and not pushed.
- Verify that `npm run ci` from the repository root passes.
- Verify the CLI ADR exists at `$BUILD/cli/bin/architecture/records/adr/cli.art` and cites the inventory.
- Report according to the "How to Report Back to the Delegator" instructions.
