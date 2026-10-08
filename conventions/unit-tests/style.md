# Conventions: Unit Tests / Style

**Purpose:** Uniform test prose and layout.

**Description:** Test description prefixes and blank-line block structure.

## Convention: Unit Tests / Test Description Prefixes

**Summary:** Test descriptions start with `WHEN`, `FOR`, or `GIVEN` in all caps.

**Avoid:**

```ts
it('returns the indented JSON document', () => { ... });
```

**Prefer:**

```ts
it('WHEN the document is presented it returns the indented JSON document', () => { ... });
```

## Convention: Unit Tests / Block Spacing

**Summary:** Separate setup, invocation, and assertion blocks with empty lines.

**Avoid:**

```ts
const mock = makeTagMock();
const result = processTag(mock);
expect(result).toBe('test');
```

**Prefer:**

```ts
const mock = makeTagMock();

const result = processTag(mock);

expect(result).toBe('test');
```
