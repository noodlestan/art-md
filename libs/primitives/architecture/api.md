# Primitives API

The `@art-md/primitives` package exposes the base types and entry points shared by the constructs, parser, and serializer packages.

## Types

### ConstructBase

The base type implemented by every construct record. It carries the `construct` discriminator (the construct class, e.g. `SectionBlock`) and an optional source `position`. Defined in `src/constructs/types.ts`.

### ContainerConstructBase

Extends `ConstructBase` with a `children` array of `ConstructBase`. It is the shape behind container constructs and the document root. Defined in `src/constructs/types.ts`.

### ArtDocument

The document root record. It is a `ContainerConstructBase` with `construct: 'Document'`. Produced by the parser, consumed by the serializer. Defined in `src/document/types.ts`. See [Constructs API → ArtDocument](../../constructs/architecture/api.md#artdocument).

### MdastNode

The mdast node surface visited by the parser. It extends the `mdast` `Node` with optional `children` and `value`. Defined in `src/parser/types.ts`.

### Point

A point in the source, with `line`, `column`, and `offset`. Defined in `src/parser/types.ts`.

### Position

The source span of a record, with `start` and `end` points. It is carried by every construct. Defined in `src/parser/types.ts`.

### ParserSource

The read-only source surface passed to every visit: the mdast `tree` and the raw `markdown`. Defined in `src/parser/context/types.ts`.

### ParserVisitContext

The window a construct parser sees during parsing: the active `construct`, the `source`, and the context mutation methods. Defined in `src/parser/context/types.ts`. See [Constructs Parsers → The ParserVisitContext](../../constructs/architecture/parsers.md#the-parservisitcontext).

### OnBeforeConstruct

A hook signature invoked before a construct is captured. It can act as a boundary that closes a nested context. Defined in `src/parser/context/types.ts`.

## Functions

### createArtDocument

Creates an `ArtDocument` record from `ArtDocumentFactoryData`, defaulting to an empty `children` list. Defined in `src/document/createArtDocument.ts`.

### createParserVisitContext

Creates the root visit context for a container construct. Defined in `src/parser/context/createParserVisitContext.ts`. See [Primitives Implementation](implementation.md).

### nodePosition

Reads the position of an mdast node and returns it as a `Position`. It throws when the node has no source position. Defined in `src/parser/helpers/nodePosition.ts`.

### sectionDepth

Returns the heading `depth` of a section, defaulting to `1`. Defined in `src/parser/helpers/sectionDepth.ts`.

## Contract Reference

The primitives types are consumed by:

- **Constructs** — `ConstructBase` and `ContainerConstructBase` shape every construct record. See [Constructs API](../../constructs/architecture/api.md).
- **Parser** — `MdastNode`, `Point`, `Position`, `ParserSource`, and `ParserVisitContext` drive detection and capture. See [Parser API](../../parser/architecture/api.md).
- **Serializer** — the serializer consumes `ArtDocument` and the base construct types. See [Serializer API](../../serializer/architecture/api.md).
