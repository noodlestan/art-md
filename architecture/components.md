# Art MD Components

The Art MD implementation consists of a parser, a serialiser, and a set of constructs that implement Art MD as a Markdown dialect. The parser and serialiser operate on those constructs to translate between Markdown and Art MD's structured representation.

Components are organised into core libraries (libs/) and CLI tools (cli/).

## Core Libraries

### Primitives (`@art-md/primitives`)

Provides the base types and utilities the ecosystem is built on: the document contract (`ArtDocument`, `ConstructBase`, `ContainerConstructBase`), the mdast and position types (`MdastNode`, `Point`, `Position`), and the parser visit context (`ParserVisitContext`, `ParserSource`) with its helpers (`nodePosition`, `sectionDepth`). No internal dependencies — all other libs consume it.

**Read more:** [Primitives Architecture](../libs/primitives/architecture/index.md)

### Constructs (`@art-md/constructs`)

The contract layer of the ecosystem: it binds the parser and serializer. It owns the factory functions, the parser/serializer interfaces, and the data shapes. The package is split into three slices — factories, parsers, serializers. Ships both the contract types and the concrete implementations.

- Contract types: `ConstructProcessor` (`captureNode`), `ConstructIntegrator` (`integrate`), `ConstructParser`, `ConstructParserFactory`; `ConstructSerializer` (`toMdast`), `ConstructSerializerFactory`
- Data shapes: `Construct`, `BlockContent`, `InlineContent` (built on the primitives base types)
- Open registry: `BlockConstructMap`, `InlineConstructMap` (augmented via declaration merging)
- Concrete constructs: `FieldBlock`, `FieldInline`, `SectionBlock`, `Tag`, `NaturalBlock`, `NaturalExpression`

**Read more:** [Constructs Architecture](../libs/constructs/architecture/index.md)

### Parser (`@art-md/parser`)

Transforms markdown into an `ArtDocument` via a generic dispatch loop. Construct-agnostic — knows only the contract types, never names a concrete construct. The [ecosystem overview](overview.md#the-parse-direction) describes how processors and the default construct interact.

- Entry point: `parse(markdown)`
- Config: `ParserConfig` with `defaultConstruct` and `constructs` list
- Dispatch: processors in order → `NaturalBlock` fallback
- Context: `ParserVisitContext` stack for nested constructs

**Read more:** [Parser Architecture](../libs/parser/architecture/index.md)

### Serializer (`@art-md/serializer`)

Transforms an `ArtDocument` back into markdown. Builds a registry from config factories, visits the construct tree bottom-up, and dispatches to `toMdast` implementations. Construct-agnostic — the [ecosystem overview](overview.md#the-serialise-direction) explains the composition decision.

- Entry point: `serialize(document)`
- Config: `SerializerConfig` with `constructs` factory list
- Registry: `Map<string, ConstructSerializer>` keyed by construct name
- Sibling placement: block constructs (`SectionBlock`, `FieldBlock`) emit children as siblings

**Read more:** [Serializer Architecture](../libs/serializer/architecture/index.md)

### Codec (`@art-md/codec`)

**Status:** IMPLEMENTED

Document-level parsing and serialisation only. No source I/O, no record knowledge.

Primary types: ArtCodecConfig, PartialArtCodecConfig, createArtCodec(). Responsibility: parse and serialise ArtDocument using configured constructs.

**Read more:** [Serializer Architecture](./codec.md)

## CLI Surface

### Bin (`@art-md/bin`)

Primary CLI entry point. Exposes parse, serialize, validate.

### Codec Tests (`@art-md/codec-tests`)

Fixture-based test suite for the parser and serializer roundtrip through the codec. See [art-md-fixture-tests.md](art-md-fixture-tests.md) for fixture anatomy.

## Spec (`@art-md/spec`)

The Art language specification, written in Art itself. Consumed by parser, validator, and bundler. Both documentation and test data.

## Planned Packages

The following packages are part of the art-md ecosystem but are not yet implemented or their roles are not yet defined in code:

### Bin (`@art-md/bin`)

Using `commander` and `$ART_WORK/cli/work` as a template.

Separate entry points:

- `art-md-parser` (configured via codec)
- `art-md-serializer` (configured via codec)
- `art-md-validator` (later, also configured via codec)

- `art-md` consolidated entry point with `parse` and `serialize` commands (later validate) and a `--write` to output to file.

### Validator (`@art-md/validator`)

**Status:** PLANNED

Validate Art Ast trees. Validate Markdown – although there is no invalid Markdown, there is possibly a world of hints that can be generated. Will establish the context for validator in `@art-js/validator` to express and track document and construct level validations.

Establish AST Schema. Derive tools.

## Archived

### `@art-md/poc-parse`

This package was used to prototype different options for the parser. The POC parser logic has been superseded by the `@art-md/parser`, `@art-md/constructs`, and `@art-md/serializer` packages. Last version of the POC can be found on [Github noodlestan/art-js](https://github.com/noodlestan/art-js/tree/e2940760f1b3fe8811b49d8dd724b82d1e668514/cli/poc-parse).
