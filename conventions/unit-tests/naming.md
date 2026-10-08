# Conventions: Unit Tests / Naming

**Purpose:** Identify fixtures, mocks, and spies at a glance so readers know whether data is real or faked.

**Description:** Naming rules for fixture factories, mock factories, function mocks, and spies.

## Convention: Unit Tests / Fixture Factory Naming

**Summary:** Fixture factories use `make{Construct}Fixture`. Fixtures construct plain data; they never mock.

**Avoid:**

```ts
export function makeConfigMock(): Config {
  return { output: { mode: 'silent' } };
}
```

**Prefer:**

```ts
export function makeConfigFixture(): Config {
  return { output: { mode: 'silent' } };
}
```

## Convention: Unit Tests / Mock Factory Naming

**Summary:** Mock factories use `create{Subject}Mock` and live in `test/helpers/{subject}/`. Context, IO, and other object mocks follow the same pattern (`createCommandContextMock`, `createLoggerMock`).

**Avoid:**

```ts
// mock vocabulary on a mock factory
export const makeCodecMock = vi.fn();
```

**Prefer:**

```ts
/** @mocks ArtCodec */
export function createCodecMock(): ArtCodec {
  return { parse: vi.fn(), serialize: vi.fn() } as unknown as ArtCodec;
}
```

## Convention: Unit Tests / Function Mock Naming

**Summary:** Inline function mocks use `{functionName}Mock`; spies created with `vi.spyOn` use `{functionName}Spy`. No `make` prefix.

**Avoid:**

```ts
const write = vi.fn();
const spy = vi.spyOn(process.stdout, 'write');
```

**Prefer:**

```ts
const writeMock = vi.fn();
const writeSpy = vi.spyOn(process.stdout, 'write');
```
