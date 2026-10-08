# Conventions: Unit Tests

**Purpose:** Keep unit tests consistent, readable, and independent of production rules where they would fight test idioms.

**Description:** Unit-test conventions for this repository, split by category. Each module follows the canon `Summary` → `Avoid` → `Prefer` shape.

- [Naming](./naming.md) — fixture factories, mock factories, function mocks, spies.
- [Structure](./structure.md) — helper grouping under `test/helpers/{domain}/`.
- [Mocking](./mocking.md) — grouped mocks, `vi.mock` import style, `@mocks`/`@provides` headers.
- [Style](./style.md) — test description prefixes, block spacing.
- [TypeScript Overrides](./typescript-overrides.md) — test exemptions from TypeScript conventions.
