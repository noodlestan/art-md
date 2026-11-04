# CHANGELOG

## 0.0.1

### Added

- **Generic module extractor:** `createModuleEntityExtractor(options?)` extracts `Module` entities from a TypeScript source tree without requiring an `index.ts`, backed by file-resolution helpers (`findIndexFile`, `findModuleEntryFile`, `findModuleSourceFiles`, `findTypesFile`, `isSourceFile`) and the `@noodlestan/purrfiles-entities` entity model.
