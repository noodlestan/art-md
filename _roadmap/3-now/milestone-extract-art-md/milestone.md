# Milestone: Extract MD

**ID:** `extract-art-md`

**Status:** `PLANNING`

**Template:** `.agents/domains/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Rename the current Art JS repository to Art MD, extract all remaining placeholder packages into a new Art JS repository, and consolidate the Artificials umbrella project and the Noodlestan website to reflect the new repository layout.

**Description:** Splits the current monorepo into two repositories — Art MD (renamed, hosting the md core: parser, serializer, constructs, primitives, spec, and pipeline-tests) and Art JS (new, receiving the placeholder libs and cli packages) — then updates the Artificials umbrella project and the Noodlestan website.

## Mandatory Reading

::READ `$DOMAINS/roadmaps/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

This section lists the path variables used throughout the Milestone file and its downstream work items. All file references in the Milestone and downstream work items MUST use these variables — never bare filesystem paths.

| Variable          | Resolved Path                      | Purpose                                                            |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------ |
| `$WORKSPACE`      | Current working directory          | Workspace root directory.                                          |
| `$PROJECT`        | `checkouts/art-js-planning`        | Current checkout; renamed to Repository: Art MD by this milestone. |
| `$ART_MD`         | `$PROJECT` (renamed)               | Repository: Art MD checkout.                                       |
| `$ART_JS`         | `checkouts/art-js` (to be created) | Repository: Art JS checkout.                                       |
| `$ARTIFICIALS`    | `checkouts/artificials`            | Repository: Artificials checkout.                                  |
| `$NOODLESTAN_WEB` | `checkouts/noodlestan-web`         | Repository: Noodlestan Web checkout.                               |

## Summary

Rename the current Art JS repository to Art MD, extract all remaining placeholder packages (libs and cli) into a new Art JS repository, and update the Artificials umbrella project and the Noodlestan website, so that Art MD hosts only the md core packages and Art JS hosts the tooling placeholders.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Milestone.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Milestone.

| Kind        | Path                                | Role                                                      |
| ----------- | ----------------------------------- | --------------------------------------------------------- |
| Briefing    | `$PROJECT/_backlog/_architect.md`   | Art JS backlog briefing: approach and milestone sequence. |
| Briefing    | `$PROJECT/_roadmap/_architect.md`   | Art JS roadmap briefing: follow-ups and work sequence.    |
| Parking Lot | `$PROJECT/_roadmap/_parking-lot.md` | Roadmap WIP tracker: pending items and follow-ups.        |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Milestone.

- `write-milestone` — Writes this milestone. Required for Planning Work Item.
- `write-plan` — Writes the downstream plans. Required for Planning Work Item.
- `scaffold` — Scaffolds the new Art JS repository. Required for Planning Work Item.
- `render-template` — Renders milestone and plan artefacts. Required for Drafting, Refining.

### Domains

This section lists all domains involved in the Milestone.

| Domain / Path                                         | Description                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md`         | Coordinates long-horizon work across projects by capturing milestones.    |
| Domain: Plans `$DOMAINS/plans/index.md`               | Structures high-level implementation plans with delegatable instructions. |
| Domain: Work `$DOMAINS/work/index.md`                 | Defines the abstract work-item model shared by planning domains.          |
| Domain: Repositories `$DOMAINS/repositories/index.md` | Represents project repositories registered with a workspace.              |
| Domain: Projects `$DOMAINS/projects/index.md`         | Represents projects owning repositories and packages.                     |
| Domain: Workspaces `$DOMAINS/workspaces/index.md`     | Represents the workspace and its checkouts.                               |

### Resource Kinds in Scope

This section lists the kinds of resources included in the work scope of the Milestone.

| Kind       | Domain       | Structure Record Path                             |
| ---------- | ------------ | ------------------------------------------------- |
| Repository | Repositories | `$DOMAINS/repositories/structures/repository.art` |
| Project    | Projects     | `$DOMAINS/projects/structures/project.art`        |
| Workspace  | Workspaces   | `$DOMAINS/workspaces/structures/workspace.art`    |

### Workflows

This section lists all workflows involved in the Milestone.

| Workflow / Path                                                      | Purpose                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Roadmapping `$DOMAINS/roadmaps/workflows/roadmapping/workflow.art`   | Organize roadmap creation and maintenance and coordination of downstream work items.    |
| Planning Work `$DOMAINS/work/workflows/planning-work/workflow.art`   | Create and manage work items lifecycle, collecting operational instructions.            |
| Executing Work `$DOMAINS/work/workflows/executing-work/workflow.art` | Organizes work execution in order to produce completed, verified outcomes and feedback. |

### Workflow Operations

This section lists all workflow operations involved in the Milestone.

| Workflow / Operation / Path                                                                                         | Purpose                                                       |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Planning Work / Planning Work Item `$DOMAINS/work/workflows/planning-work/planning-work-item/operation.art`         | Draft, refine, and validate work items.                       |
| Planning Work / Writing Commit Message `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art` | Write standardized commit messages.                           |
| Executing Work / Setting Up `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`                       | Prepare the execution environment.                            |
| Executing Work / Verifying Completion `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`   | Confirm the work item is completed and satisfies its outcome. |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/_records/repositories/art-js.art` (Record) — Current repository record; renamed to Art MD by this milestone. Relevant for Planning Work Item.
::READ `$WORKSPACE/_records/repositories/artificials.art` (Record) — Umbrella repository record to consolidate. Relevant for Planning Work Item.
::READ `$WORKSPACE/_records/repositories/noodlestan-web.art` (Record) — Website repository record to update. Relevant for Planning Work Item.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.

## Scope

This section describes the working scope coordinated by the Milestone.

Changes in 4 repositories: the current Art JS repo is renamed to Art MD; a new Art JS repo is created and scaffolded; the placeholder libs and cli packages move from Art MD to Art JS; the Artificials umbrella and the Noodlestan website are updated to reflect the new layout.

### (Scope) Repository: Artificials

**Record:** `$WORKSPACE/_records/repositories/artificials.art`

**Role:** Umbrella project coordinating owned repositories; needs consolidation to list Art MD and Art JS.

**Partial:**

- `owner` — Project: Artificials
- `remote` — `git@github.com:noodlestan/artificials.git`

**Changes:**

- Consolidate the list of owned projects and repositories to include Art MD and Art JS.

**Dependencies:**

- None.

### (Scope) Repository: Art MD

**Record:** `$WORKSPACE/_records/repositories/art-js.art` (to be renamed)

**Role:** Created by this milestone by renaming the existing Art JS repository; hosts the md core packages (parser, serializer, constructs, primitives, spec, pipeline-tests).

**Partial:**

- `owner` — Project: Art MD (renamed from Project: Art JS)
- `remote` — `git@github.com:noodlestan/art-js.git` (to become `art-md`)

**Changes:**

- Rename repository, project, namespace, and license records from Art JS to Art MD.
- Update `$PROJECT/_guide.md` and references to the repository name.
- Remove the placeholder packages extracted to Art JS.

**Operations:**

- Rename the git remote and repository.

**Dependencies:**

- None.

### (Scope) Repository: Art JS

**Record:** To be created at `$WORKSPACE/_records/repositories/art-js.art`

**Role:** Created and scaffolded by this milestone; receives the extracted placeholder packages.

**Partial:**

- `owner` — Project: Art JS
- `remote` — `git@github.com:noodlestan/art-js.git` (new)

**Changes:**

- Create the repository and scaffold the project skeleton.
- Create project, repository, namespace, and package records.
- Receive the extracted placeholder packages from Art MD.

**Dependencies:**

- Repository: Art MD — rename must complete before extraction.

### (Scope) Repository: Noodlestan Web

**Record:** `$WORKSPACE/_records/repositories/noodlestan-web.art`

**Role:** Website to update to reflect the new repository layout.

**Partial:**

- `owner` — Project: Noodlestan Web
- `remote` — `git@github.com:noodlestan/noodlestan-web.git`

**Changes:**

- Update website content referencing the Art JS / Art MD repositories.

**Dependencies:**

- Repository: Art JS — extraction must complete before the website update.

## Execution Context

Execution occurs from `$WORKSPACE/`; the rename happens in `$PROJECT` (checkout `checkouts/art-js-planning`), the new Art JS repository is created as a new checkout, and the Artificials and Noodlestan Web checkouts are updated in their own repositories.

---

## Phases

This section describes the ordered phases used to organise downstream work, identifying blocking dependencies across resources of different owners.

| Index | Name        | Status     |
| ----- | ----------- | ---------- |
| #1    | Prepare     | `PLANNING` |
| #2    | Migrate     | `PLANNING` |
| #3    | Consolidate | `PLANNING` |

### Phase: 1 — Prepare

**Goal:** Rename the current Art JS repository to Art MD.

**Description:** Plan and execute the rename of the repository, project, namespace, and related records and references from Art JS to Art MD.

**Status:** `PLANNING`

**Dependencies:**

- None.

### Phase: 2 — Migrate

**Goal:** Create the new Art JS repository and move the placeholder packages into it.

**Description:** Create and scaffold the new Art JS repository, then extract the placeholder libs and cli packages from Art MD into Art JS.

**Status:** `PLANNING`

**Dependencies:**

- Phase 1 — Prepare: the rename must complete before extraction.

### Phase: 3 — Consolidate

**Goal:** Update the Artificials umbrella and the Noodlestan website to reflect the new repository layout.

**Description:** Consolidate the repository list in the Artificials umbrella project and update the Noodlestan website.

**Status:** `PLANNING`

**Dependencies:**

- Phase 2 — Migrate: extraction must complete before consolidation.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the milestone.

The following items are not yet captured in a work item document.

### Plan: Rename Repository to Art MD

**Status:** `DRAFT`

**Purpose:** Rename the current Art JS repository to Art MD.

**Description:** Rename repository, project, namespace, and license records, update the project guide and references, and rename the git remote.

**Changes:**

- Rename `$PROJECT/_records/project.art`, `repository.art`, `namespace.art` to Art MD.
- Update `$WORKSPACE/_records/repositories/art-js.art` to Repository: Art MD.
- Update `$PROJECT/_guide.md` and repository references.

**Dependencies:**

- None.

### Plan: Create Art JS Repository

**Status:** `DRAFT`

**Purpose:** Create and scaffold the new Art JS repository.

**Description:** Create the repository, scaffold the project skeleton, and create project, repository, namespace, and package records.

**Changes:**

- Create the Art JS repository and checkout.
- Scaffold the project skeleton and records.

**Dependencies:**

- Plan: Rename Repository to Art MD.

### Plan: Extract Libs and CLI Placeholders to Art JS

**Status:** `DRAFT`

**Purpose:** Move the placeholder packages from Art MD to Art JS.

**Description:** Extract the placeholder libs (bundler, program, validator) and cli (bin, dev-server, language-server, tools, watcher) packages from Art MD into the new Art JS repository, updating records and references.

**Changes:**

- Move placeholder packages and their records to `$ART_JS`.
- Update package records and workspace references.

**Dependencies:**

- Plan: Create Art JS Repository.

### Plan: Consolidate Repos in Artificials

**Status:** `DRAFT`

**Purpose:** Update the Artificials umbrella to list the owned projects and repositories.

**Description:** Consolidate the repository list in the Artificials umbrella project to include Art MD and Art JS.

**Changes:**

- Update the Artificials repository record and roadmap to list Art MD and Art JS.

**Dependencies:**

- Plan: Extract Libs and CLI Placeholders to Art JS.

### Plan: Update Noodlestan Website

**Status:** `DRAFT`

**Purpose:** Update the Noodlestan website to reflect the new repository layout.

**Description:** Update website content referencing the Art JS and Art MD repositories.

**Changes:**

- Update website content and links in `$NOODLESTAN_WEB`.

**Dependencies:**

- Plan: Consolidate Repos in Artificials.

---

## Work

### Next

Plan the repository rename to Art MD (Phase 1).

### Blockers

None.

---

## Operating Instructions

### Setting Up

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

Run from the workspace root:

```bash
npm ci # to install workspace dependencies.
npm run art-work clone {repo.name} # to create a new checkout of a known repository.
npm run art-work branch {branch.name} {checkout.location} # to create a working branch.
```

### Verifying Completion

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

When making changes to parser, serializer, or constructs packages, execute from `cli/pipeline-tests/`:

```bash
npm run test # runs test-parser and test-serializer against stable fixtures
```

---

## Coordination

### Not In Scope

- **Implementing placeholder packages** — the extracted packages move as scaffolds; implementation is future work in Art JS.
- **Extracting the md core packages** — parser, serializer, constructs, primitives, spec, and pipeline-tests stay in Art MD.

### Evidence

- None yet.

### Findings

- **Placeholder packages** — bundler, program, validator, bin, dev-server, language-server, tools, and watcher are scaffolds (dist, LICENSE, README only) with no real code.
- **Md core packages** — parser, serializer, constructs, primitives, and pipeline-tests carry the real code and dependencies.

### Decisions

- **Extract all placeholders** — all remaining placeholder packages move to the new Art JS repo; Art MD keeps the md core.
- **Rename first** — the current repo is renamed to Art MD before extraction begins.

### Knowledge to Update

- **Workspace records** — `$WORKSPACE/_records/repositories/art-js.art` renamed to Art MD; new Art JS record created.
- **Project records** — `$PROJECT/_records/project.art`, `repository.art`, `namespace.art` updated to Art MD.
- **Project guide** — `$PROJECT/_guide.md` updated to reflect the new repository layout.

### Follow Ups

- Update checkout records after the rename and extraction.

### Feedback

No sub-agent reports yet.
