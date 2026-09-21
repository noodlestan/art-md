# Instructions: `rename-records-to-art-md`

**Plan:** `rename-repository-to-art-md`

**Iteration Id:** `rename-records-to-art-md`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-rename-repository-to-art-md/instructions/rename-records-to-art-md__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `rename-records-to-art-md`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path               | Purpose                                    |
| ------------ | --------------------------- | ------------------------------------------ |
| `$WORKSPACE` | Current working directory   | Workspace root directory                   |
| `$ART_MD`    | `checkouts/art-md-building` | Repository: Art MD checkout (after rename) |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `rename-records-to-art-md`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Rename the project, repository, and namespace records in `$ART_MD` to the Art MD scope, and rename the workspace repository record from `art-js.art` to `art-md.art`.

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

- Step 1 / 6 — Update `$ART_MD/_records/project.art`
- Step 2 / 6 — Update `$ART_MD/_records/repository.art`
- Step 3 / 6 — Update `$ART_MD/_records/namespace.art`
- Step 4 / 6 — Commit `rename-records-to-art-md`
- Step 5 / 6 — Rename and update `$WORKSPACE/_records/repositories/art-js.art` to `art-md.art`
- Step 6 / 6 — Commit `update-workspace-repository-record`

## Steps

### Step `1 / 6` — Update `$ART_MD/_records/project.art`

Update the project record to the Art MD scope.

Read `$ART_MD/_records/project.art` and update the `purpose` and `description` fields:

- **Project.purpose:** "Express structured data in Markdown with an extensible language that enables human and machine authoring at scale and automated transformations."
- **Project.description:** "Language specification and JavaScript libraries for extracting structured data into a MDAST derived AST, with an open construct registry. Provides parsing, validation, transformation, and serialization of Art MD content."

Keep all other fields unchanged.

### Step `2 / 6` — Update `$ART_MD/_records/repository.art`

Update the repository record to the Art MD scope.

Read `$ART_MD/_records/repository.art` and update the `purpose` and `description` fields:

- **Repository.purpose:** "Host and manage the Art MD packages and tools, and their knowledge and planning artefacts."
- **Repository.description:** "Monorepo containing the Art MD roadmap and backlogs, language spec, architecture knowledge, and library source code."

Keep all other fields unchanged.

### Step `3 / 6` — Update `$ART_MD/_records/namespace.art`

Update the namespace record to Art MD.

Read `$ART_MD/_records/namespace.art` and update the namespace name to Art MD. Keep all other fields unchanged.

### Step `4 / 6` — Commit `rename-records-to-art-md`

---

#### Commit: `rename-records-to-art-md`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
records(art-md): Rename project, repository, and namespace records to Art MD scope.
```

Stage the three modified record files in `$ART_MD/_records/` and commit with the message above. Do NOT push.

### Step `5 / 6` — Rename and update `$WORKSPACE/_records/repositories/art-js.art` to `art-md.art`

Rename the workspace repository record to Art MD.

Rename `$WORKSPACE/_records/repositories/art-js.art` to `$WORKSPACE/_records/repositories/art-md.art` and update the record to Repository: Art MD. The record content is a copy of `$ART_MD/_records/repository.art` — align it with the updated repository record from Step 2.

### Step `6 / 6` — Commit `update-workspace-repository-record`

---

#### Commit: `update-workspace-repository-record`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
records(workspace): Rename art-js repository record to art-md.
```

Stage the renamed record file in `$WORKSPACE/_records/repositories/` and commit with the message above. Do NOT push.

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$ART_MD/_records/project.art`, `repository.art`, and `namespace.art` reflect the Art MD scope.
- Verify that `$WORKSPACE/_records/repositories/art-md.art` exists and `art-js.art` no longer exists.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
