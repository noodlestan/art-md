# Bin

The `@art-md/bin` package is a CLI that exposes the Art MD codec, parser, and serializer as commands.

## Recommended Reading

Agents SHOULD scan these files for definitions and resource locations when faced with uncertainty or ambiguity that may result from missing resources.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `README.md` — package readme.
- `_records/package.art` — package record.

## Package Layout

```
_records/           — package records
src/                — source code
  index.ts          — public export surface
  bin/              — one entry point per command: `codec.ts`, `parse.ts`, `serialize.ts`
  commands/         — the command wiring behind each entry point
  private/          — functions private to this package, never exported
  test/             — test modules for this package
```

Every directory is a module and every file is a function; functions that are not part of a module's public surface are extracted to `private/`. Follow the repository-wide TypeScript conventions.

`src/bin/` holds the three entry points today. The command behaviour behind them is still to land, so `src/commands/`, `src/private/`, and `src/test/` are filled as that work arrives.

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

Update `_records/package.art` whenever the package's role, entry points, dependencies, or published files change.

## Knowledge References

This package does not maintain a dedicated architecture reference.

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run test # runs vitest against the CLI unit tests
```

### Operating Instructions: Verifying Completion

**Instructions:**

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```
