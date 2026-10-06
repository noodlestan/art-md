# @art-md/bin

> Parse and serialize Art MD from the command line.

CLI that exposes the Art MD codec, parser, and serializer as commands.

This package is part of the [Art MD](https://art-md.noodlestan.org) project.

## Commands

| command         | bin entry              | role                                           |
| --------------- | ---------------------- | ---------------------------------------------- |
| `art-parse`     | `./dist/parse.mjs`     | Parse Art MD markdown into a document.         |
| `art-serialize` | `./dist/serialize.mjs` | Serialize an Art MD document back to markdown. |
| `art-codec`     | `./dist/codec.mjs`     | Run either operation through one command.      |

Every command reads from a file or from stdin, writes its result to stdout, and logs
progress to stderr. Each is a self-executing entry point under `src/bin/`, built into its
own bundle.

## art-parse

Parses Art MD markdown into an Art MD document and writes the document as JSON.

```bash
art-parse [options] [file]
```

Reading a file:

```bash
$ art-parse release-notes.art
{
  "construct": "Document",
  "children": [
    {
      "construct": "SectionBlock",
      "name": "Release Notes",
      "children": [ ... ],
      "depth": 1,
      "position": { ... }
    }
  ],
  "position": { ... }
}
```

Reading stdin, either by piping or with the `-` marker:

```bash
$ cat release-notes.art | art-parse
$ art-parse - < release-notes.art
```

Writing stdout to a file — the progress line stays on stderr, so a plain redirect
captures the JSON and nothing else:

```bash
$ art-parse release-notes.art > release-notes.json
```

Use `-w` instead to write the file without printing anything at all:

```bash
$ art-parse release-notes.art --write release-notes.json
```

| option                | description                                   |
| --------------------- | --------------------------------------------- |
| `-V, --version`       | Output the version number.                    |
| `-o, --output <mode>` | One of `quiet\|verbose`.                      |
| `-w, --write <file>`  | Write the result to a file instead of stdout. |
| `-h, --help`          | Display help for the command.                 |

## art-serialize

Serializes an Art MD document back into markdown and writes the markdown to stdout. The
input is a document as produced by `art-parse`.

```bash
art-serialize [options] [file]
```

Reading a file:

```bash
$ art-serialize release-notes.json
# Release Notes

Ship the codec.
```

Reading stdin, either by piping or with the `-` marker:

```bash
$ cat release-notes.json | art-serialize
$ art-serialize - < release-notes.json
```

Writing stdout to a file — the progress line stays on stderr, so a plain redirect
captures the markdown and nothing else:

```bash
$ art-serialize release-notes.json > release-notes.art
```

Use `-w` instead to write the file without printing anything at all:

```bash
$ art-serialize release-notes.json --write release-notes.art
```

It takes the same options as `art-parse`.

## art-codec

Runs either operation through one command, as `parse` and `serialize` subcommands.

```bash
art-codec parse [options] [file]
art-codec serialize [options] [file]
```

Both take the same options as `art-parse`. Reach for `art-codec` when a script should not
depend on which of the two binaries is installed; otherwise prefer `art-parse` and
`art-serialize`.

## Development

Make sure you read the [Art MD README](../../README.md) first.

### Build

This package is meant for use in Node.js environments. The entry points are built with `esbuild`, pre-configured by [Workspace Tooling](https://github.com/noodlestan/workspace-tooling). `build.config.mjs` bundles one self-executing entry point per command into `dist/`, and inlines the package version so `--version` works from the bundle alone.

### Tests

Unit tests under `src/` cover the private modules; the integration tests under `test/` spawn the built bundles in `dist/`, so run `npm run build` before them. `npm run ci` runs both. Coverage thresholds are declared in `vitest.config.ts`; run `npx vitest run --coverage` to check them.

### Scripts

Run from this package directory:

- `npm run dev` — rebuild on change
- `npm run build` — produce the full build
- `npm run build:clean` — remove `dist/`
- `npm run lint` — report prettier, eslint, and `tsc --noEmit` issues
- `npm run lint:fix` — fix formatting and lint issues
- `npm run test` — start vitest over every test in watch mode
- `npm run test:unit` — run the unit tests under `src/` once
- `npm run test:integration` — run the tests under `test/` against `dist/`
- `npm run ci` — lint, build, and run both test suites

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
