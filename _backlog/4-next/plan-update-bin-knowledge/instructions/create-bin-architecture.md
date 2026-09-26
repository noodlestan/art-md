# Instructions: `create-bin-architecture`

**Plan:** `update-bin-knowledge`

**Iteration Id:** `create-bin-architecture`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-update-bin-knowledge/instructions/create-bin-architecture__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `create-bin-architecture`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `create-bin-architecture`, created `{artefacts}`, thumbs up). If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Give the bin a complete, self-describing architecture reference set so everything known about it lives in one place.

## Mandatory Reading

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$PROJECT/architecture/index.md` (Reference) — The repository architecture index the bin reference must be linked from. Relevant for Implementing.
::READ `$PROJECT/architecture/adr/art-md.md` (ADR) — Existing ADR style reference. Use the same terse, purposeful style for the CLI ADR.
::READ `$ART_WORK/cli/work/architecture/index.md` (Reference) — How the Art Work CLI organises its architecture reference set. Relevant for Implementing.
::READ `$ART_WORK/cli/work/architecture/commands.md` (Reference) — The Art Work command reference; the model for the bin's command documentation. Relevant for Implementing.

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

Documentation changes must not break the pipeline; run the lint check across the repository root before committing:

```bash
npm run lint # prettier and eslint over all workspaces
```

---

## Changes

- Step 1 / 8 — Create `architecture/index.md`
- Step 2 / 8 — Create `architecture/entry-points.md`
- Step 3 / 8 — Create `architecture/commands.md`
- Step 4 / 8 — Create `architecture/operations.md`
- Step 5 / 8 — Create `architecture/dependencies.md`
- Step 6 / 8 — Create `architecture/records/adr/cli.art`
- Step 7 / 8 — Update `_guide.md`
- Step 8 / 8 — Commit `create-bin-architecture`

## Steps

### Step `1 / 8` — Create `architecture/index.md`

Create `$BUILD/cli/bin/architecture/index.md`:

- Reference index: what the bin is, the layering, the `src/` layout
- Links to every document below
- Follow the shape of `$ART_WORK/cli/work/architecture/index.md` and `$PROJECT/libs/parser/architecture/index.md`

### Step `2 / 8` — Create `architecture/entry-points.md`

Create `$BUILD/cli/bin/architecture/entry-points.md`:

- The three executables: `art-codec`, `art-parse`, `art-serialize`
- The `src/bin/*.ts` → `dist/esm/bin/*.mjs` build mapping
- What each executable registers
- The fact that the codec bin reuses the same command specs and defines no command logic of its own

### Step `3 / 8` — Create `architecture/commands.md`

Create `$BUILD/cli/bin/architecture/commands.md`:

- Command reference: each command's name, arguments, options (`-o, --output <mode>`, `--json`, `-w, --write <file>`)
- Stdin handling via `-`
- Worked invocations

### Step `4 / 8` — Create `architecture/operations.md`

Create `$BUILD/cli/bin/architecture/operations.md`:

- Operation model: `OperationOutcome`, pending/success/failure types, operation factories
- Logger's buffering and output modes
- Log line format, including why the checkout columns of the Art Work log line are absent

### Step `5 / 8` — Create `architecture/dependencies.md`

Create `$BUILD/cli/bin/architecture/dependencies.md`:

- Dependency direction: bin depends on `@art-md/codec` and `@art-md/primitives` and on `commander`
- Codec depends on nothing in the bin
- Bin owns its own file I/O and never becomes a `ContentSource`

### Step `6 / 8` — Create `architecture/records/adr/cli.art`

Create `$BUILD/cli/bin/architecture/records/adr/cli.art`:

- Entry-point decision
- Shared-builder decision
- `dist/esm/bin/*.mjs` export decision
- `package.json`-sourced version decision
- `@art-lib` extraction inventory recorded by Plan: Consolidate Codec Bin
- Use the same terse, purposeful style as `$PROJECT/architecture/adr/art-md.md`

### Step `7 / 8` — Update `_guide.md`

Update `$BUILD/cli/bin/_guide.md`:

- Replace "This package does not maintain a dedicated architecture reference" with links to the new `architecture/` set
- Add the layout and the operating instructions for the commands

### Step `8 / 8` — Commit `create-bin-architecture`

#### Commit: `create-bin-architecture`

**Policy:** NOPUSH — Agent should commit but not push, then proceed to the next step.

**Message:**

```text
arch(bin): add bin architecture reference set
```

---

## Final Verification

**Instructions:**

- Verify that the commit has been executed with the correct message and not pushed.
- Verify that `npm run lint` from the repository root passes.
- Verify that `npm run ci` from the repository root passes.
- Report according to the "How to Report Back to the Delegator" instructions.
