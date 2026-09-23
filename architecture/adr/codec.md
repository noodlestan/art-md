# Codec

**Purpose:** Decisions about the codec and source contracts — the `@art-md/codec` package and the source contracts in `@art-md/primitives`.

## Decision: Contracts in Primitives

**Status:** Adopted

**Context:** The codec and source abstractions are shared across parser, serializer, and concrete content sources.

**Decision:** The `ArtCodec`, `ArtContentSource`, and `ArtDocumentSource` contracts live in `@art-md/primitives`. `@art-md/codec` provides the codec implementation `createArtCodec()`.

**Consequences:** The contracts have a stable, dependency-light home that can be consumed by different implementations. The codec package can evolve independently, while alternative codec and source implementations remain loosely coupled to the rest of the system.

## Decision: Dependency Direction

**Status:** Adopted

**Context:** A document source composes a content source and a codec. The dependency direction must be explicit and acyclic.

**Decision:** The `ArtDocumentSource` is final and composes an `ArtContentSource` and an `ArtCodec`. The codec depends only on the content-level abstractions it needs and concrete content sources implement read/write without depending on the codec or document source. `ParseContext` and `SerializeContext` remain independent of content sources.

## Decision: Codec Owns Construct Configuration

**Status:** Adopted

**Context:** The codec exposes a streamlined document-level API. The codec construct configuration must be passed once, not passed per call.

**Decision:** A codec is created with its construct configuration and retains that configuration for its document-level operations. Its `parse()` and `serialize()` methods therefore operate against the codec's configured constructs rather than receiving configuration for each call.
