# CHANGELOG

## 0.0.1

### Changed

- **Renamed to `@art-md/codec-test-cli`:** exercises the parser and serializer through the codec.

### Added

- **Codec parser test:** `test-parser` parses every fixture's markdown through the codec and diffs the resulting `ArtDocument` against its snapshot, with `--write` and `--debug` output.
- **Codec serializer test:** `test-serializer` serializes each parser snapshot back to markdown through the codec and round-trips it against the original fixture.
- **Fixture suite:** 43 construct test fixtures covering natural blocks, sections, field blocks, field inlines, and tags.
- **Test harness:** fixture discovery, stable serialization, line diffing, filtered runs via `--path`/`--filter`, and summary reporting.
