# Overview: Art MD Bin

**Purpose:** Introduce the bin package: what it is, its definitions, its use cases, and how an invocation works.

## What

`@art-md/bin` exposes the Art MD parser and serializer as three executables: `art-parse`, `art-serialize`, and `art-codec`.

## Why

Reading or writing Art MD from a shell, a script, or a pipe should not require writing JavaScript. The package turns Art MD markdown into a document and back again, and is meant to be composed with the usual shell tools.

## Definitions

- **Document** — an Art MD document as JSON, the `construct`/`children` tree produced by the parser.
- **Entry point** — a source file under `src/bin/` that becomes one executable bundle in `dist/`.
- **Operation** — one unit of work with a pending, success, or failure outcome. Each invocation logs one or more operations to stderr.
- **Stdin** — input read from stdin when no file is given or when the argument is `-`.

## Use Cases

- Parse a file to JSON: `art-parse notes.art`
- Parse from a pipe: `cat notes.art | art-parse`
- Save the JSON while keeping the log on the terminal: `art-parse notes.art > notes.json`
- Save without printing: `art-parse notes.art --write notes.json`
- Round trip: `art-parse notes.art | art-serialize`
- Read from stdin to a file: `art-serialize < notes.json > notes.art`

## How It Works

Commander builds a program. The program's action creates a context, calls the operation, and sets the exit code from the outcome.

`runParse` and `runSerialize` log the operation, then `doParse` and `doSerialize`:

1. read the input — `readInput` loads a file, or stdin when the path is missing or `-`;
2. run the codec — parse produces a document, serialize produces markdown;
3. present the result — parse always presents JSON, serialize presents its content;
4. write it — `writeOutput` prints to stdout, or to a file when `--write` is used.

Operation records go to stderr through the logger, so stdout carries only the result.
