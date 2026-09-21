# Art MD

**Art MD** is a **Markdown** dialect for expressing structured data and declarations in a human-readable form. Its implementation is built around an extensible set of constructs and a parser architecture that maps Markdown nodes to those constructs while preserving the structure and semantics of the source. The construct registry is open, allowing the language to grow through new constructs without requiring a redesign of the parser architecture.

## Art AST

Art MD represents Markdown as an **_Art AST_**: a hierarchical tree derived from Markdown content (via `mdast`), with nodes classified as **Art Constructs** such as sections, fields, comments, tags, and other language elements. `ArtDocument` is the document representation of this tree. The classified structure makes the data within an Art document available for extraction and updating while retaining the information needed to serialise it back to Markdown.

## Parsing and Serialisation

The core of the ecosystem is the bidirectional translation between Markdown and ArtDocument: Markdown is parsed into an ArtDocument, and an ArtDocument is serialised back to Markdown. `@art-md/primitives` provides the low-level types used throughout this implementation, including ArtDocument, the construct base types (ConstructBase, ContainerConstructBase), the mdast and position types (MdastNode, Point, Position), and the parser visit context (ParserVisitContext, ParserSource). Three packages implement parsing and serialisation, each with a distinct role and a strict separation of concerns.

##

### The Contract Layer: `@art-md/constructs`

`@art-md/constructs` is the contract layer that binds the parser and serializer. It owns the factory functions, the parser/serializer interfaces, and the data shapes. It defines three things:

1. **Contract types** — `ConstructProcessor` (`captureNode`) and `ConstructIntegrator` (`integrate`) for the parse direction; `ConstructSerializer` (`toMdast`) for the serialise direction; and the factories `ConstructParserFactory` and `ConstructSerializerFactory`. These interfaces are the only thing the parser and serializer know about individual constructs.

2. **Data shapes and registry** — `Construct`, `BlockContent`, and `InlineContent` describe the intermediate representation, built on the primitives base types. The `BlockConstructMap` and `InlineConstructMap` interfaces form an _open registry_: new construct types are added via TypeScript declaration merging, not by modifying a central enum.

The constructs package also ships the concrete implementations: each construct (e.g. `FieldBlock`, `SectionBlock`, `Tag`) exports both a parser factory and a serializer factory. These concrete factories are _not_ imported by the parser or serializer directly — they are composed at configuration time.

### The Parse Direction: `@art-md/parser`

The parser transforms raw markdown into an `ArtDocument`. Its entry point is `parse(markdown)`. Its core (`buildDocument` in `builder.ts`) drives a generic algorithm:

1. Parse the markdown into an mdast tree.
2. Visit each node and consult the config's `ConstructProcessor`s in order. The first processor whose `captureNode` returns a record claims the node.
3. If a construct claims the node, its `ConstructIntegrator` (if any) captures the record and mutates the visit context — typically pushing a nested context so following content becomes children.
4. If no construct claims the node, fall back to the **default construct** (`NaturalBlock`), which treats unrecognised content as natural markdown.

There is no separate pre-processor stage. The parser's configuration (`ParserConfig`) holds only two fields: `defaultConstruct` and a list of `ConstructParserFactory`. The parser core never names a specific construct type. It drives detection entirely through the contract interfaces.

### The Serialise Direction: `@art-md/serializer`

The serializer transforms an `ArtDocument` back into markdown. Its entry point is `serialize(document)`. Its core (`artAstToMdast` in `artAstToMdast.ts`) builds a **registry** from the config: each `ConstructSerializerFactory` is instantiated and stored in a `Map<string, ConstructSerializer>` keyed by the construct's name. When walking the `ArtDocument`, it looks up each node by this key and dispatches to the matching `toMdast` implementation.

Like the parser, the serializer's configuration (`SerializerConfig`) holds only a list of `ConstructSerializerFactory`. It never names a concrete construct — it dispatches generically through the registry.

### Where the Ecosystem Is Glued Together

The only place where concrete constructs and the pipeline meet is in the **default config factories**:

- `createDefaultConfig.ts` (parser) imports concrete construct parser factories from `@art-md/constructs` and wires them into a `ParserConfig`.
- `createDefaultSerializerConfig.ts` (serializer) imports concrete `ConstructSerializer` factories from `@art-md/constructs` and wires them into a `SerializerConfig`.

This is a **composition decision**, not a hardcoded dependency. The parser and serializer libraries have no import-level knowledge of `FieldBlock`, `SectionBlock`, or any other concrete construct. A consumer could supply a completely different set of constructs by providing a custom config.

### Separation

Parser and serializer are independent of each other. They share only the data contract defined by `@art-md/constructs`, built on the primitives base types.

Neither package imports from the other. Both depend on `@art-md/primitives` directly. A consumer can use the parser without the serializer, or vice versa. The only binding between them is the shared vocabulary of construct types and the `ArtDocument` intermediate representation.
