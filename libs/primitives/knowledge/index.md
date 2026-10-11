# Knowledge: Primitives

The `@art-md/primitives` package provides the base types and utilities the parser and serializer are built on.

## Documents

| Document                               | Description                                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| [api.md](api.md)                       | Primitives API: base construct types, document and parser contracts, entry points |
| [implementation.md](implementation.md) | Primitives implementation: visit context mechanics, link-heavy                    |

## Layout

Its `src/` layout:

```
src/
├── constructs/   # base construct types (ConstructBase, ContainerConstructBase)
├── document/     # ArtDocument type and createArtDocument factory
├── parser/       # mdast node types, ParserVisitContext, helpers (nodePosition, sectionDepth)
└── index.ts      # exports constructs, document, parser
```

## Related Knowledge

The primitives types are consumed by the sibling packages, each maintaining its own knowledge reference:

- [Constructs](../../constructs/knowledge/index.md)
- [Parser](../../parser/knowledge/index.md)
- [Serializer](../../serializer/knowledge/index.md)
