# Art MD

**Art MD** is a **Markdown** dialect for expressing structured data and declarations in a human-readable form, implemented in an extensible set of [constructs](../libs/constructs/README.md) and a [parser](../libs/parser/README.md) and [serializer](../libs/serializer/README.md) pair that map Markdown nodes to constructs and preserve the structure and semantics of the source. The construct registry is open, allowing the language to grow through new constructs without requiring a redesign of the parser architecture.

## Art AST

Art MD represents Markdown as an **_Art AST_**: a hierarchical tree derived from Markdown content (via `mdast`), with nodes classified as **Constructs** such as sections, fields, comments, tags, and other language elements. `ArtDocument` is the document representation of this tree. The classified structure makes the data within an Art document available for extraction and updating while retaining the information needed to serialise it back to Markdown.

## Layers

### The Contract Layer: `@art-md/primitives`

**Status:** WIP

`@art-md/primitives` is the contract layer: it declares the contracts that the other layers implement and consume, and has no internal dependencies. It is organised into five slices:

- `codec/` — the `ArtCodec` contract: document-level parsing and serialisation with the overloaded API `parse(markdown)` | `parse(context, markdown)` and `serialize(document)` | `serialize(context, document)`.
- `source/` — the source contracts: `ArtContentSource` (source identity plus lazy/idempotent acquisition and caching of raw content) and `ArtDocumentSource` (lazy/idempotent parsing and caching of an `ArtDocument`), together with the `createArtDocumentSource(codec, contentSource)` factory.
- `parser/context/` — the parser operation context: `ParseContext` and `ParserContextData` with `createParseContext()`, plus the retained internal traversal context `ParserVisitContext`, which now carries the `parseContext` so constructs can reach it.
- `serializer/context/` — the serializer operation context: `SerializeContext` and `SerializerContextData` with `createSerializeContext()`.
- `constructs/` and `document/` — the base types (`ConstructBase`, `ContainerConstructBase`), the mdast and position types (`MdastNode`, `Point`, `Position`), and the document representation (`ArtDocument`).

The operation contexts are independent of content sources: they carry only the content source `uri` (a string), never the source itself.

### The Constructs Layer: `@art-md/constructs`

**Status:** WIP

This package defines the constructs contracts — factory, parser, and serializer — and owns the factory functions for the built-in constructs.

It is the layer that binds the parser and serializer: both depend on it through their runtime configuration, which holds lists of construct factories.

1. **Contract types** — `ConstructProcessor` (`captureNode`) and `ConstructIntegrator` (`integrate`) for the parse direction; `ConstructSerializer` (`toMdast`) for the serialise direction; and the factories `ConstructParserFactory` and `ConstructSerializerFactory`. These interfaces are the only thing the parser and serializer know about individual constructs.

2. **Data shapes and registry** — `Construct`, `BlockContent`, and `InlineContent` describe the intermediate representation, built on the primitives base types. The `BlockConstructMap` and `InlineConstructMap` interfaces form an _open registry_: new construct types are added via TypeScript declaration merging, not by modifying a central enum.

The constructs package also ships the concrete implementations: every construct (e.g. `FieldBlock`, `SectionBlock`, `Tag`) exports a function to create instances from pure data and a serializer factory. Some implement also the parser contract. These concrete factories are _not_ imported by the parser or serializer directly — they are composed at configuration time.

### The Parse Direction: `@art-md/parser`

**Status:** WIP

The parser transforms raw markdown into an `ArtDocument`. It depends on `@art-md/constructs` and accepts a `ParserConfig` holding construct factories. Its entry points are overloaded: `parse(markdown, config)` or `parse(context, markdown, config)`, both returning a `ParseResult` (document + context). For a streamlined API that owns the construct configuration, use the codec instead.

Its core (`buildDocument` in `builder.ts`) drives a generic algorithm:

1. Parse the markdown into an mdast tree.
2. Visit each node and consult the config's `ConstructProcessor`s in order. The first processor whose `captureNode` returns a record claims the node.
3. If a construct claims the node, its `ConstructIntegrator` (if any) captures the record and mutates the visit context — typically pushing a nested context so following content becomes children.
4. If no construct claims the node, fall back to the **default construct** (`NaturalBlock`), which treats unrecognised content as natural markdown.

There is no separate pre-processor stage. The parser's configuration (`ParserConfig`) holds only two fields: `defaultConstruct` and a list of `ConstructParserFactory`. The parser core never names a specific construct type. It drives detection entirely through the contract interfaces.

### The Serialise Direction: `@art-md/serializer`

**Status:** WIP

The serializer transforms an `ArtDocument` back into markdown. Like the parser, it depends on `@art-md/constructs` and accepts a `SerializerConfig` holding construct factories. Its entry points are overloaded: `serialize(document, config)` or `serialize(context, document, config)`, both returning a `SerializeResult` (content + context). For a streamlined API that owns the construct configuration, use the codec instead.

Its core (`artAstToMdast` in `artAstToMdast.ts`) builds a **registry** from the config: each `ConstructSerializerFactory` is instantiated and stored in a `Map<string, ConstructSerializer>` keyed by the construct's name. When walking the `ArtDocument`, it looks up each node by this key and dispatches to the matching `toMdast` implementation.

Like the parser, the serializer's configuration (`SerializerConfig`) holds only a list of `ConstructSerializerFactory`. It never names a concrete construct — it dispatches generically through the registry.

### The Codec Layer: `@art-md/codec`

**Status:** Planned

The codec layer provides the streamlined document-level API. The `ArtCodec` contract is declared in `@art-md/primitives` under `codec/`; the `@art-md/codec` package owns the configured implementation and `createArtCodec()`.

`ArtCodec` exposes the overloaded `parse`/`serialize` API — `parse(markdown)` | `parse(context, markdown)` and `serialize(document)` | `serialize(context, document)` — while owning the construct configuration, so no config is passed per call. It performs document-level parsing and serialisation only: no source I/O, no record knowledge.

The dependency direction is `ArtDocumentSource` → `ArtCodec` → `ArtContentSource`: `ArtDocumentSource` composes an `ArtContentSource` and an `ArtCodec`, and concrete sources (e.g. `FSContentSource`) implement only `ArtContentSource`. The operation contexts (`ParseContext`, `SerializeContext`) are independent of content sources.
