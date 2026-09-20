# Parser Architecture

The `@art-md/parser` package transforms raw markdown into an `ArtDocument`.

The parser is **construct-agnostic** — it drives detection entirely through the contract types from `@art-md/constructs` and never names a concrete construct.

## Documents

| Document               | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| [api.md](api.md)       | Parser API: config, entry point, constructs overview       |
| [parser.md](parser.md) | Parser implementation: MD to Art mapping, document builder |

## Layout

Its `src/` layout:

```
src/
├── buildDocument/   # buildDocument: visit loop, dispatch, context mutation
├── config/          # ParserConfig type + createDefaultParserConfig
├── mdast/           # mdast helpers (BLOCK_TYPES, isBlockType)
├── parse/           # parse entry point (markdown → ArtDocument)
├── private/         # createDocumentParserContext, DocumentVisitContext
├── test/            # test helpers
└── index.ts         # exports parse
```
