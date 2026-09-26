# CHANGELOG

## 0.0.2

### Added

- **Config injection:** `createDefaultParserConfig()` and the `ParserConfig` type are now exported from the package entry point, so callers can supply their own construct list and default construct.
- **Context-aware overload:** a new `parse(context, markdown, config)` overload accepts a leading `ParseContext`, which is threaded into the document visit and returned on the result.

### Changed

- **BREAKING — entry point signature:** `parse(markdown)` becomes `parse(markdown, config)`. The `ParserConfig` argument is mandatory, and the context-free overload builds a default `ParseContext` internally.
- **BREAKING — return type:** `parse()` now returns a `ParseResult` (`{ document, context }`) instead of a bare `ArtDocument`. Read `result.document` to obtain the document.

### Tested

- Unit coverage for both `parse()` overloads, covering config-driven construction, parse context propagation, and the defaulted context.

### Documented

- `architecture/api.md` updated with the new entry point signatures and the `ParseResult` return contract.

## 0.0.1

### Added

- **Markdown parsing:** `parse(markdown)` transforms raw markdown into an `ArtDocument`.
- **Construct-agnostic detection:** drives construct recognition purely through the `@art-md/constructs` contract types, never naming a concrete construct.
- **Parser config:** configurable `defaultConstruct` fallback and ordered construct list, bundled into a default config.
- **Document builder:** mdast visit loop that claims nodes through construct processors, integrates records with nesting-aware context mutation, and falls back to a default construct for unclaimed block content.
- **Document context:** mdast tree generation, document root creation, and source wrapping into a parser visit context.
- **Mdast helpers:** block-type classification driving natural-content fallback.

### Tested

- Unit coverage for parse entry point, default config, document builder, document context, and mdast helpers.

### Documented

- Architecture references for the parser API, mdast mapping, and document builder.
