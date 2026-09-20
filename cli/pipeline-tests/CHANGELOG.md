# CHANGELOG

## 0.0.1

### Added

- **Parser pipeline test:** `test-parser` parses every fixture's markdown and diffs the resulting `ArtDocument` against its snapshot, with `--write` and `--debug` output.
- **Serializer pipeline test:** `test-serializer` serializes each parser snapshot back to markdown and round-trips it against the original fixture.
- **Fixture suite:** 43 construct test fixtures covering natural blocks, sections, field blocks, field inlines, and tags.
- **Test harness:** fixture discovery, stable serialization, line diffing, filtered runs via `--path`/`--filter`, and summary reporting.
