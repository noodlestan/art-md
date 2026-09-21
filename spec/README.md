# @art-md/spec

> Express structured data in Markdown with an extensible language that enables human and machine authoring at scale and automated transformations.

Art MD is a Markdown dialect for structured data and declarations. It defines a vocabulary, grammar, semantics, and set of language constructs for expressing structured information while remaining readable and editable as Markdown.

This package contains the Art MD language specification. It defines what Art MD means and how its constructs are structured; it does not contain the JavaScript implementation.

In this monorepo you can also find a [Javascript implementation](../README.md) for parsing, validating, mutating, and serializing Art MD documents back to markdown.

## Art AST

An Art MD document is represented as **Art AST**: a hierarchical structure derived from Markdown via `mdast`, with nodes classified as constructs such as sections, fields, comments, tags, and other language elements.

The Art AST provides a structured representation of the information expressed in an Art MD document while retaining the information required to serialise it back to Markdown. The `ArtDocument` is the document-level representation of an Art AST.

**Specification**

The specification describes a grammar for Art MD at four levels:

Vocabulary — the standard terms used to describe Art MD concepts, constructs, and their interpretation.
Semantics — the meaning of Art MD constructs and the rules governing their interpretation.
Structures — the structural model used to describe how constructs are composed and related.
Constructs — the concrete language elements available to an Art MD document, organised by category.

- **Vocabulary** — the standardized terms used to describe artificial language constructs and their interpretation.
- **Semantics** — the meaning and interpretation rules of artificial instructions.
- **Structures** — the meta-model describing grammar constructs.
- **Constructs** — the concrete language constructs, grouped by category (context, expressions, inline, structural).

### Constructs

ADD A TABLE With "Category | Construct | Purpose | Status"

The construct set is intentionally extensible. New constructs can extend the language without changing the underlying structural model.

## Implementation

The Art MD implementation is organised around the language specification.

The [constructs](../libs/constructs/README.md) package defines the concrete representations and contracts for Art MD constructs. The [parser](../libs/parser/README.md) maps Markdown syntax to the Art AST, while the [serializer](../libs/serializser/README.md) maps the Art AST back to Markdown.

The implementation uses an open construct registry, allowing new language constructs to be introduced without redesigning the parser or serializer.

See the [Architecture](../architecture/index.md) documentation for implementation principles, package responsibilities, component design, and testing.

## Work in Progress

Specification material that is still being developed, or was at some point the subject of a POC or experiment, is kept outside the package in ../spec-wip/.

This includes placeholder construct definitions, draft Art MD content, proposed primitives, structures, types, modules, resources, and routines, together with exploratory diagrams.

This material is not part of the specification package and does not represent the backlog. Future specification work is tracked separately in the roadmap parking lot.

### Scripts

- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
