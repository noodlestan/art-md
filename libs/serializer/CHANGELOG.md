# CHANGELOG

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
