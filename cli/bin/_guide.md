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
build.config.mjs    — esbuild entry point configuration
test/               — integration tests that spawn the built bundles in dist/
src/                — source code
  bin/              — entry points: `codec.ts`, `parse.ts`, `serialize.ts`
  commands/         — the command wiring behind each entry point
  private/          — functions private to this package, never exported
    commander/      — command and program builders over `commander`
    commands/       — the `doParse` and `doSerialize` operations
    config/         — bin configuration loading
    context/        — codec context construction
    io/             — file and stdin readers, file and stdout writers
    log/            — log helpers
    logger/         — operation logging to stderr
    operations/     — operation records and their log lines
    present/        — document and content presentation
  test/             — test helpers for this package
```

Every directory is a module and every file is a function; functions that are not part of a module's public surface are extracted to `private/`. Follow the repository-wide TypeScript conventions.

`src/bin/` holds the three entry points, each wiring its operation onto a program. `art-parse` and `art-serialize` are flat programs that take the input file as their only argument; `art-codec` exposes `parse` and `serialize` as subcommands.

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

Update `_records/package.art` whenever the package's role, entry points, dependencies, or published files change.

## Knowledge References

This package maintains:

- An architecture reference at `architecture/index.md`.
- Decision records at `architecture/adr`.

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
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test:unit # runs the unit tests under src/
npm run build # required before the integration tests, which spawn dist/
npm run test:integration # runs the tests under test/ against the built bundles
```

### Operating Instructions: Verifying Completion

**Instructions:**

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, build, and run both test suites
```
