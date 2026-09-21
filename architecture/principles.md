# Art MD Principles

### Construct Agnostic

Art MD parser and serializer are construct-agnostic. They operate on a shared contract — factory types and data shapes — and concrete constructs are injected at configuration time.

### Open Registry

Constructs are registered via TypeScript declaration merging — no central enum or switch statement. New constructs augment `BlockConstructMap` or `InlineConstructMap` and are automatically discovered by the parser and serializer. See [Constructs API](../libs/constructs/architecture/api.md#registry).

### Composition Over Hardcoding

The parser and serializer have no import-level dependency on any concrete construct. Wiring happens through config factories (`createDefaultConfig.ts`, `createDefaultSerializerConfig.ts`). A consumer can supply a completely different set of constructs by providing a custom config.

### Separation of Concerns

Parser and serializer are independent of each other. They share only the data contract defined by `@art-md/constructs`, built on the primitives base types. Neither package imports from the other. Both depend on the primitives types directly. See [components.md](components.md) for the full component map.

### Natural Fallback

Unrecognised markdown is preserved as `NaturalBlock` records rather than dropped. The parser is lenient — it classifies nodes, it does not validate syntax.

### Runtime Config and Context Injection

The pipeline is configured via factories: `ConstructParserFactory` for the parse direction, `ConstructSerializerFactory` for the serialise direction. Each factory is called once during setup. Context is injected into hooks — the parser passes a `ParserVisitContext` to each `ConstructProcessor` and `ConstructIntegrator` hook. Config injection (supplying a custom config at the entry point) is a future direction.
