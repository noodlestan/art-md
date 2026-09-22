# Codec and Source Contracts

**Status:** `LOCKED`

**Source:** Design: Art Codec and Source Contracts (`_roadmap/3-now/milestone-art-codec/milestone__design.md`)

**Purpose:** Implementation spec for the codec and source contracts: the primitives layout, the contracts and their responsibilities, the codec package ownership, the dependency direction, and the parser/serializer entry point changes. Downstream implementation plans implement against this spec.

## Primitives Layout

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
│   ├── context/
│   │   ├── types.ts          ← ParseContext, ParserContextData, ParserVisitContext (carries parseContext)
│   │   ├── createParseContext.ts
│   │   ├── createParserVisitContext.ts   (existing, retained)
│   │   └── private/
│   └── ...
├── serializer/
│   ├── context/
│   │   ├── types.ts          ← SerializeContext, SerializerContextData
│   │   └── createSerializeContext.ts
│   └── ...
└── index.ts
```

## Contracts

### ArtCodec (in `@art-md/primitives` under `codec/`)

**Responsibility:** document-level parsing and serialisation only. No source I/O. No record knowledge.

```ts
export interface ArtCodec {
  parse(markdown: string): ParseResult;
  parse(context: ParseContext, markdown: string): ParseResult;
  serialize(document: ArtDocument): SerializeResult;
  serialize(context: SerializeContext, document: ArtDocument): SerializeResult;
}
```

The codec owns the construct configuration, so it is not passed per call (unlike the standalone parser/serializer entry points, which take a `ParserConfig`/`SerializerConfig`).

### ParseResult / SerializeResult (in `@art-md/primitives`)

**Responsibility:** carry the produced document/content together with the operation context, so the caller can read warnings recorded on the context.

```ts
export interface ParseResult {
  document: ArtDocument;
  context: ParseContext;
}

export interface SerializeResult {
  content: string;
  context: SerializeContext;
}
```

### ArtContentSource (in `@art-md/primitives` under `source/`)

**Responsibility:** source identity plus lazy/idempotent acquisition and caching of raw content. It knows nothing about Art documents or records.

```ts
export interface ArtContentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeContent: string | undefined;
  readContent(): Promise<string>;
  writeContent(content: string): Promise<void>;
}
```

### ArtDocumentSource (in `@art-md/primitives` under `source/`)

**Responsibility:** lazy/idempotent parsing and caching of an `ArtDocument` from an `ArtContentSource`. It knows nothing about records.

```ts
export interface ArtDocumentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeDocument: ArtDocument | undefined;
  readDocument(): Promise<ArtDocument>;
  writeDocument(doc: ArtDocument): Promise<void>;
}
```

### createArtDocumentSource() (in `@art-md/primitives` under `source/`)

```ts
export function createArtDocumentSource(
  codec: ArtCodec,
  contentSource: ArtContentSource,
): ArtDocumentSource;
```

Lazily/idempotently reads content through `contentSource`, parses through `codec`, caches the document, and writes through `codec` + `contentSource`.

### ParseContext (in `@art-md/primitives` under `parser/context/`)

**Responsibility:** parser-operation context carrying the `ArtContentSource` uri; it does not carry the content source itself.

```ts
export type ParserContextData = {
  uri: string;
};

export type ParseContext = {
  uri: string;
};

export function createParseContext(data: ParserContextData): ParseContext;
```

### ParserVisitContext (in `@art-md/primitives` under `parser/context/`)

**Responsibility:** internal traversal context, retained; now carries `parseContext: ParseContext` so constructs can reach the parse context.

```ts
export type ParserVisitContext = {
  readonly construct: ConstructBase;
  readonly source: ParserSource;
  readonly parseContext: ParseContext; // NEW
  captureChildConstruct(child: ConstructBase): void;
  onBeforeConstruct(construct: ConstructBase): ParserVisitContext;
  childContext(
    construct: ContainerConstructBase,
    onBeforeConstruct?: OnBeforeConstruct,
  ): ParserVisitContext;
  parent(): ParserVisitContext | undefined;
};
```

### createDocumentVisitContext() (renamed from `createDocumentParserContext()`)

**Responsibility:** builds the `DocumentVisitContext` from raw markdown, carrying the `ParseContext`.

```ts
export function createDocumentVisitContext(
  markdown: string,
  parseContext: ParseContext,
): DocumentVisitContext;
```

### SerializeContext (in `@art-md/primitives` under `serializer/context/`)

**Responsibility:** serializer-operation context carrying the `ArtContentSource` uri; it does not carry the content source itself.

```ts
export type SerializerContextData = {
  uri: string;
};

export type SerializeContext = {
  uri: string;
};

export function createSerializeContext(data: SerializerContextData): SerializeContext;
```

## Codec Package (`@art-md/codec`)

**Responsibility:** owns the configured codec implementation and `createCodec()`. The package intentionally stays small so alternative/configured codecs can exist independently.

```ts
export interface ArtCodecConfig {
  constructs: ConstructRegistry;
}

export function createCodec(config: ArtCodecConfig): ArtCodec;
```

The codec implements the `ArtCodec` contract from `@art-md/primitives`: document-level parsing and serialisation only; no source I/O; no record knowledge; owns the construct configuration; exposes the overloaded API `parse(markdown)` | `parse(context, markdown)` and `serialize(document)` | `serialize(context, document)`.

## Entry Point Changes

- Parser entry points accept either raw markdown or `ParseContext`, each with a `ParserConfig`, and return `ParseResult` (document + context); markdown and config are always mandatory, and the context is the first argument when provided.

```ts
export function parse(markdown: string, config: ParserConfig): ParseResult;
export function parse(context: ParseContext, markdown: string, config: ParserConfig): ParseResult;
```

- Serializer entry points accept either an `ArtDocument` or `SerializeContext`, each with a `SerializerConfig`, and return `SerializeResult` (content + context); the document and config are always mandatory, and the context is the first argument when provided.

```ts
export function serialize(document: ArtDocument, config: SerializerConfig): SerializeResult;
export function serialize(
  context: SerializeContext,
  document: ArtDocument,
  config: SerializerConfig,
): SerializeResult;
```

- `libs/serializer/src/serializer/serializer.ts` is renamed to `serialize.ts` (the entry point is `serialize()`).

## Dependency Direction

`ArtCodec` is a contract consumed by `ArtDocumentSource`. But `ArtCodec` does not depend on `ArtDocumentSource`.

```
ArtDocumentSource
        │
        │ uses
        ↓
    ArtCodec
        │
        │ uses
        ↓
 ArtContentSource
```

More precisely, the types are:

```
ArtDocumentSource
    → ArtCodec
    → ArtContentSource

ArtCodec
    → ParseContext
    → SerializeContext
```

That is not circular. `ArtCodec` sits between `ArtDocumentSource` and `ArtContentSource`; the operation contexts are independent of content sources. Concrete sources (e.g. `FSContentSource`, `MemoryContentSource`) implement only `ArtContentSource`.
