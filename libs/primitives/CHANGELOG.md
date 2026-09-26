# CHANGELOG

## 0.0.3

### Fixed

- **Package entry point:** `main` declares `./src/index.ts`, but `files` published only `dist/`, publish `src/` instead.

## 0.0.2

### Added

- **Codec contract:** `ArtCodec` interface declaring `parse()` and `serialize()` in both context-free and context-leading overloads, and returning `ParseResult` and `SerializeResult`.
- **Parse context:** `ParseContext` and `ParserContextData` types, plus `createParseContext()`, carrying the source `uri` through a parse.
- **Serialize context:** `SerializeContext` and `SerializerContextData` types, plus `createSerializeContext()`, carrying the source `uri` through a serialization.
- **Parse result:** `ParseResult` pairing the produced `ArtDocument` with the `ParseContext` used to produce it.
- **Serialize result:** `SerializeResult` pairing the produced markdown `content` with the `SerializeContext` used to produce it.
- **Source contracts:** `ArtContentSource` and `ArtDocumentSource` interfaces, plus `createArtDocumentSource()` wrapping a content source with codec-backed, memoized `readDocument` and `writeDocument()`.

### Changed

- **Parser visit context:** `ParserVisitContext` now carries a readonly `parseContext`, propagated into every child context; defaults to an empty-URI parse context when none is supplied.

### Tested

- Unit coverage for the parse and serialize context factories, the codec contract, the parse result, and the document source wrapper.

## 0.0.1

### Added

- **Construct model:** base construct typing with discriminator, optional source positions, container constructs with children, and a construct factory contract.
- **Parser context:** visit context carrying the active construct, source, child capture, nested contexts, parent traversal, and lifecycle hooks.
- **Source helpers:** mdast position and section-depth extraction.

### Tested

- Unit coverage for the parser context contract and source helpers.

### Documented

- Architecture references for the API and implementation.
