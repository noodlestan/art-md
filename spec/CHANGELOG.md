# CHANGELOG

## 0.0.1

### Added

- **Package structure:** skeleton of the artificial language specification — grammar, primitives, structures, types, modules, resources, and routines sections written in art.
- **Constructs / Structural / FieldBlock:** block field with a `**Name:**` label capturing following natural blocks, closed by boundary constructs.
- **Constructs / Structural / NaturalBlock:** the catch-all default classifying any unmatched markdown as natural content.
- **Constructs / Structural / SectionBlock:** heading-based resource declaration with depth hierarchy, kind, and `(#tag)` metadata.
- **Constructs / Inline / FieldInline:** single-line named property value with phrasing content and tags.
- **Constructs / Expressions / NaturalExpression:** semantic text layer carrying human-readable meaning and intent.
- **Constructs / Expressions / Tag:** `(#tag)` metadata for identification, classification, and filtering.

### Drafted

- **Constructs:** 26 more constructs drafted — context aliasing/scoping, directives, identifiers and references, example and vocabulary declarations, procedural blocks and workflows, and nine statement forms.
- **Primitives:** enum, list, record, record-field, and scalar value primitives drafted.
- **Structures and types:** abstract structure and type-system models drafted.
- **Modules:** POC module system drafted in pseudo-art — listing, resolving, and validating modules, references, and programs.
- **Routines:** routine invocation and statement generation drafted in pseudo-art.
