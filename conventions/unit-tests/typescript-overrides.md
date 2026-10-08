# Conventions: Unit Tests / TypeScript Overrides

**Purpose:** Relax TypeScript conventions where test code would otherwise fight its own idioms.

**Description:** Test-code exemptions from the TypeScript conventions.

## Convention: Unit Tests / TypeScript Overrides

**Summary:** Test code is exempt from two TypeScript conventions.

- **No Multi-Line Nested Declarations** — object and array literals in call arguments (including `expect` / `toHaveBeenCalledWith` matchers) may be inline, single- or multi-line.
- **No Function Calls in Literals** — `vi.fn()`, `vi.spyOn`, `expect.any(...)`, fixture factory calls, and `new Date()` may appear inside literals in test code.

**Avoid (production only — forbidden in `src/`):**

```ts
const outcome = await doParse(ctx, { file, write: options.write });
```

**Prefer (in tests):**

```ts
expect(writeMock).toHaveBeenCalledWith('document', {
  file: 'README.md',
  write: true,
});
```
