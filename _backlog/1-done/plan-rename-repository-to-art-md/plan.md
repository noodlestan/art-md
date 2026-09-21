# Plan: Rename Repository to Art MD

**ID:** `rename-repository-to-art-md`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Rename the current Art JS repository to Art MD.

**Description:** Rename repository, project, namespace, and license records, update the workspace repository record, and update the project guide and references.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path               | Purpose                                    |
| ------------ | --------------------------- | ------------------------------------------ |
| `$WORKSPACE` | Current working directory   | Workspace root directory                   |
| `$PROJECT`   | `checkouts/art-js-planning` | Current checkout for planning only         |
| `$ART_MD`    | `checkouts/art-md-building` | Repository: Art MD checkout (after rename) |

## Summary

Rename the current Art JS repository to Art MD, updating its records, the workspace repository record, and knowledge, so that Art MD hosts only the md core packages.

## Context

### Upstream Work

| Kind      | Path                                                            | Role                                                   |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-extract-art-md/milestone.md` | Coordinates this plan within the Extract MD milestone. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$ART_MD/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.

## Scope

Rename the current Art JS repository to Art MD: update project, repository, and namespace records, the workspace repository record, and README, guide, and package description.

### (Scope) Repository: Art MD

**Record:** `$WORKSPACE/_records/repositories/art-js.art` (to be renamed)

**Role:** — The current Art JS repository renamed to Art MD; hosts the md core packages.

**Partial:**

- `owner` — Project: Art MD (renamed from Project: Art JS)
- `remote` — `git@github.com:noodlestan/art-md.git` (already updated)

**Changes:**

- Update records at `$ART_MD/_records` (project, repository, namespace) to scope them down to Art MD.
- Update knowledge: README, `_guide.md`, `package.json` description.
- Rename `$WORKSPACE/_records/repositories/art-js.art` to `art-md.art` (copy of `$ART_MD/_records/repository.art`).

**Dependencies:**

- None.

### (Scope) Repository: Workspace

**Record:** `$WORKSPACE/_records/repositories/art-js.art`

**Role:** — Workspace repository record to rename to Art MD.

**Changes:**

- Rename `$WORKSPACE/_records/repositories/art-js.art` to `art-md.art` Repository: Art MD.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; the rename happens in `$ART_MD` (checkout `checkouts/art-md-building`), and the workspace repository record is updated in `$WORKSPACE/_records/repositories/`. The git remote and repository rename is executed by the user in `.git` before pushing.

---

## Items:

| Iteration / Instructions                                                                           | Status |
| -------------------------------------------------------------------------------------------------- | ------ |
| Iteration: Rename Records to Art MD `./instructions/rename-records-to-art-md.md`                   | `DONE` |
| Iteration: Update Knowledge and Package File `./instructions/update-knowledge-and-package-file.md` | `DONE` |

### Iteration: Rename Records to Art MD

**ID:** `rename-records-to-art-md`

**Status:** `DONE`

**Purpose:** Rename the project, repository, and namespace records to Art MD scope, and rename the workspace repository record.

**Description:** Update `$ART_MD/_records` (project, repository, namespace) with the Art MD purpose and description, and rename `$WORKSPACE/_records/repositories/art-js.art` to `art-md.art` (a copy of `$ART_MD/_records/repository.art`).

**Instructions:** `./instructions/rename-records-to-art-md.md`

**Report:** `./instructions/rename-records-to-art-md__report.md`

**Changes:**

- Update `$ART_MD/_records/project.art`:
  - **Project.purpose:** "Express structured data in Markdown with an extensible language that enables human and machine authoring at scale and automated transformations."
  - **Project.description:** "Language specification and JavaScript libraries for extracting structured data into a MDAST derived AST, with an open construct registry. Provides parsing, validation, transformation, and serialization of Art MD content."
- Update `$ART_MD/_records/repository.art`:
  - **Repository.purpose:** "Host and manage the Art MD packages and tools, and their knowledge and planning artefacts."
  - **Repository.description:** "Monorepo containing the Art MD roadmap and backlogs, language spec, architecture knowledge, and library source code."
- Update `$ART_MD/_records/namespace.art` to Art MD.
- Rename `$WORKSPACE/_records/repositories/art-js.art` to `art-md.art` and update it to Repository: Art MD (copy of `$ART_MD/_records/repository.art`).

**Dependencies:**

- None.

#### Commits:

| ID                                   | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ------------------------------------ | --------------------------------- | -------- | --------- | ----------- |
| `rename-records-to-art-md`           | Art MD / `$ART_MD` / `building`   | `NOPUSH` | `c4c8978` | `COMMITTED` |
| `update-workspace-repository-record` | Workspace / `$WORKSPACE` / `main` | `NOPUSH` | `d1681fe` | `COMMITTED` |

##### Commit: `rename-records-to-art-md`

**Message:**

```text
records(art-md): Rename project, repository, and namespace records to Art MD scope.
```

##### Commit: `update-workspace-repository-record`

**Message:**

```text
records(workspace): Rename art-js repository record to art-md.
```

### Iteration: Update Knowledge and Package File

**ID:** `update-knowledge-and-package-file`

**Status:** `DONE`

**Purpose:** Update the README, guide, and package description to Art MD scope.

**Description:** Update `$ART_MD` README, `_guide.md`, and `package.json` description to scope down to Art MD.

**Instructions:** `./instructions/update-knowledge-and-package-file.md`

**Report:** `./instructions/update-knowledge-and-package-file__report.md`

**Changes:**

- Update `$ART_MD/README.md` to Art MD scope.
- Update `$ART_MD/_guide.md` to Art MD scope.
- Update `$ART_MD/package.json` description to Art MD scope.

**Dependencies:**

- Iteration: Rename Records to Art MD.

#### Commits:

| ID                                  | Repository / Checkout / Branch  | Policy   | Hash      | Status      |
| ----------------------------------- | ------------------------------- | -------- | --------- | ----------- |
| `update-knowledge-and-package-file` | Art MD / `$ART_MD` / `building` | `NOPUSH` | `01fc271` | `COMMITTED` |

READY Commit: `update-knowledge-and-package-file`

**Message:**

```text
docs(art-md): Update README, guide, and package description to Art MD scope.
```

---

## Work

### Next

All iterations are DONE.

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

**Instructions:** (From `$ART_MD/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

---

## Coordination

### Not In Scope

- **Extracting placeholder packages** — Covered by the sibling plan `plan-extract-libs-and-cli-placeholders-to-art-js`.
- **Creating the new Art JS repository** — Covered by the sibling plan `plan-create-art-js-repository`.

### Evidence

- None yet.

### Findings

- **Md core packages stay in Art MD** — parser, serializer, constructs, primitives, spec, and pipeline-tests remain in Art MD.

### Decisions

- **Rename first** — the current repo is renamed to Art MD before extraction begins.
- **Repository vs Project** — the repository is the physical thing (purpose: to host and manage packages and planning artefacts); the project is the product (purpose: to serve its customers).

### Knowledge to Update

- **README, `_guide.md`, `package.json`** — update to Art MD scope.

### Follow Ups

- **Update checkout records** after the rename.

### Feedback

- None.
