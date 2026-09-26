# Instructions: `update-package-readmes`

**Plan:** `use-website-url-in-docs`

**Iteration Id:** `update-package-readmes`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-use-website-url-in-docs/instructions/update-package-readmes__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-package-readmes`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-package-readmes`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Bring every package README up to date — website links and current package names.

This iteration produces 1 commit(s): `update-package-readmes`. Commit them in the order given — each commit must be a working tree state on its own.

## Mandatory Reading

- Plan: `$PROJECT/_backlog/4-next/plan-use-website-url-in-docs/plan.md` — read `## Scope` and the iteration `update-package-readmes` under `## Items:`.
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

This iteration touches the six package READMEs under `$PROJECT/libs/` and `$PROJECT/cli/`; the sentence replacement and the title renames ship as one commit.

- Step 1 / 4 — Replace the toolkit sentence in the package READMEs
- Step 2 / 4 — Rename the legacy README titles
- Step 3 / 4 — Commit `update-package-readmes`
- Step 4 / 4 — Re-verify the READMEs

## Steps

### Step `1 / 4` — Replace the toolkit sentence in the package READMEs

**Goal:** Point every package README at the published website.

**Execute:**

1. For each of the files below:

- `$PROJECT/libs/primitives/README.md`
- `$PROJECT/libs/parser/README.md`
- `$PROJECT/libs/serializer/README.md`
- `$PROJECT/libs/constructs/README.md`
- `$PROJECT/cli/bin/README.md`
- `$PROJECT/cli/codec-tests/README.md`

replace the sentence:

```md
This package is part of the [Art MD toolkit](../../README.md) toolkit.
```

with:

```md
This package is part of the [Art MD](https://art-md.noodlestan.org) project.
```

2. Leave every other link in those files unchanged.

3. Confirm no occurrence of the old sentence remains:

```bash
grep -rn "part of the" --include="README.md" libs cli
```

**Expected:** No package README still contains the old toolkit sentence.

### Step `2 / 4` — Rename the legacy README titles

**Goal:** Rename the `artificial-*` headings to the current package names.

**Execute:**

1. Rename the headings:

| File                        | From                      | To                     |
| --------------------------- | ------------------------- | ---------------------- |
| `libs/primitives/README.md` | `# artificial-primitives` | `# @art-md/primitives` |
| `libs/parser/README.md`     | `# artificial-parser`     | `# @art-md/parser`     |
| `libs/serializer/README.md` | `# artificial-serializer` | `# @art-md/serializer` |
| `libs/constructs/README.md` | `# artificial-constructs` | `# @art-md/constructs` |
| `cli/bin/README.md`         | `# Artificial Bin`        | `# @art-md/bin`        |

2. Do not touch `libs/codec/README.md` or `cli/codec-tests/README.md`; their titles are already current.

3. Leave the blockquote under each heading unchanged.

**Expected:** Every package README heading matches its `@art-md/*` package name.

### Step `3 / 4` — Commit `update-package-readmes`

The sentence replacement and the title renames are one coherent documentation update across the package READMEs; they are committed together.

---

#### Commit: `update-package-readmes`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
docs(art-md): update package READMEs
```

---

### Step `4 / 4` — Re-verify the package READMEs

**Goal:** Confirm both edits landed in every package README before the plan advances.

**Execute:**

1. Confirm the toolkit sentence is gone:

```bash
grep -rn "part of the" --include="README.md" libs cli
```

2. Confirm the headings are current:

```bash
grep -rn "^# " --include="README.md" libs cli
```

3. Fix any file still carrying the old wording, then amend the `update-package-readmes` commit.

**Expected:** All six package READMEs carry the website link and the current package name.

## Final Verification

**Instructions:**

- Verify that the one commit(s) have been executed but NOT pushed (policy `NOPUSH`).
- Verify no `README.md` under `$PROJECT/libs/` or `$PROJECT/cli/` still contains the old toolkit sentence.
- Verify no `README.md` heading still uses an `artificial-*` or `Artificial Bin` title.
- Verify each commit leaves the repository in a state where `npx prettier . -c` passes.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
