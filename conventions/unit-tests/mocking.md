# Conventions: Unit Tests / Mocking

**Purpose:** Make mock wiring consistent, assertable, and auditable.

**Description:** Grouped mock objects, `vi.mock` import style, and helper documentation headers.

## Convention: Unit Tests / Grouped Mocks

**Summary:** Grouping related function mocks in a `mocks` object is allowed; access them as `mocks.{functionName}`.

**Avoid:**

```ts
const parseMock = vi.fn();
const serializeMock = vi.fn();
```

**Prefer:**

```ts
const mocks = {
  parse: vi.fn(),
  serialize: vi.fn(),
};

expect(mocks.parse).toHaveBeenCalledWith(content);
```

## Convention: Unit Tests / Import Style Preference

**Summary:** Prefer static imports over async imports in `vi.mock()` blocks when possible.

**Avoid:**

```ts
vi.mock('../io', async () => (await import('../io')) as unknown);
```

**Prefer:**

```ts
vi.mock('../io', () => ({ readInput: vi.fn() }));
```

## Convention: Unit Tests / Helper Header Comments

**Summary:** Document helper purpose with `/** @mocks ... */` or `/** @provides ... */` headers.

**Avoid:**

```ts
export const extractTagsMock = vi.fn();
```

**Prefer:**

```ts
/** @mocks extractTags */
export const extractTagsMock = vi.fn();
```
