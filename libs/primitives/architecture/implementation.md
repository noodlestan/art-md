# Primitives Implementation

The `@art-js/primitives` package implements the visit context mechanics shared by the parser pipeline.

The visit context is the mutable stack the parser drives construct detection and capture through. It is created and extended in two steps:

- `createParserVisitContext` creates the **root context** for a container construct, typically the document. Defined in `src/parser/context/createParserVisitContext.ts`.
- `createParserVisitContextBase` builds every context, including the root. Defined in `src/parser/context/private/createParserVisitContextBase.ts`. It wires the four context members:
  - `captureChildConstruct` — appends a child construct to the current construct's `children`.
  - `childContext` — pushes a nested context for a construct that owns subsequent content.
  - `parent` — walks up to the enclosing context.
  - `onBeforeConstruct` — invokes the optional boundary hook before a construct is captured.

The mechanics are documented from two perspectives. This document does not reproduce them:

- [Parser Implementation](../../parser/architecture/parser.md) — the builder perspective: how the context stack is mutated during the visit loop and integration.
- [Constructs Parsers](../../constructs/architecture/parsers.md) — the construct perspective: how the processor and integrator hooks use the context.
