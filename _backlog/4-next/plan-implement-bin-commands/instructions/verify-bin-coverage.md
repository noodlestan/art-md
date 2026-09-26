# Instructions: `verify-bin-coverage`

**Plan:** `implement-bin-commands`

**Iteration Id:** `verify-bin-coverage`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-implement-bin-commands/instructions/verify-bin-coverage__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `verify-bin-coverage`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path               | Purpose                                        |
| ------------ | --------------------------- | ---------------------------------------------- |
| `$WORKSPACE` | Current working directory   | Workspace root directory.                      |
| `$PROJECT`   | `checkouts/art-md-planning` | Planning checkout for Art MD.                  |
| `$BUILD`     | `checkouts/art-md-building` | Building checkout for Art MD (implementation). |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `verify-bin-coverage`, created `{artefacts}`, thumbs up). If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Prove the CLI works as an installed binary and that the package meets its configured coverage thresholds.

## Mandatory Reading

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.

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

### Verifying Step

**Purpose:** Confirms that a step is correct before continuing. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-step.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Before the coverage iteration, build the bundles the integration tests spawn:

```bash
npm run build # emits dist/esm/bin/{codec,parse,serialize}.mjs
```

When making changes to the CLI package, execute from `$BUILD/cli/bin/`:

```bash
npm run test # runs vitest against the CLI unit tests
```

---

## Changes

- Step 1 / 4 — Extend CLI integration tests
- Step 2 / 4 — Add output mode and presentation tests
- Step 3 / 4 — Close coverage gaps
- Step 4 / 4 — Commit `verify-bin-coverage`

## Steps

### Step `1 / 4` — Extend CLI integration tests

Extend `$BUILD/cli/bin/src/bin/cliIntegration.test.ts`:

- Spawn `dist/esm/bin/parse.mjs` and `dist/esm/bin/serialize.mjs` against a fixture file
- Spawn `dist/esm/bin/codec.mjs` with each subcommand
- Assert `--version`, `--help`, stdout, `--json`, `--write`, stdin via `-`
- Assert non-zero exit with failure log line on parse error

### Step `2 / 4` — Add output mode and presentation tests

Add tests for:

- `quiet` and `verbose` output modes
- Presentation helpers' JSON and human-readable branches

### Step `3 / 4` — Close coverage gaps

Run `npm run test:ci` from `$BUILD/cli/bin/` and close any remaining gap until:

- Lines, functions, statements reach 90%
- Branches reach 75%

Run `npm run ci` from the repository root to confirm the whole pipeline passes.

### Step `4 / 4` — Commit `verify-bin-coverage`

#### Commit: `verify-bin-coverage`

**Policy:** NOPUSH — Agent should commit but not push, then proceed to the next step.

**Message:**

```text
test(bin): add cli integration tests and meet coverage thresholds
```

---

## Final Verification

**Instructions:**

- Verify that the commit has been executed with the correct message and not pushed.
- Verify that `npm run ci` from the repository root passes.
- Verify that `npm run test:ci` from `$BUILD/cli/bin/` clears the configured thresholds.
- Report according to the "How to Report Back to the Delegator" instructions.
