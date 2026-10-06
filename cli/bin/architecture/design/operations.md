# Art MD Bin - Operations

**Purpose:** Describe operation records, the logger, and the log line format.

## Operation

An operation records one unit of work:

- `operation` — its name, such as `parse`, `serialize`, or `command`.
- `ts` and `finishedTs` — creation and completion times.
- `outcome` — `pending`, `success`, or `failure`.
- `message()` — what to show: the input uri, a given message, or the error reason.
- `timing()` — duration in milliseconds once finished.

A failure adds `error` (the raw error message) and `errorSerialized()`, which prefixes a label: `ParseError`, `SerializeError`, or `OperationError`.

## Creators

`createParseOperation` and `createSerializeOperation` build a pending operation around an input uri. `createGenericOperation` builds one from a name and data, and is used for the `command` operation that opens each invocation. `createOperationSuccess` and `createOperationFailure` move a pending operation to a final state.

## Loggers

`createLogger` holds an undefined output mode and a buffer until the mode is set.

- `quiet` discards the buffered operations and then logs only operations that finished.
- `verbose` flushes the buffer and logs every operation, `pending` included.

Lines go to stderr through `console.error`.

## Log Line

`makeOperationLogLine` returns four cells joined with `|`:

```
🟢 | parse | notes.art | (8ms)
⏳ | command | ["parse",{"file":"notes.art"}] |
```

The first cell is the outcome glyph: `⏳` pending, `🟢` success, `🔴` failure. The second is the operation name. The third is `message()`. The fourth is the duration as `(8ms)` when the operation finished, and empty when it did not.

## Operations Log

`createOperationsLog` forwards every operation to the logger and keeps the finished ones in memory. `ctx.log.all()` returns that list.
