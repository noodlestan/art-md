# Architecture: Art MD

## Documents

| Document                       | Purpose                                                  |
| ------------------------------ | -------------------------------------------------------- |
| [overview.md](overview.md)     | Art MD, Constructs, Parser, Serializer, Planned Packages |
| [principles.md](principles.md) | Design principles for the Art MD libraries               |
| [components.md](components.md) | Components, relationships, and package links             |

## Design Documents

| Document                                                         | Purpose                                        |
| ---------------------------------------------------------------- | ---------------------------------------------- |
| [design/codec.md](design/codec.md)                               | Codec and source contracts implementation spec |
| [design/art-md-fixture-tests.md](design/art-md-fixture-tests.md) | Fixture test suite for parser and serializer   |

## Decision Records

| Record                                | Purpose                                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [adr/art-md.md](adr/art-md.md)        | Art MD round-trip between markdown and the Art AST: parser, serializer, and constructs packages      |
| [adr/codec.md](adr/codec.md)          | Codec and source contracts: the `@art-md/codec` package and contracts in `@art-md/primitives`        |
| [adr/language.md](adr/language.md)    | The art language: its purpose, scope, and syntax/semantics model                                     |
| [adr/\_research.md](adr/_research.md) | Research behind the parse POC: surveyed projects, extracted best practices, and open spike questions |

## Package Architecture References

| Package    | Architecture Index                                                                |
| ---------- | --------------------------------------------------------------------------------- |
| Constructs | [libs/constructs/architecture/index.md](../libs/constructs/architecture/index.md) |
| Parser     | [libs/parser/architecture/index.md](../libs/parser/architecture/index.md)         |
| Primitives | [libs/primitives/architecture/index.md](../libs/primitives/architecture/index.md) |
| Serializer | [libs/serializer/architecture/index.md](../libs/serializer/architecture/index.md) |
