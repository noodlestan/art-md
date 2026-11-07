# CHANGELOG

## 0.0.6

### Added

- **Extraction** — `npm run extract` writes `dist/meta.json`, the module and symbol metadata the docs site renders.
- **Authored copy** — module and symbol descriptions across the extracted `codec` module.

### Changed

- **Dependency pins** — depends on `@art-md/primitives@0.0.8`, `@art-md/constructs@0.0.8`, `@art-md/parser@0.0.8`, and `@art-md/serializer@0.0.7`.
- **Source layout** — `createArtCodec` and its config types moved into `src/codec/`, the module the extractor reads.

## 0.0.5

### Changed

- **Exact dependency pins** — depends on `@art-md/primitives@0.0.7`, `@art-md/constructs@0.0.7`, `@art-md/parser@0.0.6`, and `@art-md/serializer@0.0.6` instead of `*`.

## 0.0.4

### Added

- **Construct registry config** — `ArtCodecConfig.factories` supplies the construct factory list, defaulting to `FACTORIES` from `@art-md/constructs`.
- **Factory lookup and creation** — codec instances build their `name => factory` index lazily and create construct instances; `Document` is not creatable and shares the not-found error with any unknown name.
- **`toText`** — reads a construct's text, walking `value` and recursive `children`.

## 0.0.3

### Fixed

- **Package exports** — now target the dist build rather than the TypeScript source.

## 0.0.1

### Added

- **Codec factory:** `createArtCodec(config?)` builds an `ArtCodec` from an optional partial config, bundling the a configured parser and serializer into a single codec.
- **Context-free API:** the returned codec exposes `parse(markdown)` and `serialize(document)`, returning `ParseResult` and `SerializeResult`.
- **Context-aware API:** the `parse(context, markdown)` and `serialize(context, document)` overloads accept a leading context instance.
- **Codec config types:** `ArtCodecConfig`, and `PartialArtCodecConfig` for expressing partial overrides.
- **Config defaults:** `parserConfig.defaultConstruct` falls back to default config from `@art-md/constructs`.

### Tested

- Unit coverage for `createArtCodec` across the context-free and context-aware parse and serialize paths.

### Documented

- Architecture knowledge for the codec API, config, and the `ArtCodec` contract it satisfies.
