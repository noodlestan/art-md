# Milestone: Art Codec

## Changes

### `@art-js/codec`

#### `ArtCodecConfig`

**Responsibility:** configuration for a document codec.

```ts
export interface ArtCodecConfig {
  constructs: ConstructRegistry;
}
```

#### `ArtCodec`

**Responsibility:** document-level parsing and serialisation only.

No source I/O. No record knowledge.

```ts
export interface ArtCodec {
  parse(markdown: string): ArtDocument;
  serialize(document: ArtDocument): string;
}
```

#### `createCodec()`

**Responsibility:** create a configured codec.

The package intentionally stays small so alternative/configured codecs can exist independently.

```ts
export function createCodec(config: ArtCodecConfig): ArtCodec;
```

### `@art-js/source`

#### `ArtContentSource`

**Responsibility:** source identity plus lazy/idempotent acquisition and caching of raw content.

It knows nothing about Art documents or records.

```ts
export interface ArtContentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeContent: string | undefined;
  readContent(): Promise<string>;
  writeContent(content: string): Promise<void>;
}
```

#### `ArtDocumentSource`

**Responsibility:** lazy/idempotent parsing and caching of an `ArtDocument` from a `ArtContentSource`.

It knows nothing about records.

```ts
export interface ArtDocumentSource {
  readonly type: string;
  readonly uri: string;
  readonly maybeDocument: ArtDocument | undefined;
  readDcoument(): Promise<string>;
  writeDocument(doc: ArtDocument): Promise<void>;
}
```

#### `createArtDocumentSource()`

```ts
export function createArtDocumentSource(
  codec: ArtCodec,
  contentSource: ArtContentSource,
): ArtDocumentSource;
```

## Knowledge to Update

- `architecture/components.md`
- `architecture/adr/source.md` - establish context, use cases, purpose and principles
- `architecture/adr/codec.md` - establish context, use cases, purpose and principles
- `architecture/codec.md`
- `architecture/source.md`
