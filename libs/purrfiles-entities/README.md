# @noodlestan/purrfiles-entities

> Purrception entity types and a framework-agnostic meta service.

Browser-safe entity model and query service shared by docs consumers.

This package is part of the [Art MD](https://art-md.noodlestan.org) project.

## Public API

- `createMetaService(entities, options?)` — creates a framework-agnostic service for querying entities.
- `PurrfilesEntityData`, `PurrfilesEntityPartial` — the generic entity model.
- `ModuleEntityData`, `ModuleEntityPartial`, `ModuleEntityFiles`, `createModuleEntityPartial` — the `Module` entity type; `ModuleEntityData` carries `functions`, the names of the functions declared by the module.
- `getEntityTypes`, `getEntityFunctions` — entity declaration helpers.

## Usage

```ts
import { createMetaService } from '@noodlestan/purrfiles-entities';

const meta = createMetaService(entities, {
  makeEntityHref: (entity, symbol) =>
    `/${entity.package}/${entity.name}${symbol ? `#${symbol}` : ''}`,
});

const module = meta.getModuleMaybe('@art-md/parser', 'parse');
const entities = meta.getEntities();
```

## Development

Make sure you read the [Art MD README](../../README.md) first.

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
