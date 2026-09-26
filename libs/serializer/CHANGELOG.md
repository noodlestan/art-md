# CHANGELOG

## 0.0.2

### Added

- **Config injection:** `createDefaultSerializerConfig()` and the `SerializerConfig` type are now exported from the package entry point, so callers can supply their own construct serializer list.
- **Context-aware overload:** a new `serialize(context, document, config)` overload accepts a leading `SerializeContext`, which is threaded through and returned on the result.

### Changed

- **BREAKING — entry point signature:** `serialize(document)` becomes `serialize(document, config)`. The `SerializerConfig` argument is mandatory, and the document-first overload builds a default `SerializeContext` internally.
- **BREAKING — return type:** `serialize()` now returns a `SerializeResult` (`{ content, context }`) instead of a bare markdown string. Read `result.content` to obtain the markdown.
- **Entry point relocation:** the entry point moved from `serializer.ts` into a dedicated `serialize.ts` module.

### Tested

- Unit coverage for both `serialize()` overloads, covering config-driven conversion, serialize context propagation, and the defaulted context.

### Documented

- `architecture/api.md` updated with the new entry point signatures and the `SerializeResult` return contract.

## 0.0.1

### Added

- **Markdown serialization:** `serialize(document)` transforms an `ArtDocument` back into a markdown string.
- **Construct-agnostic conversion:** drives mdast conversion purely through the `@art-md/constructs` serializer contract, never naming a concrete construct.
- **Serializer config:** configurable list of construct serializer factories bundled into a default config, registered into a registry keyed by construct name.
- **Art AST to mdast conversion:** recursive bottom-up visit of the construct tree, producing mdast nodes with sibling placement for nested block content and inline children for phrasing constructs.
- **Markdown rendering:** applies `-` bullets and `_` emphasis through `mdast-util-to-markdown`.

### Tested

- Unit coverage for the serialize entry point, default config, and art AST to mdast conversion.

### Documented

- Architecture references for the serializer API and conversion algorithm.
