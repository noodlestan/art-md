# Sub-Agent REPORT (worker)

**Plan:** `use-website-url-in-docs`

**Iteration Id:** `update-package-readmes`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| #   | Goal (from instruction `## Goals`)                             | Commit    | Status      |
| --- | -------------------------------------------------------------- | --------- | ----------- |
| 1   | Point every package README at the published website            | `9f8d7da` | `COMMITTED` |
| 2   | Rename the legacy `artificial-*` headings to the package names | `9f8d7da` | `COMMITTED` |

| Commit                             | Repository / Checkout / Branch   | Policy   | Push       |
| ---------------------------------- | -------------------------------- | -------- | ---------- |
| `9f8d7da` `update-package-readmes` | Art MD / `$PROJECT` / `building` | `NOPUSH` | Not pushed |

#### Files changed

- `$PROJECT/libs/primitives/README.md` — replaced the toolkit sentence with the website link; renamed `# artificial-primitives` to `# @art-md/primitives`.
- `$PROJECT/libs/parser/README.md` — replaced the toolkit sentence with the website link; renamed `# artificial-parser` to `# @art-md/parser`.
- `$PROJECT/libs/serializer/README.md` — replaced the toolkit sentence with the website link; renamed `# artificial-serializer` to `# @art-md/serializer`.
- `$PROJECT/libs/constructs/README.md` — replaced the toolkit sentence with the website link; renamed `# artificial-constructs` to `# @art-md/constructs`.
- `$PROJECT/cli/bin/README.md` — replaced the toolkit sentence with the website link; renamed `# Artificial Bin` to `# @art-md/bin`.
- `$PROJECT/cli/codec-tests/README.md` — replaced the toolkit sentence with the website link; heading left as `# Codec Tests` per instruction.

No other link, blockquote, or file in the repository was touched. `$PROJECT/libs/codec/README.md` was left untouched (`# @art-md/codec` is already current).

### Verification

| Check                                               | Command                                                    | Result                                               |
| --------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| Setting Up                                          | `npm ci` (from `$WORKSPACE` and from `$PROJECT`)           | 15 and 603 packages installed, no errors             |
| Markdown formatting before commit                   | `npx prettier . -c` (from `$PROJECT`)                      | `All matched files use Prettier code style!`         |
| Pre-commit hook (lint, test, build)                 | `npm run ci` (from `$PROJECT`)                             | 7/7 turbo tasks successful; 43 codec fixtures passed |
| Verifying Completion before commit                  | `npm run ci` (from `$PROJECT`)                             | 7/7 turbo tasks successful; 43 codec fixtures passed |
| One commit created, none pushed                     | `git --no-pager log -1 --format='%h %s'`                   | `9f8d7da docs(art-md): update package READMEs`       |
| Branch has no upstream, no push performed           | `git status --short --branch`                              | `## building`; no upstream tracking ref              |
| Old toolkit sentence gone                           | `grep -rn "Art MD toolkit" --include="README.md" libs cli` | No matches                                           |
| Website link present in all six package READMEs     | `grep -rn "art-md.noodlestan.org" --include="README.md"`   | 6 hits, one per package README, all on line 7        |
| All README headings current                         | `grep -rn "^# " --include="README.md" libs cli`            | All `@art-md/*` except `# Codec Tests` (untouched)   |
| No `artificial-*` or `Artificial Bin` title remains | `grep -rniE "^# (artificial-\|Artificial Bin)" ...`        | No matches                                           |
| Formatting holds on the committed tree              | `npx prettier . -c` (from `$PROJECT`)                      | `All matched files use Prettier code style!`         |
| Working tree clean after the commit                 | `git status --short`                                       | No output                                            |

### Findings

- **`libs/constructs/README.md` carried a sentence variant** — the file held `This package is part of the [Art MD toolkit](../../README.md).` (no trailing ` toolkit.`), so the literal old string in the instruction did not match. Replaced with the same new sentence as the other five files, per the plan's `## Scope` resource `Package Readmes` which lists this file for the same replacement.
- **The prescribed verification grep is too broad** — `grep -rn "part of the" --include="README.md" libs cli` still matches after the change because the new sentence (`This package is part of the [Art MD](https://art-md.noodlestan.org) project.`) also contains `part of the`. The literal old sentence was confirmed gone with `grep -rn "Art MD toolkit" --include="README.md" libs cli` (no matches); both commands were run.

## Blockers (if any)

None.
