# Codec and Source Contracts

**Status:** `LOCKED`

**Source:** Design: Art Codec and Source Contracts (`_roadmap/3-now/milestone-art-codec/milestone__design.md`)

**Purpose:** A living guide for how the codec and source contracts work together. It is anchored on the symbols and contracts declared in `@art-md/primitives` and the `@art-md/codec` package, and explains how a parse, a serialise, and a document-source read/write flow through them. It deliberately does not restate every signature — the authoritative, full contract definitions live in the design attachment (`milestone__design.md`).

## Layout

The contracts live in `@art-md/primitives` under `libs/primitives/src/`:

```
libs/primitives/src/
├── constructs/
├── document/
├── codec/
│   └── types.ts              ← ArtCodec contract
├── source/
│   ├── types.ts              ← ArtContentSource, ArtDocumentSource
│   ├── createArtDocumentSource.ts
│   └── index.ts
├── parser/
│   ├── types.ts              ← ParseResult
│   ├── context/
│   │   ├── types.ts          ← ParseContext, ParserContextData, ParserVisitContext (carries parseContext)
│   │   ├── createParseContext.ts
│   │   ├── createParserVisitContext.ts   (existing, retained)
│   │   └── private/
│   └── ...
├── serializer/
│   ├── types.ts              ← SerializeResult
│   ├── context/
│   │   ├── types.ts          ← SerializeContext, SerializerContextData
│   │   └── createSerializeContext.ts
│   └── ...
└── index.ts
```

The `@art-md/codec` package owns the configured codec implementation and `createCodec()`; it stays small so alternative/configured codecs can exist independently.

## The Contracts at a Glance

- `ArtCodec` (`codec/types.ts`) — document-level parse and serialise. No source I/O, no record knowledge. Owns the construct configuration.
- `ArtContentSource` (`source/types.ts`) — source identity plus lazy/idempotent acquisition and caching of raw content. Knows nothing about Art documents or records.
- `ArtDocumentSource` (`source/types.ts`) — lazy/idempotent parse and caching of an `ArtDocument` from an `ArtContentSource`. Composes a content source and a codec.
- `ParseContext` / `SerializeContext` (`parser/context/types.ts`, `serializer/context/types.ts`) — operation contexts carrying the content-source `uri`; they do not carry the content source itself.
- `ParseResult` / `SerializeResult` (`parser/types.ts`, `serializer/types.ts`) — carry the produced document/content together with the operation context, so the caller can read warnings recorded on the context.
- `ParserVisitContext` (`parser/context/types.ts`) — internal traversal context; now carries `parseContext` so constructs can reach the parse context.

## How a Parse Flows

The parser entry point is `parse()` in `libs/parser/src/parse/parse.ts`. It accepts either raw markdown or a `ParseContext`, each with a `ParserConfig`, and returns a `ParseResult`:

```ts
parse(markdown, config) | parse(context, markdown, config) → ParseResult
```

1. The entry point builds a `DocumentVisitContext` via `createDocumentVisitContext(markdown, parseContext)` (parser package `private/`). This parses the source to an mdast tree and wraps it in a `ParserVisitContext` that carries the `parseContext`.
2. The visitor loop walks the mdast tree. Each construct's `processor.captureNode(currentContext, node)` claims nodes that belong to it; `integrator.integrate(currentContext, node, construct)` captures children and pushes nested contexts for container constructs.
3. Because `ParserVisitContext` now carries `parseContext`, a construct can reach the source uri — e.g. `context.parseContext.uri` — through the processor and integrator.
4. The result is a `ParseResult { document, context }`, so the caller can read warnings recorded on the context.

## How a Serialise Flows

The serializer entry point is `serialize()` in `libs/serializer/src/serializer/serialize.ts` (renamed from `serializer.ts`). It accepts either an `ArtDocument` or a `SerializeContext`, each with a `SerializerConfig`, and returns a `SerializeResult`:

```ts
serialize(document, config) | serialize(context, document, config) → SerializeResult
```

1. The entry point converts the `ArtDocument` to an mdast tree (`artAstToMdast`), then to markdown.
2. The result is a `SerializeResult { content, context }`, so the caller can read warnings recorded on the context.

## How a Document Source Composes Codec and Content Source

`createArtDocumentSource(codec, contentSource)` (`source/createArtDocumentSource.ts`) composes an `ArtCodec` and an `ArtContentSource` into an `ArtDocumentSource`:

- `readDocument()` lazily reads content through `contentSource.readContent()`, parses it through `codec.parse(...)`, and caches the resulting `ArtDocument`.
- `writeDocument(doc)` serialises through `codec.serialize(...)` and writes through `contentSource.writeContent(...)`.

Both reads are idempotent: the document is cached on `maybeDocument` and only re-parsed when the content changes.

## Dependency Direction

`ArtCodec` is a contract consumed by `ArtDocumentSource`, but `ArtCodec` does not depend on `ArtDocumentSource`:

```
ArtDocumentSource → ArtCodec → ArtContentSource

ArtCodec → ParseContext → SerializeContext
```

That is not circular. `ArtCodec` sits between `ArtDocumentSource` and `ArtContentSource`; the operation contexts are independent of content sources. Concrete sources (e.g. `FSContentSource`, `MemoryContentSource`) implement only `ArtContentSource`.

## Scenarios

### Scenario 1: Parsing Raw Markdown

Call `parse(markdown, config)` when you have raw markdown and no source context. The entry point builds a default `ParseContext` internally.

### Scenario 2: Parsing with a Context

Call `parse(context, markdown, config)` when you want the operation to carry a source `uri` (e.g. to record warnings against a source). Create the context with `createParseContext({ uri })`.

### Scenario 3: Reading a Document Through a Source

Use `createArtDocumentSource(codec, contentSource)` when you want a lazy, cached `ArtDocument` backed by a content source. `readDocument()` parses on first access and caches.

### Scenario 4: Adding a New Concrete Source

Implement only `ArtContentSource` (`readContent`/`writeContent` plus `type`/`uri`/`maybeContent`). The source knows nothing about Art documents; compose it with a codec via `createArtDocumentSource` to get document-level access.

## Decision Guide

- **Raw markdown, no source** — use `parse(markdown, config)` / `serialize(document, config)`.
- **Need a source uri / warnings on the operation** — pass a context: `parse(context, markdown, config)` / `serialize(context, document, config)`.
- **Lazy, cached document backed by a source** — use `createArtDocumentSource(codec, contentSource)`.
- **New source type** — implement `ArtContentSource` only; never `ArtDocumentSource` directly.
