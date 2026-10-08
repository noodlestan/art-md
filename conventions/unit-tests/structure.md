# Conventions: Unit Tests / Structure

**Purpose:** Keep helpers discoverable and portable across packages.

**Description:** How helpers and fixtures are grouped by domain under `test/helpers/`.

## Convention: Unit Tests / Helper Grouping

**Summary:** Group helpers by domain directory under `test/helpers/{domain}/` — never leave a helper at the helpers root. Port shared utilities from `$ART_WORK` instead of re-inventing them.

**Avoid:**

```text
test/helpers/
└── makeTempDir.ts
```

**Prefer:**

```text
test/helpers/
├── tempDirs/
│   ├── makeTempDir.ts
│   └── removeTempDirs.ts
├── context/
│   └── createCommandContextMock.ts
└── logger/
    └── createLoggerMock.ts
```
