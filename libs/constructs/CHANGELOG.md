# CHANGELOG

## 0.0.1

### Added

- **Construct registry:** open block and inline construct maps with extension via declaration merging, and the `Construct` union with `BlockContent`/`InlineContent` subsets.
- **Construct factories:** factory functions building each construct record from plain factory-data.
- **Construct Parser contract:** `ConstructProcessor`, `ConstructIntegrator`, `ConstructParser`, and `ConstructParserFactory` hooks that drive construct-agnostic detection.
- **Construct Parser registry:** ordered `CONSTRUCT_PARSERS` factory list, `DEFAULT_CONSTRUCT_PARSER` fallback, and document root creation.
- **Construct Serializer contract:** `ConstructSerializer` and `ConstructSerializerFactory`, registering adapters by construct name.
- **Construct Serializer registry:** `CONSTRUCT_SERIALIZERS` factory list for markdown restoration.
- **Document:** document root construct produced from the mdast tree.
- **Construct: Tag:** trailing `(#tag)` metadata construct shared across tag-supporting constructs.
- **Construct: NaturalExpression:** pass-through expression retaining mdast type, attributes, value, and recursive children.
- **Construct: NaturalBlock:** fallback construct capturing unclaimed block content as natural markdown.
- **Construct: FieldInline:** inline field with a `**Name:**` label, phrasing children converted to expressions, and trailing `(#tag)` tags.
- **Construct: FieldBlock:** block field with a `**Name:**` label that captures following blocks as children until a boundary construct arrives.
- **Construct: SectionBlock:** heading-based nesting construct with depth hierarchy, kind detection, and `(#tag)` tags.
- **Shared parsing helpers:** field-label detection, raw source slicing, trailing `(#tag)` extraction, and natural expression conversion.
- **Shared serialization helpers:** `(#tag)` restoration in the correct position.

### Tested

- Exhaustive unit coverage for all construct factories, parser hooks, serializers, and shared helpers.

### Documented

- Architecture references for the API, factories, parsers, and serializers.
