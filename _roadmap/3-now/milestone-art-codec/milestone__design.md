# Design: Art Codec and Source Contracts

**Attachment to:** Milestone: Art Codec (`./milestone.md`)

**Status:** `DONE`

**Purpose:** Capture the design for the codec and source contracts, applying the design changes to the original milestone draft: contracts move to `@art-md/primitives` (sources and codec), operation contexts are captured, and no new `@art-md/source` package is created.

## Lock Down

Locked down by Plan: Create Codec Spec (iteration `lock-down-design`). The design was validated against the plan requirements and the current codebase, refined where needed, and is now the authoritative source for `architecture/codec.md` and the downstream implementation plans.

**Validation:**

- Contracts (`ArtCodec`, `ArtContentSource`, `ArtDocumentSource`, `ParseContext`/`ParserContextData`, `SerializeContext`/`SerializerContextData`, `ParseResult`/`SerializeResult`), operation contexts, overloaded entry points, and dependency direction match the plan requirements.
- `ParserVisitContext` (primitives `parser/context/types.ts`) currently lacks `parseContext`; the design adds it so constructs can reach the parse context.
- `createDocumentParserContext()` (parser `private/`) returns a `DocumentVisitContext`; the design renames it to `createDocumentVisitContext()` and adds the `parseContext` parameter.
- `parse(markdown)` and `serialize(document)` current signatures match the design's current-state claims; the overloads extend them without breaking raw-input usage.
- `ParserConfig` (`defaultConstruct`, `constructs`) and `SerializerConfig` (`constructs`) match the design's entry-point signatures.

**Refinements:**

- None required — the design was already complete and consistent with the milestone decisions. Plan drafts that contradict it (e.g. `ParseContext` carrying `contentSource`) are refined in iteration `refine-remaining-plan-drafts`.

## Design Changes

- Source contracts (`ArtContentSource`, `ArtDocumentSource`) are declared in `@art-md/primitives` under `source/`.
- `ArtCodec` is declared as a contract in `@art-md/primitives` under `codec/`; `@art-md/codec` owns its configured implementation and `createCodec()`.
- `ParseContext` is added under `parser/context/` with `uri: string` carrying the `ArtContentSource` uri; it does not carry the content source itself.
- `SerializeContext` is added under `serializer/context/` with `uri: string` carrying the `ArtContentSource` uri; it does not carry the content source itself.
- `createParseContext(data: ParserContextData)` and `createSerializeContext(data: SerializerContextData)` are added in primitives; both data types are `{ uri: string }` (same shape, different names).
- `ParserVisitContext` (in primitives) is retained as the internal traversal context and now carries `parseContext: ParseContext`, so constructs receive the parse context through `processor?.captureNode(currentContext, node)` and `integrator.integrate(currentContext, node, construct)`.
- `createDocumentParserContext()` is mis-named — it returns a `DocumentVisitContext` and is renamed `createDocumentVisitContext()`.
- `createArtDocumentSource(codec, contentSource)` is implemented in primitives under `source/`. It lazily/idempotently reads content through `contentSource`, parses through `codec`, caches the document, and writes through `codec` + `contentSource`.
- Parser entry points accept either raw markdown or `ParseContext`, each with a `ParserConfig`, and return `ParseResult` (document + context); markdown and config are always mandatory, and the context is the first argument when provided.
- Serializer entry points accept either an `ArtDocument` or `SerializeContext`, each with a `SerializerConfig`, and return `SerializeResult` (content + context); the document and config are always mandatory, and the context is the first argument when provided.
- `libs/serializer/src/serializer/serializer.ts` is renamed to `serialize.ts` (the entry point is `serialize()`).
- `ArtCodec` exposes the overloaded `parse`/`serialize` API — `(markdown)` or `(context, markdown)` — while owning the construct configuration; the codec itself does not perform source I/O.
- Architecture docs/ADRs describe the dependency direction as ArtDocumentSource → ArtCodec → ArtContentSource, with `ArtDocumentSource` composing an `ArtContentSource` and an `ArtCodec`; operation contexts are independent of content sources; concrete sources such as `FSContentSource` implement only `ArtContentSource`.

## Relationships

```
ArtContentSource
       ↑
       │ implemented by
       │
 FSContentSource
 MemoryContentSource
 ...

ArtCodec
   │
   ├── parse(markdown) | parse(context, markdown) → ParseResult
   └── serialize(document) | serialize(context, document) → SerializeResult

ParseContext
   └── uri: string  (carries the ContentSource uri)

SerializeContext
   └── uri: string  (carries the ContentSource uri)

ArtDocumentSource
   ├── contentSource ─────→ ArtContentSource
   └── codec ─────────────→ ArtCodec
```

And therefore:

```
parse(markdown, config) | parse(context, markdown, config)
    │
    └── markdown
              ↓
         parser machinery
              ↓
         ParseResult { document, context }
```

and:

```
serialize(document, config) | serialize(context, document, config)
    │
    └── document
              ↓
         serializer machinery
              ↓
         SerializeResult { content, context }
```

## Layering

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

That is not circular. `ArtCodec` sits between `ArtDocumentSource` and `ArtContentSource`; the operation contexts are independent of content sources.

## Contracts

### ArtCodec (contract in `@art-md/primitives` under `codec/`)

**File:** `libs/primitives/src/codec/types.ts`

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

**Files:** `libs/primitives/src/parser/types.ts` (`ParseResult`), `libs/primitives/src/serializer/types.ts` (`SerializeResult`)

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

### ArtContentSource (contract in `@art-md/primitives` under `source/`)

**File:** `libs/primitives/src/source/types.ts`

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

### ArtDocumentSource (contract in `@art-md/primitives` under `source/`)

**File:** `libs/primitives/src/source/types.ts`

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

**File:** `libs/primitives/src/source/createArtDocumentSource.ts`

```ts
export function createArtDocumentSource(
  codec: ArtCodec,
  contentSource: ArtContentSource,
): ArtDocumentSource;
```

### ParseContext (in `@art-md/primitives` under `parser/context/`)

**File:** `libs/primitives/src/parser/context/types.ts` (`ParseContext`, `ParserContextData`), `libs/primitives/src/parser/context/createParseContext.ts` (`createParseContext`)

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

**File:** `libs/primitives/src/parser/context/types.ts`

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

**File:** `libs/parser/src/private/createDocumentVisitContext.ts` (renamed from `createDocumentParserContext.ts`); `DocumentVisitContext` type in `libs/parser/src/private/types.ts`

**Responsibility:** builds the `DocumentVisitContext` from raw markdown, carrying the `ParseContext`.

```ts
export function createDocumentVisitContext(
  markdown: string,
  parseContext: ParseContext,
): DocumentVisitContext;
```

### Context Injection into Constructs

The visitor context carries the parse context, so constructs receive it through the processor and integrator. This happens in the parser package's visitor loop (`libs/parser/src/buildDocument/`):

```ts
processor?.captureNode(currentContext, node);
integrator.integrate(currentContext, node, construct);
```

A construct can therefore reach the parse context, e.g. to read the source uri:

```ts
context.parseContext.uri;
```

### SerializeContext (in `@art-md/primitives` under `serializer/context/`)

**File:** `libs/primitives/src/serializer/context/types.ts` (`SerializeContext`, `SerializerContextData`), `libs/primitives/src/serializer/context/createSerializeContext.ts` (`createSerializeContext`)

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

**Files:** `libs/codec/src/types.ts` (`ArtCodecConfig`), `libs/codec/src/createCodec.ts` (`createCodec`)

**Responsibility:** owns the configured codec implementation and `createCodec()`. The package intentionally stays small so alternative/configured codecs can exist independently.

```ts
export interface ArtCodecConfig {
  constructs: ConstructRegistry;
}

export function createCodec(config: ArtCodecConfig): ArtCodec;
```

## Entry Point Changes

- Parser entry points accept either raw markdown or `ParseContext`, each with a `ParserConfig`, and return `ParseResult` (document + context); markdown and config are always mandatory, and the context is the first argument when provided. Entry point: `libs/parser/src/parse/parse.ts`.

```ts
export function parse(markdown: string, config: ParserConfig): ParseResult;
export function parse(context: ParseContext, markdown: string, config: ParserConfig): ParseResult;
```

- Serializer entry points accept either an `ArtDocument` or `SerializeContext`, each with a `SerializerConfig`, and return `SerializeResult` (content + context); the document and config are always mandatory, and the context is the first argument when provided. Entry point: `libs/serializer/src/serializer/serialize.ts`.

```ts
export function serialize(document: ArtDocument, config: SerializerConfig): SerializeResult;
export function serialize(
  context: SerializeContext,
  document: ArtDocument,
  config: SerializerConfig,
): SerializeResult;
```

- `libs/serializer/src/serializer/serializer.ts` is renamed to `serialize.ts` (the entry point is `serialize()`).
- `ArtCodec` exposes the overloaded `parse`/`serialize` API — `(markdown)` or `(context, markdown)` — while owning the construct configuration; the codec itself does not perform source I/O.

## Knowledge to Update

- `architecture/components.md` — update planned packages: remove the Source package; describe the codec contract in primitives and the `@art-md/codec` package.
- `architecture/codec.md` — living guide for how the codec and source contracts work, owning the primitives layout; this design attachment is the authoritative implementation spec.
- `architecture/adr/codec.md` — establish context, use cases, purpose and principles; describe the dependency direction.
- `architecture/overview.md` — describe the dependency direction ArtDocumentSource → ArtCodec → ArtContentSource, with operation contexts independent of content sources.
- `libs/primitives/architecture/index.md` and `api.md` — document the new primitives contracts.
- `_records/project.art` — add the Codec package resource.
- `README.md` — add the codec package to the packages table.
- `_guide.md` — add the Codec project.
