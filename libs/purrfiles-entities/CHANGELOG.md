# CHANGELOG

## 0.0.1

### Added

- **Entity model:** `PurrfilesEntityData` / `ModuleEntityData` types carrying `module` and `path`, and the canonical `getEntityTypes` / `getEntityFunctions` helpers for typed symbol access.
- **Meta service:** `createMetaService(entities, options?)` indexes entities by package, type, and name, exposing entity, package, and module lookups plus `resolveEntityExpression` and `resolveLink` for `{@link …}` targets (with an optional `makeEntityHref`).
