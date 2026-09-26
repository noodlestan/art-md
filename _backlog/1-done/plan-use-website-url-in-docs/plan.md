# Plan: Use Website URL in Docs

**ID:** `use-website-url-in-docs`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Point the documentation at the published website (`https://art-md.noodlestan.org`) instead of the repository, and clear the remaining actionable items from the backlog parking lot.

**Description:** Add the website URL to the project record and the root README, add the banner and quick links to the root README, replace the "part of the Art MD toolkit" sentence in every package README with a website link, rename the legacy `artificial-*` README titles to their `@art-md/*` package names, and reword the prose that describes the architecture as a "pipeline". This plan absorbs every **ACTIONABLE** item of `$PROJECT/_backlog/_parking-lot.md`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the Plan file and its downstream work items. All file references in the Plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path             | Purpose                              |
| ------------ | ------------------------- | ------------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory.            |
| `$PROJECT`   | Provided with prompt      | Repository root for all code changes |

## Summary

Update the project record, the root README, and every package README so that the documentation advertises `https://art-md.noodlestan.org`, correct the legacy README titles, and reword the "pipeline" prose in `architecture/` and `_roadmap/`.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

| Kind      | Path                                | Role                                                              |
| --------- | ----------------------------------- | ----------------------------------------------------------------- |
| Parking   | `$PROJECT/_backlog/_parking-lot.md` | Source of the actionable items this plan absorbs.                 |
| Website   | `https://art-md.noodlestan.org`     | The canonical published URL used by every document.               |
| Records   | `$PROJECT/_records/project.art`     | Project record gaining the `Website` field.                       |
| Readme    | `$PROJECT/README.md`                | Root README gaining the banner, quick links, and `Website` field. |
| Knowledge | `$PROJECT/architecture/overview.md` | Ecosystem overview prose to review for "pipeline" wording.        |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.

## Scope

Documentation-only changes in `$PROJECT`: `_records/project.art`, `README.md`, the six package `README.md` files, and prose in `architecture/` and `_roadmap/`. No package source code, manifest, or test changes.

### (Scope) Resource: Project

**Record:** `$PROJECT/_records/project.art`

**Role:** Describes the Art MD project.

**Changes:**

- Add `**Website:** https://art-md.noodlestan.org` directly under the `**Code:**` field.

**Dependencies:**

- None.

### (Scope) Resource: Root Readme

**Record:** Not applicable.

**Role:** The project front page on GitHub.

**Changes:**

- Add the banner image after the `> Express ...` blockquote.
- Add a `**Quick Links:**` block after the `Language specification and JavaScript` paragraph.
- Add a `**Website:** https://art-md.noodlestan.org` field under the code/repository area.

**Dependencies:**

- None.

### (Scope) Resource: Package Readmes

**Record:** Not applicable.

**Role:** Per-package documentation published to npm.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/libs/`, `$PROJECT/cli/`

**Changes:**

- Replace `This package is part of the [Art MD toolkit](../../README.md) toolkit.` with `This package is part of the [Art MD](https://art-md.noodlestan.org) project.` in `libs/primitives/README.md`, `libs/parser/README.md`, `libs/serializer/README.md`, `libs/constructs/README.md`, `cli/bin/README.md`, and `cli/codec-tests/README.md`.
- Rename the `# artificial-*` headings to the package names: `@art-md/primitives`, `@art-md/parser`, `@art-md/serializer`, `@art-md/constructs`, `@art-md/bin`.

**Dependencies:**

- None.

### (Scope) Resource: Architecture And Roadmap Prose

**Record:** Not applicable.

**Role:** Knowledge documents describing the architecture.

**Changes:**

- Reword prose in `architecture/` and `_roadmap/` that describes the architecture as a "pipeline" so that it describes the bidirectional relationship between Markdown, the Art AST, parsing, and serialisation, without introducing a new architectural abstraction.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; the changes are applied to the Art MD building checkout `$PROJECT` (checkout `checkouts/art-md-building`) on branch `building`.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan.

Iterations are grouped by topic. An iteration may carry several commits — one per change — when the changes are independent.

| Iteration / Instructions                                                                   | Status |
| ------------------------------------------------------------------------------------------ | ------ |
| Iteration: Update Root Readme And Record `./instructions/update-root-readme-and-record.md` | `DONE` |
| Iteration: Update Package Readmes `./instructions/update-package-readmes.md`               | `DONE` |
| Iteration: Reword Pipeline Prose `./instructions/reword-pipeline-prose.md`                 | `DONE` |

### Iteration: Update Root Readme And Record

**Id:** `update-root-readme-and-record`

**Status:** `DONE`

**Purpose:** Advertise the published website and give the repository front page its banner and quick links.

**Description:** Add the `Website` field to `_records/project.art` and the root `README.md`, insert the banner image after the leading blockquote, and add a `Quick Links` block after the introductory paragraph. The changes are independent, so each gets its own commit and the iteration produces three reviewable commits.

**Instructions:** `./instructions/update-root-readme-and-record.md`

**Changes:**

- Add `**Website:** https://art-md.noodlestan.org` under `**Code:**` in `_records/project.art`.
- Add `**Website:** https://art-md.noodlestan.org` to the metadata area of `README.md`.
- Add `![](https://raw.githubusercontent.com/noodlestan/artificial/refs/heads/main/assets/art-md-banner-800x400.png)` after the `> Express ...` blockquote in `README.md`.
- Add the `**Quick Links:**` list linking the demo/docs website and the language spec in `README.md`.

**Dependencies:**

- None.

#### Commits:

| ID                            | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ----------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `advertise-the-website`       | Art MD / `$PROJECT` / `building` | `NOPUSH` | `f0ef3f1` | `COMMITTED` |
| `add-root-readme-banner`      | Art MD / `$PROJECT` / `building` | `NOPUSH` | `79d6fd1` | `COMMITTED` |
| `add-root-readme-quick-links` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `e021164` | `COMMITTED` |

##### Commit: `advertise-the-website`

**Repository:** Art MD

**Message:**

```text
docs(art-md): advertise website in record and README
```

##### Commit: `add-root-readme-banner`

**Repository:** Art MD

**Message:**

```text
docs(art-md): add banner to root README
```

##### Commit: `add-root-readme-quick-links`

**Repository:** Art MD

**Message:**

```text
docs(art-md): add quick links to root README
```

### Iteration: Update Package Readmes

**Id:** `update-package-readmes`

**Status:** `DONE`

**Purpose:** Bring every package README up to date — website links and current package names.

**Description:** Replace the "part of the Art MD toolkit" sentence in every package README with a website link, and rename the legacy `artificial-*` README headings to their `@art-md/*` package names.

**Instructions:** `./instructions/update-package-readmes.md`

**Changes:**

- Replace the toolkit sentence with a website link in the six package READMEs.
- Rename the `# artificial-*` headings in the four `libs/` READMEs and the `# Artificial Bin` heading in `cli/bin/README.md`.

**Dependencies:**

- None.

#### Commits:

| ID                       | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------ | -------------------------------- | -------- | --------- | ----------- |
| `update-package-readmes` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `9f8d7da` | `COMMITTED` |

##### Commit: `update-package-readmes`

**Repository:** Art MD

**Message:**

```text
docs(art-md): update package READMEs
```

### Iteration: Reword Pipeline Prose

**Id:** `reword-pipeline-prose`

**Status:** `DONE`

**Purpose:** Describe the architecture accurately instead of as a pipeline.

**Description:** Review `architecture/` and `_roadmap/` and reword the "pipeline" prose.

**Instructions:** `./instructions/reword-pipeline-prose.md`

**Changes:**

- Reword the affected sentences in `architecture/` and `_roadmap/`; do not introduce a new architectural abstraction.

**Dependencies:**

- None.

#### Commits:

| ID                      | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ----------------------- | -------------------------------- | -------- | --------- | ----------- |
| `reword-pipeline-prose` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `d83e86c` | `COMMITTED` |

##### Commit: `reword-pipeline-prose`

**Repository:** Art MD

**Message:**

```text
docs(art-md): reword pipeline prose
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Execute the iterations in order; the first two are documentation edits and the last is a review. Each iteration commits once per change.

### Blockers

This section lists the impediments to progress and the work items they involve.

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
```

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

**Purpose:** Confirms that a step is correct before continuing.

**Instructions:** (From `$PROJECT/_guide.md`)

Documentation-only changes; after each iteration run:

```bash
npx prettier . -c # checks markdown formatting
```

---

## Coordination

### Not In Scope

- **Repository README link changes** — the `../../README.md` links in package READMEs other than the toolkit sentence are left as they are.
- **Archived records** — `_roadmap/0-archive/` prose is historical and is not reworded.

### Evidence

- None yet.

### Findings

- **Iterations merged by topic** — the parking lot carried seven actionable items, several touching the same file. They are merged into three iterations: the three root README/record items become `update-root-readme-and-record` (three commits), and the two package README items become `update-package-readmes` (one commit).

### Decisions

- **One plan, many iterations** — all actionable items are executed as iterations of a single plan, `use-website-url-in-docs`, so the parking lot is cleared in one work item.
- **One commit per change** — each change in an iteration gets its own `docs(art-md): ...` commit with policy `NOPUSH`, so `update-root-readme-and-record` produces three commits against the same file while `reword-pipeline-prose` produces one.

### Knowledge to Update

- `$PROJECT/_backlog/_parking-lot.md` — the ACTIONABLE section is emptied once the plan completes.

### Follow Ups

- **`@art-md/codec` and `@art-md/codec-tests` READMEs** — the title rename does not apply to them; confirm their headings are intentional.

### Feedback

- None.
