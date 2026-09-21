# Plan: Consolidate Repos in Artificials

**ID:** `consolidate-repos-in-artificials`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Update the Artificials umbrella to list the owned projects and repositories.

**Description:** Consolidate the repository list in the Artificials umbrella project to include Art MD and Art JS.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable       | Resolved Path               | Purpose                          |
| -------------- | --------------------------- | -------------------------------- |
| `$WORKSPACE`   | Current working directory   | Workspace root directory         |
| `$ART_MD`      | `checkouts/art-md-building` | Repository: Art MD checkout      |
| `$ART_JS`      | `checkouts/art-js-building` | Repository: Art JS checkout      |
| `$ARTIFICIALS` | `checkouts/artificials`     | Repository: Artificials checkout |

## Summary

Update the Artificials umbrella project record and README to list Art MD and Art JS as owned projects and repositories.

## Context

### Upstream Work

| Kind      | Path                                                           | Role                                                   |
| --------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| Milestone | `$ART_MD/_roadmap/3-now/milestone-extract-art-md/milestone.md` | Coordinates this plan within the Extract MD milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ARTIFICIALS/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/_records/repositories/artificials.art` (Record) — Umbrella repository record to consolidate. Relevant for Planning Work Item.

## Scope

Update the Artificials umbrella project record and README to list Art MD and Art JS as owned projects and repositories.

### (Scope) Repository: Artificials

**Record:** `$WORKSPACE/_records/repositories/artificials.art`

**Role:** Umbrella repository coordinating the art projects; needs consolidation to list Art MD and Art JS.

**Changes:**

- Update `$ARTIFICIALS/_records/project.art` to list all projects under the websites.
- Update `$ARTIFICIALS/README.md` "## Projects" section to list projects as per `_records/project.art`.

**Dependencies:**

- Plan: Extract Libs and CLI Placeholders to Art JS.

## Execution Context

Execution occurs from `$WORKSPACE/`; the Artificials checkout `$ARTIFICIALS` (checkout `checkouts/artificials`) is updated in its own repository.

---

## Items:

| Iteration / Instructions            | Status  |
| ----------------------------------- | ------- |
| Iteration: Update Repository Record | `READY` |

### Iteration: Update Repository Record

**ID:** `update-repository-record`

**Status:** `READY`

**Purpose:** Update the Artificials umbrella to list Art MD and Art JS.

**Description:** Update the Artificials project record and README to list Art MD and Art JS as owned projects and repositories.

**Changes:**

- Update `$ARTIFICIALS/_records/project.art` to list all projects under the websites, renaming "Application: Workspace CLI Website" to "Application: Art Work Website":
  - Application: Art MD Website – (PLANNED)
  - Application: Art JS Website – (PLANNED)
  - Application: Art Work Website – (PLANNED)
  - Project: Art MD – `https://github.com/noodlestan/art-md`
  - Project: Art JS – `https://github.com/noodlestan/art-js`
  - Project: Art Work – `https://github.com/noodlestan/art-work`
- Update `$ARTIFICIALS/README.md` "## Projects" section to list projects as per `_records/project.art` (resources list), replacing the backlog links.

**Dependencies:**

- Plan: Extract Libs and CLI Placeholders to Art JS.

#### Commits:

| ID                         | Repository / Checkout / Branch        | Policy   | Hash | Status     |
| -------------------------- | ------------------------------------- | -------- | ---- | ---------- |
| `update-repository-record` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` |      | `AUTHORED` |

##### Commit: `update-repository-record`

**Message:**

```text
records(artificials): Update project record and README to list Art MD and Art JS.
```

---

## Work

### Next

Plan the next iteration: `update-repository-record`.

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

**Instructions:** (From `$ARTIFICIALS/_guide.md`)

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

- **Updating the Noodlestan website** — Covered by the sibling plan `plan-update-noodlestan-website`.

### Evidence

- None yet.

### Findings

- **Artificials checkout not yet present** — `$ARTIFICIALS` (checkout `checkouts/artificials`) does not exist in the workspace yet; it must be created before this plan executes.

### Decisions

- **Consolidate after extraction** — the Artificials umbrella is updated only after Art MD and Art JS are finalised.

### Knowledge to Update

- **Artificials project record and README** — list Art MD and Art JS.

### Follow Ups

- None.

### Feedback

- None.
