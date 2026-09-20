# Plan: Extract Libs and CLI Placeholders to Art JS

**ID:** `extract-libs-and-cli-placeholders-to-art-js`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Move the placeholder packages from Art MD to Art JS.

**Description:** Extract the placeholder libs (bundler, program, validator) and cli (bin, dev-server, language-server, tools, watcher) packages from Art MD into the new Art JS repository, updating records and references.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                                  | Purpose                            |
| ------------ | ---------------------------------------------- | ---------------------------------- |
| `$WORKSPACE` | Current working directory                      | Workspace root directory           |
| `$PROJECT`   | `checkouts/art-js-planning`                    | Current checkout for planning only |
| `$ART_MD`    | `checkouts/art-md-building` (after rename)     | Repository: Art MD checkout        |
| `$ART_JS`    | `checkouts/art-js-building` (to be re-created) | Repository: Art JS checkout        |

## Summary

Move the placeholder libs and cli packages from Art MD to Art JS, update the namespace and project records in both repositories, and rename the `@art-js` scope to `@art-md` for the packages staying in Art MD.

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
::READ `$ART_JS/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.

## Scope

Move the placeholder packages from Art MD to Art JS, update the namespace and project records in both repositories, and rename the `@art-js` scope to `@art-md` for the packages staying in Art MD.

### (Scope) Repository: Art MD

**Record:** `$ART_MD/_records/repository.art`

**Role:** Hosts the md core packages (parser, serializer, constructs, primitives, spec, pipeline-tests) after extraction.

**Changes:**

- Remove the placeholder packages extracted to Art JS.
- Update `$ART_MD/_records/namespace.art` to `@art-md`.
- Update `$ART_MD/_records/project.art` resources to the md core packages.
- Rename `@art-js` → `@art-md` for the packages staying in Art MD.

**Dependencies:**

- None.

### (Scope) Repository: Art JS

**Record:** `$ART_JS/_records/repository.art`

**Role:** Receives the extracted placeholder packages.

**Changes:**

- Receive the extracted placeholder packages from Art MD.
- Update `$ART_JS/_records/namespace.art` to `@art-js`.
- Update `$ART_JS/_records/project.art` resources to the migrated packages.

**Dependencies:**

- Repository: Art MD — extraction requires the rename and creation to complete.

## Execution Context

Execution occurs from `$WORKSPACE/`; the placeholder packages move from `$ART_MD` (checkout `checkouts/art-md-building`) to `$ART_JS` (checkout `checkouts/art-js-building`), and records and knowledge are updated in both repositories.

---

## Items:

| Iteration / Instructions                                  | Status  |
| --------------------------------------------------------- | ------- |
| Iteration: Move Placeholder Packages to Art JS            | `DRAFT` |
| Iteration: Update Art JS Records                          | `DRAFT` |
| Iteration: Update Art MD Records                          | `DRAFT` |
| Iteration: Rename @art-js to @art-md for Staying Packages | `DRAFT` |
| Iteration: Update Knowledge Files                         | `DRAFT` |

### Iteration: Move Placeholder Packages to Art JS

**ID:** `move-placeholder-packages-to-art-js`

**Status:** `DRAFT`

**Purpose:** Move the placeholder libs and cli packages from Art MD to Art JS.

**Description:** Move the placeholder packages (libs/bundler, libs/program, libs/validator, cli/bin, cli/dev-server, cli/language-server, cli/tools, cli/watcher) from `$ART_MD` to `$ART_JS`, including their `_records/` and package files.

**Changes:**

- Move the placeholder packages and their records to `$ART_JS`.

**Dependencies:**

- Plan: Create Art JS Repository.

### Iteration: Update Art JS Records

**ID:** `update-art-js-records`

**Status:** `DRAFT`

**Purpose:** Update the Art JS namespace and project records to the migrated scope.

**Description:** Update `$ART_JS/_records/namespace.art` to `@art-js` and `$ART_JS/_records/project.art` resources to the 8 migrated packages.

**Changes:**

- Update package records and references in project `$ART_JS`.

**Dependencies:**

- Iteration: Move Placeholder Packages to Art JS.

### Iteration: Update Art MD Records

**ID:** `update-art-md-records`

**Status:** `DRAFT`

**Purpose:** Update the Art MD namespace and project records to the md core scope.

**Description:** Update `$ART_MD/_records/namespace.art` to `@art-md` and `$ART_MD/_records/project.art` resources to the 6 md core packages.

**Changes:**

- Update the namespace and project records in `$ART_MD`.

**Dependencies:**

- Iteration: Move Placeholder Packages to Art JS.

### Iteration: Rename @art-js to @art-md for Staying Packages

**ID:** `rename-art-js-to-art-md-for-staying-packages`

**Status:** `DRAFT`

**Purpose:** Rename the `@art-js` scope to `@art-md` for the packages staying in Art MD.

**Description:** Rename package.json `name` and `Canonical Name` in `_records/package.art` from `@art-js/*` to `@art-md/*` for the 6 packages staying in `$ART_MD`.

**Changes:**

- Rename the scope for the md core packages.

**Dependencies:**

- Iteration: Update Art MD Records.

### Iteration: Update Knowledge Files

**ID:** `update-knowledge-files`

**Status:** `DRAFT`

**Purpose:** Update README, `_guide.md`, and package.json descriptions in both repositories.

**Description:** Update the README, `$ART_MD/_guide.md`, `$ART_JS/_guide.md`, and package.json descriptions to match the new repository scopes.

**Changes:**

- Update the README, `_guide.md`, and package.json description to match Art JS records.

**Dependencies:**

- Iteration: Rename @art-js to @art-md for Staying Packages.

---

## Work

### Next

Refine the drafted iterations and write instructions for the extract plan.

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

- **Implementing placeholder packages** — the extracted packages move as scaffolds; implementation is future work in Art JS.
- **Renaming the current repository to Art MD** — Covered by the sibling plan `plan-rename-repository-to-art-md`.
- **Creating the Art JS repository** — Covered by the sibling plan `plan-create-art-js-repository`.

### Evidence

- None yet.

### Findings

- **Placeholder packages** — bundler, program, validator, bin, dev-server, language-server, tools, and watcher are scaffolds (dist, LICENSE, README only) with no real code.
- **Md core packages** — parser, serializer, constructs, primitives, and pipeline-tests carry the real code and dependencies.
- **No package.json** — `cli/language-server` and `cli/tools` have no `package.json` (only `_records/` + `README.md`); placeholders have empty `devDependencies`.

### Decisions

- **Extract all placeholders** — all remaining placeholder packages move to the new Art JS repo; Art MD keeps the md core.
- **Rename scope in extract plan** — the `@art-js` → `@art-md` renames (package.json `name` + `Canonical Name`) happen only during this plan, not the rename plan.

### Knowledge to Update

- **README, `_guide.md`, `package.json`** — update in both `$ART_MD` and `$ART_JS` to the new scopes.

### Follow Ups

- **Update checkout records** after the extraction.

### Feedback

- None.
