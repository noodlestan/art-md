# Art MD Bin - Commands

**Purpose:** Describe the command surface: argument, options, streams, exit codes, and edge cases.

## Surface

| command               | program                                | accepts                 |
| --------------------- | -------------------------------------- | ----------------------- |
| `art-parse`           | `art-parse [options] [file]`           | markdown in, JSON out   |
| `art-serialize`       | `art-serialize [options] [file]`       | JSON in, markdown out   |
| `art-codec parse`     | `art-codec parse [options] [file]`     | same as `art-parse`     |
| `art-codec serialize` | `art-codec serialize [options] [file]` | same as `art-serialize` |

`art-codec` also accepts `art-codec --version` and `art-codec --help`.

## Argument

`[file]` is optional. Read from the file when it is given, from stdin when it is missing or `-`.

## Options

| option                | meaning                                      |
| --------------------- | -------------------------------------------- |
| `-V, --version`       | print the version                            |
| `-h, --help`          | print usage                                  |
| `-o, --output <mode>` | `quiet` or `verbose`; default `quiet`        |
| `-w, --write <file>`  | write the result to a file instead of stdout |

## Streams

- stdout carries the result: JSON for parse, markdown for serialize.
- stderr carries operation logs and Commander errors.
- with `--write` nothing is written to stdout.
- output ends with a newline; the newline is added when missing.

## Exit Codes

`0` on success. `1` when the operation fails, which includes an unreadable file, unparsable markdown, or input that is not valid JSON.

## Edge Cases

- `art-parse parse notes.art` reads `parse` as the file path and fails with exit `1`, because a single-operation program has no subcommands.
- serialize reads its input as JSON, so markdown piped into `art-serialize` fails with exit `1`.
- an unknown option or subcommand is reported by Commander on stderr and exits `1`.
- reading from stdin stops at end of input, so `echo "$json" | art-serialize` works as expected.
- `--write` appends the newline to the file as well.
