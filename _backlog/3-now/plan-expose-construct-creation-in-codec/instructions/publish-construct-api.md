# Instructions: `publish-construct-api`

**Plan:** `expose-construct-creation-in-codec`

**Iteration Id:** `publish-construct-api`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/publish-construct-api__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `publish-construct-api`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory.             |
| `$PROJECT`   | `checkouts/art-md`        | Checkout where execution takes place. |

Package paths used in the steps: `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/`.

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `publish-construct-api`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Republish `@art-md/primitives` (with the extended `ArtCodec` contract) and `@art-md/codec` (with the construct factory API) so consumers can adopt the new surface. Both packages are bumped, changelotted, verified, committed, and published to the public npm registry.

## Mandatory Reading

- Guide: `$PROJECT/_guide.md` — Setting Up, Verifying Completion.
- Guide: `$WORKSPACE/_guide.md` — Setting Up, Verifying Completion.
- Conventions: TypeScript — `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md`.
- Reference: `$PROJECT/libs/primitives/_records/npm-deployment.art` — registry, access, and deployment command for primitives.
- Reference: `$PROJECT/libs/codec/_records/npm-deployment.art` — registry, access, and deployment command for codec.
- Reference: `$PROJECT/libs/primitives/CHANGELOG.md` and `$PROJECT/libs/codec/CHANGELOG.md` — the section structure to follow.
- Reference: `$PROJECT/_backlog/3-now/plan-expose-construct-creation-in-codec/instructions/define-construct-api-on-codec__report.md` — what is being released.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Verifying Completion

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

**Instructions:** (From `$PROJECT/_guide.md`)

Confirm each published package resolves the expected version (from any directory):

```bash
npm view @art-md/primitives version
npm view @art-md/codec version
```

---

## Changes

Bump `@art-md/primitives` from `0.0.6` and `@art-md/codec` from `0.0.3`, add a changelog section to each, verify the repository, commit both packages, then publish primitives first (codec depends on it) and confirm the registry versions.

- Step 1 / 5 — Bump both package versions
- Step 2 / 5 — Add changelog sections
- Step 3 / 5 — Verify the release build
- Step 4 / 5 — Commit `publish-construct-api`
- Step 5 / 5 — Publish both packages and confirm the registry

## Steps

### Step `1 / 5` — Bump both package versions

In `$PROJECT/libs/primitives/package.json`, set `"version": "0.0.7"`.

In `$PROJECT/libs/codec/package.json`, set `"version": "0.0.4"`.

Leave every `@art-md/*` dependency range as `"*"` — that is this repository's convention for internal packages, so no range is aligned with the bump.

Do not run `npm version`: it writes its own git commit, and the whole release must land as the single `publish-construct-api` commit.

### Step `2 / 5` — Add changelog sections

Follow the structure already in each file: `# CHANGELOG`, then `## {version}`, then `### Added` bullets.

In `$PROJECT/libs/primitives/CHANGELOG.md`, above the `## 0.0.6` section:

```md
## 0.0.7

### Added

- **Codec construct API** — `ArtCodec` gains `getConstructFactory(name)`, `create<C>(name, ...args)`, and `toText(construct)`.
- **Codec factory types** — `ConstructFactoryFunction` and `ConstructFactoryEntry` describe the registry entries any package can contribute.
```

In `$PROJECT/libs/codec/CHANGELOG.md`, above the `## 0.0.3` section:

```md
## 0.0.4

### Added

- **Construct registry config** — `ArtCodecConfig.factories` supplies the construct factory list, defaulting to `FACTORIES` from `@art-md/constructs`.
- **Factory lookup and creation** — codec instances build their `name => factory` index lazily and create construct instances; `Document` is not creatable and shares the not-found error with any unknown name.
- **`toText`** — reads a construct's text, walking `value` and recursive `children`.
```

Wording may be adjusted, but the versions, sections, and facts must hold. Never claim a behaviour you cannot verify in Step 3.

### Step `3 / 5` — Verify the release build

From `$PROJECT/`:

```bash
npm run ci
```

Confirm in the output that both packages lint, build, and test — the publish ships `dist/`, so a failed build means publishing stale code.

From `$PROJECT/`, confirm the working tree holds exactly the four files you changed (two `package.json`, two `CHANGELOG.md`) and nothing else.

If verification fails, fix within this iteration's scope or REPORT A BLOCKER — never publish with a red build.

### Step `4 / 5` — Commit `publish-construct-api`

---

#### Commit: `publish-construct-api`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```text
release(art-md): Republish primitives and codec with construct API
```

Stage only the four changed files under `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/`. Format first with the project's own command:

```bash
cd $PROJECT && npm run lint:fix
```

The pre-commit hook runs `npm run clean` and `npm run ci`; both must pass for the commit to be created. `NOPUSH` forbids `git push`, not `npm publish` — Step 5 still publishes.

### Step `5 / 5` — Publish both packages and confirm the registry

First confirm authentication, since publishing cannot proceed unattended without it:

```bash
npm whoami
```

If `npm whoami` fails, or `npm publish` demands an OTP/2FA code you cannot provide, STOP and REPORT A BLOCKER with the exact output — do not attempt workarounds.

Publish in dependency order, primitives before codec:

```bash
cd $PROJECT/libs/primitives && npm publish
cd $PROJECT/libs/codec && npm publish
```

Both records declare registry `https://registry.npmjs.org` with `public` access, already configured by each package's `publishConfig`. If npm refuses because the version already exists, REPORT A BLOCKER with the output rather than changing versions.

Confirm the registry now serves the new versions (the **Verifying Step** commands):

```bash
npm view @art-md/primitives version # 0.0.7
npm view @art-md/codec version # 0.0.4
```

Record both versions in your report.

## Final Verification

**Instructions:**

- Verify that the commit has been created and has NOT been pushed, per the `NOPUSH` policy.
- Verify that `$PROJECT/libs/primitives/package.json` reads `0.0.7` and `$PROJECT/libs/codec/package.json` reads `0.0.4`, and that every `@art-md/*` dependency range is still `"*"`.
- Verify that both CHANGELOG files open with the new section above the previous one.
- Verify that `npm view` returns `0.0.7` for primitives and `0.0.4` for codec.
- Verify that no file outside `$PROJECT/libs/primitives/` and `$PROJECT/libs/codec/` was changed.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
