# Plan: Update Codec Knowledge

**ID:** `update-codec-knowledge`

**Status:** `DRAFT`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Update the knowledge resources to reflect the codec and source contracts, so that the architecture documentation, records, and guides match the implemented packages.

**Description:** Update `_records/project.art`, README, root `_guide`, `architecture/components.md`, `architecture/overview.md`, `architecture/adr/codec.md`, and the primitives architecture; ensure `architecture/codec.md` matches the implementation. The knowledge updates land in the last iteration of this plan.

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

Update the knowledge resources — records, guides, architecture docs, and ADRs — to reflect the codec and source contracts, so that the documentation matches the implemented packages.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Plan.

| Kind      | Path                                                                | Role                                                   |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| Milestone | `$PROJECT/_roadmap/4-next/milestone-art-codec/milestone.md`         | Coordinates this plan within the Art Codec milestone.  |
| Design    | `$PROJECT/_roadmap/4-next/milestone-art-codec/milestone__design.md` | The design the knowledge reflects.                     |
| Spec      | `$PROJECT/architecture/codec.md`                                    | The implementation spec to keep in sync with the code. |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

This section lists all domains involved in the Plan.

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.

## Scope

Update the knowledge resources in `$PROJECT` (planning checkout) to reflect the codec and source contracts.

### (Scope) Project: Art MD

**Record:** `$PROJECT/_records/project.art`

**Role:** Project record listing the package resources.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$PROJECT/`

**Changes:**

- Add `Package: Codec` to the `Resources` list in `_records/project.art`.

**Dependencies:**

- Package: Codec — the package must exist before the record is updated.

### (Scope) Architecture: Codec Knowledge

**Record:** `$PROJECT/architecture/`

**Role:** Repository-level architecture documentation to update.

**Partial:**

- `path` — `$PROJECT/architecture/`

**Changes:**

- Update `architecture/components.md` — remove the Source package from Planned Packages; update the Codec package description (owns the configured implementation and `createCodec()`; the `ArtCodec` contract lives in primitives).
- Update `architecture/overview.md` — describe the dependency direction ContentSource → operation Context → Codec → ArtDocument, with `ArtDocumentSource` composing an `ArtContentSource` and an `ArtCodec`.
- Create `architecture/adr/codec.md` — establish context, use cases, purpose and principles; record the dependency direction decision.
- Ensure `architecture/codec.md` matches the implementation (contracts, package ownership, entry points).

**Dependencies:**

- Package: Codec — the implementation must exist before the docs are aligned.
- Package: Parser and Package: Serializer — the entry point changes must exist before the docs are aligned.

### (Scope) Knowledge: Guides

**Record:** `$PROJECT/README.md`, `$PROJECT/_guide.md`

**Role:** Repository guides listing the packages and projects.

**Partial:**

- `path` — `$PROJECT/README.md`, `$PROJECT/_guide.md`

**Changes:**

- Update `README.md` — add the `@art-md/codec` package row to the packages table.
- Update `_guide.md` — add the Codec project row to the projects table.

**Dependencies:**

- Package: Codec — the package must exist before the guides are updated.

## Execution Context

Execution occurs from `$WORKSPACE/`; the knowledge resources are updated in the planning checkout `$PROJECT` (checkout `checkouts/art-md-planning`).

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan.

Iterations are not yet defined — this is a draft plan. The change set above is captured from the milestone; iterations will be drafted when the plan is refined. The knowledge updates land in the last iteration of this plan.

## Work

### Next

This section states the immediate action needed to advance the Plan.

Draft the iterations for the knowledge updates.

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

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

---

## Coordination

### Not In Scope

- **Implementing the contracts or the codec** — handled by the implementation plans.
- **Updating the roadmap parking lot** — tracked separately.

### Evidence

- None yet.

### Findings

- **Knowledge lags implementation** — the knowledge updates land in the last iteration so the docs reflect the implemented packages.

### Decisions

- **Knowledge in the planning checkout** — the architecture docs, records, and guides are updated in `$PROJECT` where the roadmap and architecture knowledge is curated.

### Knowledge to Update

- `$PROJECT/_records/project.art` — add the Codec package resource.
- `$PROJECT/README.md` — add the codec package row.
- `$PROJECT/_guide.md` — add the Codec project row.
- `$PROJECT/architecture/components.md` — update planned packages.
- `$PROJECT/architecture/overview.md` — describe the dependency direction.
- `$PROJECT/architecture/adr/codec.md` — create the ADR.
- `$PROJECT/architecture/codec.md` — ensure it matches the implementation.

### Follow Ups

- None.

### Feedback

- None.
