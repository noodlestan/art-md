# Art JS Ecosystem Overview

The **art-js** repository is a modular JavaScript ecosystem for parsing and serialising a domain-specific markdown dialect called Art-MD. Its defining architectural choice is a **construct-agnostic pipeline**: the parser and serializer know nothing about which concrete constructs exist. They operate on a shared contract — factory types and data shapes — and concrete constructs are injected at configuration time.

## Art MD

The core of the ecosystem is a bidirectional pipeline: markdown → `ArtDocument` (parse) and `ArtDocument` → markdown (serialise). `@art-js/primitives` provides the low-level types the contract layer and pipeline build on: `ArtDocument`, the construct base types (`ConstructBase`, `ContainerConstructBase`), the mdast and position types (`MdastNode`, `Point`, `Position`), and the parser visit context (`ParserVisitContext`, `ParserSource`). Three packages implement the pipeline, each with a distinct role and a strict separation of concerns.

### The Contract Layer: `@art-js/constructs`

`@art-js/constructs` is the contract layer that binds the parser and serializer. It owns the factory functions, the parser/serializer interfaces, and the data shapes. It defines three things:

1. **Contract types** — `ConstructProcessor` (`captureNode`) and `ConstructIntegrator` (`integrate`) for the parse direction; `ConstructSerializer` (`toMdast`) for the serialise direction; and the factories `ConstructParserFactory` and `ConstructSerializerFactory`. These interfaces are the only thing the parser and serializer know about individual constructs.

2. **Data shapes and registry** — `Construct`, `BlockContent`, and `InlineContent` describe the intermediate representation, built on the primitives base types. The `BlockConstructMap` and `InlineConstructMap` interfaces form an _open registry_: new construct types are added via TypeScript declaration merging, not by modifying a central enum.

The constructs package also ships the concrete implementations: each construct (e.g. `FieldBlock`, `SectionBlock`, `Tag`) exports both a parser factory and a serializer factory. These concrete factories are _not_ imported by the parser or serializer directly — they are composed at configuration time.

### The Parse Direction: `@art-js/parser`

The parser transforms raw markdown into an `ArtDocument`. Its entry point is `parse(markdown)`. Its core (`buildDocument` in `builder.ts`) drives a generic algorithm:

1. Parse the markdown into an mdast tree.
2. Visit each node and consult the config's `ConstructProcessor`s in order. The first processor whose `captureNode` returns a record claims the node.
3. If a construct claims the node, its `ConstructIntegrator` (if any) captures the record and mutates the visit context — typically pushing a nested context so following content becomes children.
4. If no construct claims the node, fall back to the **default construct** (`NaturalBlock`), which treats unrecognised content as natural markdown.

There is no separate pre-processor stage. The parser's configuration (`ParserConfig`) holds only two fields: `defaultConstruct` and a list of `ConstructParserFactory`. The parser core never names a specific construct type. It drives detection entirely through the contract interfaces.

### The Serialise Direction: `@art-js/serializer`

The serializer transforms an `ArtDocument` back into markdown. Its entry point is `serialize(document)`. Its core (`artAstToMdast` in `artAstToMdast.ts`) builds a **registry** from the config: each `ConstructSerializerFactory` is instantiated and stored in a `Map<string, ConstructSerializer>` keyed by the construct's name. When walking the `ArtDocument`, it looks up each node by this key and dispatches to the matching `toMdast` implementation.

Like the parser, the serializer's configuration (`SerializerConfig`) holds only a list of `ConstructSerializerFactory`. It never names a concrete construct — it dispatches generically through the registry.

### Where the Ecosystem Is Glued Together

The only place where concrete constructs and the pipeline meet is in the **default config factories**:

- `createDefaultConfig.ts` (parser) imports concrete construct parser factories from `@art-js/constructs` and wires them into a `ParserConfig`.
- `createDefaultSerializerConfig.ts` (serializer) imports concrete `ConstructSerializer` factories from `@art-js/constructs` and wires them into a `SerializerConfig`.

This is a **composition decision**, not a hardcoded dependency. The parser and serializer libraries have no import-level knowledge of `FieldBlock`, `SectionBlock`, or any other concrete construct. A consumer could supply a completely different set of constructs by providing a custom config.

### Separation

Parser and serializer are independent of each other. They share only the data contract defined by `@art-js/constructs`, built on the primitives base types. Neither package imports from the other. Both depend on `@art-js/primitives` directly. A consumer can use the parser without the serializer, or vice versa. The only binding between them is the shared vocabulary of construct types and the `ArtDocument` intermediate representation.

## Planned Packages

The following packages are part of the art-js ecosystem but are not yet implemented or their roles are not yet defined in code:

- `@art-js/dev-server`
- `@art-js/language-server`
- `@art-js/watcher`
- `@art-js/tools`
