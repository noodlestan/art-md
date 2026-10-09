# Instructions: `audit-cli-conventions`

**Plan:** `consolidate-codec-bin`

**Iteration Id:** `audit-cli-conventions`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-consolidate-codec-bin/instructions/audit-cli-conventions__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `audit-cli-conventions`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                             |
| ------------ | ------------------------- | ----------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory.           |
| `$PROJECT`   | PROVIDED WITH PROMPT      | Checkout for Art MD implementation. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `audit-cli-conventions`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Audit the implemented CLI against the TypeScript and Unit Test conventions and record the deviations for the refactoring iteration to consume.

## Mandatory Reading

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Step, Verifying Completion. Conventions for working with TypeScript and Unit Tests. Relevant for Executing Work, Verifying Step.
::READ `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` (Conventions) — Unit Test conventions. Relevant for Auditing.

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

- Step 1 / 2 — Audit `$PROJECT/cli/bin/src/` against the conventions
- Step 2 / 2 — Commit `audit-cli-conventions`

## Steps

### Step `1 / 2` — Audit `$PROJECT/cli/bin/src/` against the conventions

Audit `$PROJECT/cli/bin/src/` against `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` and `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` and record the deviations.

Read ALL conventions mentioned in `$PROJECT/_guide.md` and audit against each one relevant to this step.

Save the audit report as a plan attachment at `$PROJECT/_backlog/3-now/plan-consolidate-codec-bin/plan__audit.md`.

### Step `2 / 2` — Commit `audit-cli-conventions`

#### Commit: `audit-cli-conventions`

**Policy:** NOPUSH — Agent should commit but not push, then proceed to the next step.

**Message:**

```text
conventions(bin): Audit Typescript and Unit Test conventions
```

---

## Final Verification

**Instructions:**

- Verify that the commit has been executed with the correct message and not pushed.
- Verify that `npm run ci` from the repository root passes.
- Verify the audit report exists at `$PROJECT/_backlog/3-now/plan-consolidate-codec-bin/plan__audit.md`.
- Report according to the "How to Report Back to the Delegator" instructions.
