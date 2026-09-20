# CHANGELOG

## 0.0.1

### Added

- **Construct model:** base construct typing with discriminator, optional source positions, container constructs with children, and a construct factory contract.
- **Parser context:** visit context carrying the active construct, source, child capture, nested contexts, parent traversal, and lifecycle hooks.
- **Source helpers:** mdast position and section-depth extraction.

### Tested

- Unit coverage for the parser context contract and source helpers.

### Documented

- Architecture references for the API and implementation.
