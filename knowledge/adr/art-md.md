# Art MD

**Purpose:** Decisions about the art-md round-trip between markdown and the Art AST — the parser, serializer, and constructs packages that turn markdown into structured records and back.

## Decision: MD Substrate MDAST

**Status:** Adopted

**Context:** The parser needs a markdown compiler substrate. The candidates were micromark and mdast. An early proposal built directly on micromark; the implemented parser uses mdast.

**Decision:** Build the parser on mdast (`mdast-util-from-markdown`). With mdast, art-md becomes a thin layer for classifying and nesting nodes. The unified-js ecosystem provides the rest: markdown extensions, HTML conversion, and renderers such as solid (https://github.com/bigmistqke/solid-mdast-renderer).

**Consequences:** art-md composes unified-js packages instead of re-implementing markdown infrastructure.

## Decision: Visitor Architecture

**Status:** Adopted

**Context:** The builder must walk the tree and let constructs claim nodes.

**Decision:** The parser walks the mdast tree with `unist-util-visit`. Construct processors are consulted in order; the first claim wins. The builder stays construct-agnostic — it never names a concrete construct.

## Decision: Context Pattern

**Status:** Adopted

**Context:** Constructs own subsequent content and nest. Hooks need a window into the parse.

**Decision:** The parser injects a `ParserVisitContext` stack into the hooks. Constructs mutate the context (`captureChildConstruct`, `childContext`, `parent`, `onBeforeConstruct`) to enter and leave capturing mode.

## Decision: Constructs Package Structure

**Status:** Adopted

**Context:** The constructs package spans three concerns: factories, parsers, serializers.

**Decision:** Split `@art-md/constructs` into three independent slices — factories, parsers, serializers — with one folder per construct per slice.

## Decision: Parser/Serializer Independent from Constructs

**Status:** Adopted

**Context:** Parsers and serializers must not hardcode constructs.

**Decision:** The parser and the serializer are construct-agnostic. They drive detection through the `@art-md/constructs` contract types; wiring happens through config factories. Neither names a concrete construct.

## Decision: Natural Block Fallback

**Status:** Adopted

**Context:** Not every markdown is an art construct. Unrecognised content must stay in the document.

**Decision:** Unrecognised markdown is preserved as `NaturalBlock` (block content) and `NaturalExpression` (phrasing content) rather than dropped. The parser classifies, it does not validate.

## Decision: Tags Parsing

**Status:** Adopted

**Context:** Tags use `(#tag)` syntax at the end of headings and field text.

**Decision:** `Tag` has no parser factory. Owning constructs extract tags in their own processors via the shared `extractTags` helper.

## Decision: Round-Trip Fidelity Is Structural

**Status:** Adopted

**Context:** Claims of byte-identity or lossless round-trip overstate the guarantee. Probes show the codec normalises whitespace: blank-line runs collapse, trailing spaces strip, CRLF becomes LF, heading indentation canonicalises, a missing final newline is added.

**Decision:** The codec preserves all valid Markdown structure. Extraneous whitespace and invalid syntax are normalised to canonical Markdown per CommonMark by the `unified` substrate (`mdast-util-from-markdown` / `mdast-util-to-markdown`), and serialisation enforces exactly one final newline. Verified: `"# One\n\n\n\n# Two\n"` serialises to `"# One\n\n# Two\n"`.

**Consequences:** Consumers needing byte-identity must retain the original content — the records layer line-splices content strings and never re-emits untouched text through the codec. The fixture corpus under `$PROJECT/libs/constructs/test/fixtures/` is authored in canonical form, so the suite verifies byte-equality for canonical input only.
