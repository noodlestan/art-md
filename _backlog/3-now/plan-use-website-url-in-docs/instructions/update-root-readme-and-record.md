# Instructions: `update-root-readme-and-record`

**Plan:** `use-website-url-in-docs`

**Iteration Id:** `update-root-readme-and-record`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-use-website-url-in-docs/instructions/update-root-readme-and-record__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-root-readme-and-record`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-root-readme-and-record`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Advertise the published website and give the repository front page its banner and quick links, in the project record and the root README.

This iteration produces 3 commit(s): `advertise-the-website`, `add-root-readme-banner`, `add-root-readme-quick-links`. Commit them in the order given — each commit must be a working tree state on its own.

## Mandatory Reading

- Plan: `$PROJECT/_backlog/4-next/plan-use-website-url-in-docs/plan.md` — read `## Scope` and the iteration `update-root-readme-and-record` under `## Items:`.
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

This iteration touches `_records/project.art` and `README.md`. The three changes are independent; each is committed separately, in this order.

- Step 1 / 7 — Add the `Website` field to `_records/project.art`
- Step 2 / 7 — Add the `Website` field to `README.md`
- Step 3 / 7 — Commit `advertise-the-website`
- Step 4 / 7 — Add the banner to `README.md`
- Step 5 / 7 — Commit `add-root-readme-banner`
- Step 6 / 7 — Add the quick links to `README.md`
- Step 7 / 7 — Commit `add-root-readme-quick-links`

## Steps

### Step `1 / 7` — Advertise the website in the project record

**Goal:** Add the `Website` field to `_records/project.art`.

**Execute:**

1. Open `$PROJECT/_records/project.art`.

2. Insert the website field directly after the `**Code:**` field, keeping one blank line between fields:

```text
**Code:** https://github.com/noodlestan/art-md

**Website:** https://art-md.noodlestan.org
```

3. Change nothing else in the record.

**Expected:** `_records/project.art` carries a `Website` field pointing at `https://art-md.noodlestan.org`.

### Step `2 / 7` — Advertise the website in the root README

**Goal:** Add the `Website` field to the metadata area of the root README.

**Execute:**

1. Open `$PROJECT/README.md`.

2. Add the website field above the `## Packages` heading, separated by blank lines:

```md
**Website:** https://art-md.noodlestan.org
```

3. Change nothing else in the README.

**Expected:** `README.md` shows `**Website:** https://art-md.noodlestan.org` above the packages table.

### Step `3 / 7` — Commit `advertise-the-website`

The two website fields are one logical change and are committed together.

---

#### Commit: `advertise-the-website`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
docs(art-md): advertise website in record and README
```

---

### Step `4 / 7` — Add the banner to the root README

**Goal:** Insert the banner image reference after the leading blockquote.

**Execute:**

1. Open `$PROJECT/README.md`.

2. Insert the banner image as the first line after the leading blockquote:

```md
# Art MD

> Express structured data in Markdown with an extensible language that enables human and machine authoring at scale and automated transformations.

![](https://raw.githubusercontent.com/noodlestan/artificial/refs/heads/main/assets/art-md-banner-800x400.png)
```

3. Change nothing else in the README.

**Expected:** `README.md` renders the banner directly under the blockquote.

### Step `5 / 7` — Commit `add-root-readme-banner`

---

#### Commit: `add-root-readme-banner`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
docs(art-md): add banner to root README
```

---

### Step `6 / 7` — Add the quick links to the root README

**Goal:** Insert the `Quick Links` block after the introductory paragraph.

**Execute:**

1. Open `$PROJECT/README.md`.

2. Insert the quick links block after the `Language specification and JavaScript ...` paragraph, before the `## Packages` heading, separated by blank lines:

```md
**Quick Links:**

- [Demo and Docs](https://art-md.noodlestan.org)
- [Language Spec](https://github.com/noodlestan/art-md/blob/main/spec/README.md)
```

3. Change nothing else in the README.

**Expected:** `README.md` shows the `Quick Links` list in the position specified by the plan.

### Step `7 / 7` — Commit `add-root-readme-quick-links`

---

#### Commit: `add-root-readme-quick-links`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
docs(art-md): add quick links to root README
```

---

## Final Verification

**Instructions:**

- Verify that the three commit(s) have been executed but NOT pushed (policy `NOPUSH`).
- Verify `_records/project.art` and `README.md` both carry `**Website:** https://art-md.noodlestan.org`.
- Verify `README.md` shows the banner directly after the leading blockquote.
- Verify `README.md` shows the `Quick Links` list after the introductory paragraph.
- Verify each commit leaves the repository in a state where `npx prettier . -c` passes.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
