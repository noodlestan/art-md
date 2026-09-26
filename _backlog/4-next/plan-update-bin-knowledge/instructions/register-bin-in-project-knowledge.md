# Instructions: `register-bin-in-project-knowledge`

**Plan:** `update-bin-knowledge`

**Iteration Id:** `register-bin-in-project-knowledge`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-update-bin-knowledge/instructions/register-bin-in-project-knowledge__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `register-bin-in-project-knowledge`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `register-bin-in-project-knowledge`, created `{artefacts}`, thumbs up). If something goes horribly wrong, report the blocker instead of a summary.

## Goals

List and describe the bin properly in the project's records, README, guide, and architecture documents.

## Mandatory Reading

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$PROJECT/architecture/components.md` (Reference) — The components document with the duplicate and stale bin entries. Relevant for Implementing.
::READ `$PROJECT/architecture/overview.md` (Reference) — The ecosystem overview the CLI plugs into. Relevant for Implementing.
::READ `$PROJECT/architecture/index.md` (Reference) — The repository architecture index. Relevant for Implementing.
::READ `$PROJECT/README.md` (Reference) — The packages table the bin row must describe. Relevant for Implementing.
::READ `$PROJECT/_records/project.art` (Reference) — The project record already listing `Package: Bin`. Relevant for Implementing.

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

- Step 1 / 7 — Update `architecture/components.md`
- Step 2 / 7 — Update `architecture/overview.md`
- Step 3 / 7 — Update `architecture/index.md`
- Step 4 / 7 — Update `architecture/codec.md`
- Step 5 / 7 — Update `README.md`
- Step 6 / 7 — Update `_guide.md`
- Step 7 / 7 — Commit `register-bin-in-project-knowledge`

## Steps

### Step `1 / 7` — Update `architecture/components.md`

Update `$PROJECT/architecture/components.md`:

- Collapse the duplicate bin entries into one `IMPLEMENTED` entry under "CLI Surface" describing the three entry points
- Delete the stale planned-package naming (`art-md-parser`, `art-md-serializer`, `art-md-validator`, and the `art-md` consolidated entry with `--write`)
- Keep the `Validator` entry, which is genuinely still planned

### Step `2 / 7` — Update `architecture/overview.md`

Update `$PROJECT/architecture/overview.md`:

- Place the bin in the ecosystem as a thin consumer of `@art-md/codec` that owns its own file I/O

### Step `3 / 7` — Update `architecture/index.md`

Update `$PROJECT/architecture/index.md`:

- Add the `Bin` row to the Package Architecture References table, linking `../cli/bin/architecture/index.md`
- Correct the `overview.md` description

### Step `4 / 7` — Update `architecture/codec.md`

Ensure `$PROJECT/architecture/codec.md`:

- States the codec's I/O-free boundary
- Points at the bin as its consumer

### Step `5 / 7` — Update `README.md`

Update `$PROJECT/README.md`:

- Rewrite the `@art-md/bin` packages-table row (currently reads "CLI for parser/serialization. commands")
- Add a short CLI usage section listing the three commands and a worked `art-codec parse` / `art-codec serialize` example

### Step `6 / 7` — Update `_guide.md`

Update `$PROJECT/_guide.md`:

- Expand the `Bin` row of the Projects table so it is described rather than merely named
- Add the bin's architecture reference to the Knowledge References list

### Step `7 / 7` — Commit `register-bin-in-project-knowledge`

#### Commit: `register-bin-in-project-knowledge`

**Policy:** NOPUSH — Agent should commit but not push, then proceed to the next step.

**Message:**

```text
docs(bin): register bin in project records, guides, and architecture
```

---

## Final Verification

**Instructions:**

- Verify that the commit has been executed with the correct message and not pushed.
- Verify that `npm run lint` from the repository root passes.
- Verify that `npm run ci` from the repository root passes.
- Report according to the "How to Report Back to the Delegator" instructions.
