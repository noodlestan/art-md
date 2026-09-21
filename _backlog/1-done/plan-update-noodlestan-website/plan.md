# Plan: Update Noodlestan Website

**ID:** `update-noodlestan-website`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Update the Noodlestan website to reflect the new repository layout.

**Description:** Update website content referencing the Art JS and Art MD repositories.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable          | Resolved Path               | Purpose                             |
| ----------------- | --------------------------- | ----------------------------------- |
| `$WORKSPACE`      | Current working directory   | Workspace root directory            |
| `$ART_MD`         | `checkouts/art-md-building` | Repository: Art MD checkout         |
| `$ART_JS`         | `checkouts/art-js-building` | Repository: Art JS checkout         |
| `$NOODLESTAN_WEB` | `checkouts/noodlestan-web`  | Repository: Noodlestan Web checkout |

## Summary

Update the Noodlestan website content and links to reflect the new repository layout, referencing Art MD and Art JS, by pulling the updated project records and rebuilding the project collection.

## Context

### Upstream Work

| Kind      | Path                                                           | Role                                                   |
| --------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| Milestone | `$ART_MD/_roadmap/3-now/milestone-extract-art-md/milestone.md` | Coordinates this plan within the Extract MD milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for DONE Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                |
| --------------------------------------- | -------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | DONE lifecycle for contextualising, drafting, DONE, and integrating plans. |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$NOODLESTAN_WEB/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/_records/repositories/noodlestan-web.art` (Record) — Website repository record to update. Relevant for DONE Work Item.

## Scope

Update the Noodlestan website content and links to reflect the new repository layout, referencing Art MD and Art JS, by pulling the updated project records and rebuilding the project collection.

### (Scope) Repository: Noodlestan Web

**Record:** `$WORKSPACE/_records/repositories/noodlestan-web.art`

**Role:** Website to update to reflect the new repository layout.

**Changes:**

- Pull the updated project records into `$NOODLESTAN_WEB/data/_records/projects/`.
- Rebuild the project collection from the pulled records.
- Update website content referencing the Art JS / Art MD repositories.

**Dependencies:**

- Plan: Consolidate Repos in Artificials.

## Execution Context

Execution occurs from `$WORKSPACE/`; the Noodlestan Web checkout `$NOODLESTAN_WEB` (checkout `checkouts/noodlestan-web`) is updated in its own repository.

---

## Items:

| Iteration / Instructions                     | Status |
| -------------------------------------------- | ------ |
| Iteration: Update Noodlestan Website Content | `DONE` |

### Iteration: Update Noodlestan Website Content

**ID:** `update-noodlestan-website-content`

**Status:** `DONE`

**Purpose:** Update the Noodlestan website to reflect the new repository layout.

**Description:** Pull the updated project records, rebuild the project collection, and update website content and links in `$NOODLESTAN_WEB` to reference Art MD and Art JS.

**Changes:**

- Run `npm run update-project-records` from `$NOODLESTAN_WEB` to copy `project.art` files from the workspace `_records/repositories` into `data/_records/projects/`.
- Run `npm run update-project-collection` from `$NOODLESTAN_WEB` to regenerate `data/projects/collection.json` from the project records.
- Rebuild website and verify.
- Deploy to `staging` and `production`

**Dependencies:**

- Plan: Consolidate Repos in Artificials.

#### Commits:

| ID                                  | Repository / Checkout / Branch              | Policy   | Hash      | Status      |
| ----------------------------------- | ------------------------------------------- | -------- | --------- | ----------- |
| `update-noodlestan-website-content` | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `NOPUSH` | `a087f03` | `COMMITTED` |

##### Commit: `update-noodlestan-website-content`

**Message:**

```text
docs(noodlestan-web): Update website content to reference Art MD and Art JS.
```

---

## Work

### Next

Plan the next iteration: `update-noodlestan-website-content`.

### Blockers

- None.

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

**Instructions:** (From `$NOODLESTAN_WEB/_guide.md`)

Run from the repository root:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

---

## Coordination

### Not In Scope

- **Consolidating the Artificials umbrella** — Covered by the sibling plan `plan-consolidate-repos-in-artificials`.

### Evidence

- None yet.

### Findings

- **Content is pulled from project records** — the website pulls `project.art` files from the workspace `_records/repositories` into `data/_records/projects/` via `npm run update-project-records`, then rebuilds `data/projects/collection.json` via `npm run update-project-collection` (defined in `$NOODLESTAN_WEB/_guide.md`).

### Decisions

- **Update after consolidation** — the website is updated only after the Artificials umbrella lists Art MD and Art JS.

### Knowledge to Update

- None.`update-project-collection` operating instructions.

### Follow Ups

- None.

### Feedback

- None.
