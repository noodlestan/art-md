# @noodlestan/purrfiles-extract

> Purrception extraction tools for TypeScript source trees.

Extracts generic `Module` entities from a TypeScript source tree. It consumes the `@noodlestan/purrfiles-entities` entity model and does not require an `index.ts`: when a directory has no index file, a same-name module entry file is used as docs source.

Every directory is a module. Subdirectories are extracted too, and their `module` field is set to the parent directory name. Directories holding nothing but subdirectories are not modules. Every source file in a module directory is read, with these roles:

- `index.*`: module docs.
- `types.*`: module types.
- any other source file (including `constants.*`): functions and other declared symbols.

Test files (`*.test.ts`) and declaration files (`*.d.ts`) are skipped. Overloaded declarations are collapsed into a single function name.

Source extensions default to `.ts`, `.tsx`, `.mts`, and `.cts`. JavaScript is not supported, since `@purrception/lang-ts-extract` builds its compiler host without `allowJs`.

This package is part of the [Art MD](https://art-md.noodlestan.org) project.

## Public API

- `createModuleEntityExtractor(options?)` — creates a directory extractor for `Module` entities. Options: `matcher`, `resolver`, `extensions`, `ignore`, `skipSubDirs`.
- `findIndexFile`, `findModuleEntryFile`, `findModuleSourceFiles`, `findTypesFile`, `isSourceFile` — file resolution helpers.

## Usage

```ts
import { createModuleEntityExtractor } from '@noodlestan/purrfiles-extract';
import { extractEntitiesFromFileSystem } from '@purrception/source-fs';

const extracted = await extractEntitiesFromFileSystem({
  rootDir: 'src/',
  extractors: [createModuleEntityExtractor()],
  meta: { package: 'my-package' },
});
```

## Development

Make sure you read the [Art MD README](../../README.md) first.

### Build Targets

This package is meant for use in Node.js environments. The entry point is built using `esbuild` pre-configured by [Workspace Tooling](https://github.com/noodlestan/workspace-tooling).

### Scripts

- **$** `npm run dev` — Watch mode for development
- **$** `npm run build` — Build the library
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run ci` — Run CI pipeline
- **$** `npm run test` — Run tests

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
