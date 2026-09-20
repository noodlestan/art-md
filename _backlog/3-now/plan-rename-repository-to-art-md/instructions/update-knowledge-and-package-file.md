# Instructions: `update-knowledge-and-package-file`

**Plan:** `rename-repository-to-art-md`

**Iteration Id:** `update-knowledge-and-package-file`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-rename-repository-to-art-md/instructions/update-knowledge-and-package-file__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-knowledge-and-package-file`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path               | Purpose                                    |
| ------------ | --------------------------- | ------------------------------------------ |
| `$WORKSPACE` | Current working directory   | Workspace root directory                   |
| `$ART_MD`    | `checkouts/art-md-building` | Repository: Art MD checkout (after rename) |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-knowledge-and-package-file`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Update the README, guide, and package description in `$ART_MD` to the Art MD scope.

## Mandatory Reading

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_MD/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$ART_MD/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 4 — Update `$ART_MD/README.md` to Art MD scope
- Step 2 / 4 — Update `$ART_MD/_guide.md` to Art MD scope
- Step 3 / 4 — Update `$ART_MD/package.json` description to Art MD scope
- Step 4 / 4 — Commit `update-knowledge-and-package-file`

## Steps

### Step `1 / 4` — Update `$ART_MD/README.md` to Art MD scope

Read `$ART_MD/README.md` and update it to the Art MD scope: the repository now hosts the Art MD language specification and the md core packages only. Align the README with the repository purpose and description:

- **Repository.purpose:** "Host and manage the Art MD packages and tools, and their knowledge and planning artefacts."
- **Repository.description:** "Monorepo containing the Art MD roadmap and backlogs, language spec, architecture knowledge, and library source code."

Keep the README structure and conventions of the repository.

### Step `2 / 4` — Update `$ART_MD/_guide.md` to Art MD scope

Read `$ART_MD/_guide.md` and update it to the Art MD scope. Keep the guide structure and conventions of the repository.

### Step `3 / 4` — Update `$ART_MD/package.json` description to Art MD scope

Read `$ART_MD/package.json` and update the `description` field to the Art MD scope. Keep all other fields unchanged.

### Step `4 / 4` — Commit `update-knowledge-and-package-file`

---

#### Commit: `update-knowledge-and-package-file`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
docs(art-md): Update README, guide, and package description to Art MD scope.
```

Stage the three modified files in `$ART_MD` and commit with the message above. Do NOT push.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$ART_MD/README.md`, `_guide.md`, and `package.json` reflect the Art MD scope.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
