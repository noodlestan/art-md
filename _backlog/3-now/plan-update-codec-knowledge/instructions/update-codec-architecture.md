# Instructions: `update-codec-architecture`

**Plan:** `update-codec-knowledge`

**Iteration Id:** `update-codec-architecture`

## Before You Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-update-codec-knowledge/instructions/update-codec-architecture__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-codec-architecture`, created {artefacts}, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-codec-architecture`, created {artefacts}, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Align the architecture documentation with the implemented codec and source contracts. Commit `docs(codec): update architecture knowledge`.

## Mandatory Reading

- Design attachment (authoritative source code + file locations): `$PROJECT/_roadmap/3-now/milestone-art-codec/milestone__design.md` — read `## Codec Package (@art-md/codec)`, `## Relationships`, and `## Layering`.
- Spec (the implementation spec to keep in sync): `$PROJECT/architecture/codec.md`.
- Prerequisite: this iteration depends on `implement-codec-package` (the `@art-md/codec` package exists) and `update-parser-serializer-entry-points` (the overloaded entry points exist).
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

---

## Changes

This iteration aligns the architecture documentation with the implemented codec and source contracts.

- Step 1 / 5 — Update `architecture/components.md`
- Step 2 / 5 — Update `architecture/overview.md`
- Step 3 / 5 — Create `architecture/adr/codec.md`
- Step 4 / 5 — Verify `architecture/codec.md` matches the implementation
- Step 5 / 5 — Commit `update-codec-architecture`

## Steps

### Step `1 / 5` — Update `architecture/components.md`

**Goal:** Update the components doc for the implemented codec and remove the Source package from planned packages.

**Execute:**

1. In `$PROJECT/architecture/components.md`, update the `### Codec (@art-md/codec)` section: change `**Status:** PLANNED` to `**Status:** IMPLEMENTED` and update the primary types line to `Primary types: ArtCodecConfig, PartialArtCodecConfig, createArtCodec(). Responsibility: parse and serialise ArtDocument using configured constructs.`
2. Remove the `### Source (@art-md/source)` section (the source contracts live in `@art-md/primitives`; no `@art-md/source` package is created).

**Expected:** `components.md` reflects the implemented codec and no longer lists a planned Source package.

### Step `2 / 5` — Update `architecture/overview.md`

**Goal:** Align the overview with the implemented codec layer.

**Execute:**

1. In `$PROJECT/architecture/overview.md`, update the `### The Codec Layer: @art-md/codec` section: change `**Status:** Planned` to `**Status:** Implemented` and confirm the description matches the implementation (the `ArtCodec` contract lives in `@art-md/primitives` under `codec/`; `@art-md/codec` owns the configured implementation and `createArtCodec()`; the overloaded `parse`/`serialize` API owns the construct configuration; dependency direction `ArtDocumentSource` → `ArtCodec` → `ArtContentSource`).

**Expected:** `overview.md` reflects the implemented codec layer.

### Step `3 / 5` — Create `architecture/adr/codec.md`

**Goal:** Record the codec architecture decision.

**Execute:**

1. Create `$PROJECT/architecture/adr/codec.md`:

```markdown
# Codec

**Purpose:** Decisions about the codec and source contracts — the `@art-md/codec` package and the source contracts in `@art-md/primitives`.

## Decision: Contracts in Primitives

**Status:** Adopted

**Context:** The codec and source abstractions are shared across parser, serializer, and concrete content sources.

**Decision:** The `ArtCodec`, `ArtContentSource`, and `ArtDocumentSource` contracts live in `@art-md/primitives`. `@art-md/codec` provides the codec implementation `createArtCodec()`.

**Consequences:** The contracts have a stable, dependency-light home that can be consumed by different implementations. The codec package can evolve independently, while alternative codec and source implementations remain loosely coupled to the rest of the system.

## Decision: Dependency Direction

**Status:** Adopted

**Context:** A document source composes a content source and a codec. The dependency direction must be explicit and acyclic.

**Decision:** The `ArtDocumentSource` is final and composes an `ArtContentSource` and an `ArtCodec`. The codec depends only on the content-level abstractions it needs and concrete content sources implement read/write without depending on the codec or document source. `ParseContext` and `SerializeContext` remain independent of content sources.

## Decision: Codec Owns Construct Configuration

**Status:** Adopted

**Context:** The codec exposes a streamlined document-level API. The codec construct configuration must be passed once, not passed per call.

**Decision:** A codec is created with its construct configuration and retains that configuration for its document-level operations. Its `parse()` and `serialize()` methods therefore operate against the codec's configured constructs rather than receiving configuration for each call.
```

**Expected:** `architecture/adr/codec.md` records the codec decisions.

### Step `4 / 5` — Verify `architecture/codec.md` matches the implementation

**Goal:** Confirm the implementation spec matches the implemented packages.

**Execute:**

1. Read `$PROJECT/architecture/codec.md` and confirm it matches the implementation: the `ArtCodec` contract in `@art-md/primitives` under `codec/`, the `@art-md/codec` package owning `createArtCodec()`, the overloaded entry points, and the dependency direction.
2. If any detail is stale (e.g. a signature or file location), update it to match the implementation.

**Expected:** `architecture/codec.md` matches the implemented packages.

### Step `5 / 5` — Commit `update-codec-architecture`

---

#### Commit: `update-codec-architecture`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
arch(codec): update architecture knowledge
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed but NOT pushed (policy `NOPUSH`).
- Verify `architecture/components.md` reflects the implemented codec and no longer lists a planned Source package.
- Verify `architecture/overview.md` reflects the implemented codec layer.
- Verify `architecture/adr/codec.md` exists and records the codec decisions.
- Verify `architecture/codec.md` matches the implementation.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
