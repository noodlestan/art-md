# CHANGELOG

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
