# Plan: Create Codec Spec

**ID:** `create-codec-spec`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Capture the entire scope of Phase 1 (Spec): create `architecture/codec.md` as the implementation spec and lock down all implementation details in `milestone__design.md`, so the downstream plans implement against a single authoritative design.

**Description:** A delegation plan that continues the current session with another agent to refine the contracts and changes for the remaining plans. It locks down the design in `milestone__design.md`, projects it into `architecture/codec.md`, registers the spec in the architecture index, and refines the remaining plan drafts to match the locked-down design.

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

Lock down the codec and source design in `milestone__design.md`, create `architecture/codec.md` as the implementation spec, register it in the architecture index, and refine the remaining plan drafts to match the locked-down design, so that the downstream implementation plans have a single authoritative spec to implement against.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

This section lists the upstream sources of work that influence the goals, scope, and constraints of this Plan.

| Kind         | Path                                                                | Role                                                        |
| ------------ | ------------------------------------------------------------------- | ----------------------------------------------------------- |
| Milestone    | `$PROJECT/_roadmap/4-next/milestone-art-codec/milestone.md`         | Coordinates this plan within the Art Codec milestone.       |
| Design       | `$PROJECT/_roadmap/4-next/milestone-art-codec/milestone__design.md` | The design this plan locks down and projects into the spec. |
| Architecture | `$PROJECT/architecture/components.md`                               | Planned packages: Codec and Source (Source superseded).     |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.
- `delegate-plan` — Delegates plan iteration instructions to worker agents and integrates the delegations back into the plan. Required for the delegation iterations.

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

Capture the entire scope of Phase 1 (Spec): lock down the design in `milestone__design.md`, create `architecture/codec.md` as the implementation spec, register it in `architecture/index.md`, and refine the remaining plan drafts to match the locked-down design.

### (Scope) Architecture: Codec Spec

**Role:** The implementation spec for the codec and source contracts.

**Path:** `$PROJECT/architecture/codec.md` (to be created)

**Changes:**

- Create `architecture/codec.md` capturing:
  - The primitives layout: `codec/` (`ArtCodec` contract), `source/` (`ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`), `parser/context/` (`ParseContext`, `ParserContextData`, `createParseContext()`), `serializer/context/` (`SerializeContext`, `SerializerContextData`, `createSerializeContext()`).
  - The contracts and their responsibilities, including the overloaded `ArtCodec` API (`(markdown)` | `(context, markdown)`).
  - The codec package ownership: `@art-md/codec` owns `ArtCodecConfig`, `createCodec()`, and the configured implementation; no source I/O in the codec.
  - The dependency direction: ArtDocumentSource → ArtCodec → ArtContentSource; operation contexts independent of content sources.
  - The entry point changes: parser `parse(markdown, config)` | `parse(context, markdown, config)`; serializer `serialize(document, config)` | `serialize(context, document, config)`.
- Update `architecture/index.md` — add a row for `codec.md` in the Documents table.

**Dependencies:**

- None.

### (Scope) Architecture: Design Attachment

**Role:** The authoritative design source for the spec and downstream plans.

**path:** `$PROJECT/_roadmap/4-next/milestone-art-codec/milestone__design.md`

**Changes:**

- Lock down all implementation details in `milestone__design.md`:
  - Contracts: `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, `ParseContext`/`ParserContextData`, `SerializeContext`/`SerializerContextData`, `ParseResult`/`SerializeResult`.
  - Operation contexts: `ParseContext`/`SerializeContext` carry `uri: string` (the ContentSource uri); constructors `createParseContext(data: ParserContextData)` / `createSerializeContext(data: SerializerContextData)`.
  - Overloaded entry points: `parse(markdown, config)` | `parse(context, markdown, config)`; `serialize(document, config)` | `serialize(context, document, config)`; `ArtCodec` `(markdown)` | `(context, markdown)`.
  - Dependency direction: ArtDocumentSource → ArtCodec → ArtContentSource; operation contexts independent of content sources.

**Dependencies:**

- None.

### (Scope) Plans: Remaining Plan Drafts

**Record:** `$PROJECT/_backlog_/6-plan/`

**Role:** The remaining plan drafts to refine against the locked-down design.

**Partial:**

- `path` — `$PROJECT/_backlog_/6-plan/`

**Changes:**

- Refine `plan-implement-primitives-contracts` — contracts in primitives (codec, source, parser/context, serializer/context).
- Refine `plan-implement-codec-package` — codec package ownership.
- Refine `plan-update-parser-serializer-entry-points` — overloaded entry points.
- Refine `plan-update-codec-knowledge` — knowledge updates.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; the design, spec, and plan drafts are written in the planning checkout `$PROJECT` (checkout `checkouts/art-md-planning`). This is a delegation plan: iterations are delegated to worker agents via the `delegate-plan` skill.

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                               | Status  |
| ------------------------------------------------------------------------------------------------------ | ------- |
| Iteration: Lock Down Design `./instructions/lock-down-design.md`                                       | `READY` |
| Iteration: Create Codec Implementation Spec `./instructions/create-codec-spec.md`                      | `READY` |
| Iteration: Register Spec in Architecture Index `./instructions/register-spec-in-architecture-index.md` | `READY` |
| Iteration: Refine Remaining Plan Drafts `./instructions/refine-remaining-plan-drafts.md`               | `READY` |

### Iteration: Lock Down Design

**Id:** `lock-down-design`

**Status:** `READY`

**Purpose:** Refine the design attachment with all implementation details so it is the authoritative source for the spec and downstream plans.

**Description:** Continue the session to refine the contracts and changes in `milestone__design.md`: contracts in primitives, codec package, operation contexts, overloaded entry points, and dependency direction.

**Changes:**

- Refine `milestone__design.md` with all implementation details.
- Lock down the contracts: `ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, `ParseContext`/`ParserContextData`, `SerializeContext`/`SerializerContextData`, `ParseResult`/`SerializeResult`.
- Lock down the operation contexts: `ParseContext`/`SerializeContext` carry `uri: string` (the ContentSource uri); constructors `createParseContext(data: ParserContextData)` / `createSerializeContext(data: SerializerContextData)`.
- Lock down the overloaded entry points: `parse(markdown, config)` | `parse(context, markdown, config)`; `serialize(document, config)` | `serialize(context, document, config)`; `ArtCodec` `(markdown)` | `(context, markdown)`.
- Lock down the dependency direction: ArtDocumentSource → ArtCodec → ArtContentSource; operation contexts independent of content sources.

**Dependencies:**

- None.

#### Commits:

| ID                 | Repository / Checkout / Branch   | Policy   | Hash | Status     |
| ------------------ | -------------------------------- | -------- | ---- | ---------- |
| `lock-down-design` | Art MD / `$PROJECT` / `planning` | `NOPUSH` |      | `AUTHORED` |

##### Commit: `lock-down-design`

**Message:**

```text
docs(architecture): Lock down codec and source design details.
```

---

### Iteration: Create Codec Implementation Spec

**Id:** `create-codec-spec`

**Status:** `READY`

**Purpose:** Create `architecture/codec.md` as the implementation spec capturing the design.

**Description:** Write the implementation spec capturing the design from `milestone__design.md`: contracts in primitives, codec package, operation contexts, overloaded entry points, and dependency direction.

**Changes:**

- Create `architecture/codec.md` capturing:
  - The primitives layout: `codec/` (`ArtCodec` contract), `source/` (`ArtContentSource`, `ArtDocumentSource`, `createArtDocumentSource()`), `parser/context/` (`ParseContext`, `ParserContextData`, `createParseContext()`), `serializer/context/` (`SerializeContext`, `SerializerContextData`, `createSerializeContext()`).
  - The contracts and their responsibilities, including the overloaded `ArtCodec` API (`(markdown)` | `(context, markdown)`).
  - The codec package ownership: `@art-md/codec` owns `ArtCodecConfig`, `createCodec()`, and the configured implementation; no source I/O in the codec.
  - The dependency direction: ArtDocumentSource → ArtCodec → ArtContentSource; operation contexts independent of content sources.
  - The entry point changes: parser `parse(markdown, config)` | `parse(context, markdown, config)`; serializer `serialize(document, config)` | `serialize(context, document, config)`.
- Update `architecture/index.md` — add a row for `codec.md` in the Documents table.

**Dependencies:**

- Iteration: Lock Down Design.

#### Commits:

| ID                  | Repository / Checkout / Branch   | Policy   | Hash | Status     |
| ------------------- | -------------------------------- | -------- | ---- | ---------- |
| `create-codec-spec` | Art MD / `$PROJECT` / `planning` | `NOPUSH` |      | `AUTHORED` |

##### Commit: `create-codec-spec`

**Message:**

```text
docs(architecture): Add codec implementation spec.
```

---

### Iteration: Refine Remaining Plan Drafts

**Id:** `refine-remaining-plan-drafts`

**Status:** `READY`

**Purpose:** Refine the contracts and changes for the remaining plans to match the locked-down design.

**Description:** Update the remaining plan drafts (implement-primitives-contracts, implement-codec-package, update-parser-serializer-entry-points, update-codec-knowledge) to reflect the locked-down design.

**Changes:**

- Refine `plan-implement-primitives-contracts` — contracts in primitives (codec, source, parser/context, serializer/context).
- Refine `plan-implement-codec-package` — codec package ownership.
- Refine `plan-update-parser-serializer-entry-points` — overloaded entry points.
- Refine `plan-update-codec-knowledge` — knowledge updates.

**Dependencies:**

- Iteration: Create Codec Implementation Spec.

#### Commits:

| ID                             | Repository / Checkout / Branch   | Policy   | Hash | Status     |
| ------------------------------ | -------------------------------- | -------- | ---- | ---------- |
| `refine-remaining-plan-drafts` | Art MD / `$PROJECT` / `planning` | `NOPUSH` |      | `AUTHORED` |

##### Commit: `refine-remaining-plan-drafts`

**Message:**

```text
docs(plans): Refine remaining plan drafts to match the locked-down design.
```

---

## Work

### Next

This section states the immediate action needed to advance the Plan.

Delegate the next `PLANNED` instruction: `lock-down-design`.

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

- **Implementing the contracts** — the spec describes the design; implementation is in the downstream plans.
- **Updating the architecture knowledge** — `components.md`, `overview.md`, and ADRs are updated by the knowledge plan.

### Evidence

- None yet.

### Findings

- **Design attachment is the source** — the design details live in `milestone__design.md`; the spec document is the implementation-facing projection of it.
- **Delegation plan** — this plan continues the current session with another agent to refine the contracts and changes for the remaining plans.

### Decisions

- **Spec first** — the spec is created before any implementation plan so downstream plans implement against a single authoritative document.
- **Design locked down first** — `milestone__design.md` is refined and locked down before the spec is projected from it.

### Knowledge to Update

- `$PROJECT/architecture/index.md` — add the `codec.md` row.

### Follow Ups

- None.

### Feedback

- None.
