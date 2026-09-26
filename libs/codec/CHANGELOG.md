# CHANGELOG

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
