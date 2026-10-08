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
| `$PROJECT`   | PROVIDED WITH PROMPT          | Checkout for Art MD implementation.                         |
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
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Step, Verifying Completion. Conventions for working with TypeScript and Unit Tests. Relevant for Executing Work, Verifying Step.
::READ `$ART_WORK/cli/work/src/private/` (Reference) — The Art Work CLI's private modules; the source you compare against. Relevant for Refactoring.
::READ `$PROJECT/architecture/adr/art-md.md` (ADR) — Existing ADR style reference. Use the same terse, purposeful style for the CLI ADR.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Step

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root (monorepo):

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
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

- Step 1 / 4 — Build the extraction inventory
- Step 2 / 4 — Recommend `@art-lib` package boundary
- Step 3 / 4 — Record inventory in CLI ADR
- Step 4 / 4 — Commit `identify-art-lib-extraction`

## Steps

### Step `1 / 4` — Build the extraction inventory

Compare `$PROJECT/cli/bin/src/private/` against `$ART_WORK/cli/work/src/private/` and build an inventory of the similar modules, units, files, and functions — even if not verbatim the same shape — and of the equivalent infrastructure patterns and use cases, even if achieved via different strategies. For example the operations log and the logger.

Per unit record: what is shared, what diverges, and the shape a shared API would take.

### Step `2 / 4` — Recommend `@art-lib` package boundary

Recommend which units are genuinely shared, which stay project-specific, and the naming the shared API would use.

### Step `3 / 4` — Record inventory in CLI ADR

Create `$PROJECT/cli/bin/architecture/records/adr/cli.art`:

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
- Verify the CLI ADR exists at `$PROJECT/cli/bin/architecture/records/adr/cli.art` and cites the inventory.
- Report according to the "How to Report Back to the Delegator" instructions.
