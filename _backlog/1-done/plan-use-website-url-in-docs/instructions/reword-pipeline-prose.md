# Instructions: `reword-pipeline-prose`

**Plan:** `use-website-url-in-docs`

**Iteration Id:** `reword-pipeline-prose`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-use-website-url-in-docs/instructions/reword-pipeline-prose__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `reword-pipeline-prose`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `reword-pipeline-prose`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Describe the architecture accurately instead of as a pipeline.

This iteration produces 1 commit(s): `reword-pipeline-prose`. Commit them in the order given — each commit must be a working tree state on its own.

## Mandatory Reading

- Plan: `$PROJECT/_backlog/1-done/plan-use-website-url-in-docs/plan.md` — read `## Scope` and the iteration `reword-pipeline-prose` under `## Items:`.
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

### Verifying Step

This iteration is documentation-only. From the repository root:

```bash
npx prettier . -c # checks markdown formatting
```

---

## Changes

This iteration is a documentation review across `architecture/` and `_roadmap/`.

- Step 1 / 2 — Find and reword the pipeline prose
- Step 2 / 2 — Commit `reword-pipeline-prose`

## Steps

### Step `1 / 2` — Reword the pipeline prose

**Goal:** Review `architecture/` and `_roadmap/` and reword the prose that describes the architecture as a pipeline.

**Execute:**

1. Find the occurrences:

```bash
grep -rn "pipeline" --include="*.md" architecture _roadmap
```

2. For each occurrence in a live document, reword the sentence so that it describes the bidirectional relationship between Markdown, the Art AST, parsing, and serialisation.

3. RULES for the rewording:

- Do NOT introduce a new architectural abstraction, term, or layer.
- Do NOT change any decision, ADR status, path, code reference, or file name.
- Do NOT edit anything under `_backlog_/0-archive/`. `_backlog_/1-done/`, `_roadmap/0-archive/`, and `_roadmap/1-done/`; archived records are historical.
- A package or directory legitimately named `pipeline` is left alone — only prose is reworded.

**Expected:** No live architecture or roadmap document describes the architecture as a pipeline.

### Step `2 / 2` — Commit `reword-pipeline-prose`

---

#### Commit: `reword-pipeline-prose`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
knowledge(art-md): reword pipeline prose
```

---

## Final Verification

**Instructions:**

- Verify that the one commit(s) have been executed but NOT pushed (policy `NOPUSH`).
- Verify no live document under `$PROJECT/architecture/` or `$PROJECT/_roadmap/` describes the architecture as a pipeline (archived records are out of scope).
- Verify each commit leaves the repository in a state where `npx prettier . -c` passes.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
