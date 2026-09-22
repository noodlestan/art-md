# Instructions: `update-codec-records-and-guides`

**Plan:** `update-codec-knowledge`

**Iteration Id:** `update-codec-records-and-guides`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-update-codec-knowledge/instructions/update-codec-records-and-guides__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-codec-records-and-guides`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-codec-records-and-guides`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Register the `@art-md/codec` package in the project record and the repository guides. Commit `docs(codec): update records and guides`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Codec Package (@art-md/codec)`.
- Prerequisite: this iteration depends on `implement-codec-package` (the `@art-md/codec` package exists).
- Guide: `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
- Commit conventions: `$WORKSPACE/knowledge/conventions/writing-commit-message.art` — Defines commit message conventions. Relevant for Writing Commit Message.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

### Setting Up

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

Run from the repository root (monorepo) in `$PROJECT`:

```bash
npm ci # to install dependencies.
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

---

## Changes

This iteration registers the codec package in the project record and the repository guides.

- Step 1 / 4 — Update `_records/project.art`
- Step 2 / 4 — Update `README.md`
- Step 3 / 4 — Update `_guide.md`
- Step 4 / 4 — Verify and commit `update-codec-records-and-guides`

## Steps

### Step `1 / 4` — Update `_records/project.art`

**Goal:** Add the Codec package to the project resources.

**Execute:**

1. In `$PROJECT/_records/project.art`, add `- Package: Codec` to the `**Resources:**` list, after `- Package: Primitives`:

```text
- Package: Parser
- Package: Serializer
- Package: Constructs
- Package: Primitives
- Package: Codec
- Package: Spec
- Package: Pipeline Tests
- Package: Bin
```

**Expected:** The project record lists the Codec package.

### Step `2 / 4` — Update `README.md`

**Goal:** Add the `@art-md/codec` row to the packages table.

**Execute:**

1. In `$PROJECT/README.md`, add the codec row to the packages table after the serializer row:

```markdown
| `@art-md` | `libs/codec/` | `@art-md/codec` | Configured codec implementation |
```

**Expected:** The README packages table lists `@art-md/codec`.

### Step `3 / 4` — Update `_guide.md`

**Goal:** Add the Codec project row to the projects table.

**Execute:**

1. In `$PROJECT/_guide.md`, add the Codec project row to the projects table after the Constructs row:

```markdown
| Codec | `libs/codec/_guide.md` | `NONE` |
```

**Expected:** The `_guide.md` projects table lists the Codec project.

### Step `4 / 4` — Verify and commit `update-codec-records-and-guides`

**Goal:** Confirm the docs are consistent and commit.

**Execute:**

1. Verify the three files reference the codec package consistently: `_records/project.art` lists `Package: Codec`, `README.md` lists `@art-md/codec`, and `_guide.md` lists the Codec project with path `libs/codec/_guide.md`.
2. Confirm no stale references remain (e.g. the codec package is not listed twice).

---

#### Commit: `update-codec-records-and-guides`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
records(codec): update records and guides
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `_records/project.art` lists `Package: Codec`.
- Verify `README.md` lists the `@art-md/codec` row.
- Verify `_guide.md` lists the Codec project row.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
