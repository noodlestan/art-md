# Components: Art MD Bin

**Purpose:** Identify the components of the bin package and how they are connected.

## Entry Points

The three entry points — `parse`, `serialize`, and `codec` — are the executable entry points for the package.

Each entry point:

1. Loads the Bin configuration with `loadBinConfig()`.
2. Creates the appropriate Commander program.
3. Dispatches the program through Commander's `parse()` method.

Commander parses `argv`, applies the configured options and arguments, and invokes the corresponding command handlers.

The entry points do not implement command behaviour.

## Bin

Bin contains the Commander-specific implementation of the CLI. It defines the programs, options, and Commander command wiring used by the entry points.

### Programs

Programs create and configure Commander instances.

The codec program:

- defines the program name, description, and version;
- registers the `parse` and `serialize` commands;
- attaches their options and arguments;
- connects each Commander command to its command handler.

Programs configure Commander but do not implement command behaviour.

### Options

Options define the arguments and options exposed through Commander.

The parse and serialize commands share options for:

- selecting the output mode;
- selecting an input file;
- selecting an output file.

Options are responsible for defining the Commander interface. They do not perform the corresponding command operations.

### Commands

Bin commands connect Commander to the command implementations.

A Commander command handler receives the parsed arguments and options, creates the command logger, determines the effective output mode, records the command operation, creates the command context, and invokes the corresponding command implementation.

The command implementations themselves belong to the Commands component.

## Commands

Commands implement the behaviour exposed by the CLI independently of Commander.

### Parse

`doParse` reads Markdown input, parses it through the configured codec, and presents the resulting document.

It receives its dependencies through `CommandContext` and does not create CLI infrastructure itself.

### Serialize

`doSerialize` reads an `ArtDocument`, serializes it through the configured codec, and writes the resulting Markdown.

It receives its dependencies through `CommandContext` and does not create CLI infrastructure itself.

## Config

`loadBinConfig` creates the configuration used to initialise and execute the CLI.

The configuration provides:

- the package build-time version;
- the default output mode;
- codec configuration overrides.

The entry points load the configuration before creating the Commander program. The resulting configuration is passed into program construction and command context creation.

Commands do not load configuration themselves.

## Context

`createCommandContext` creates the runtime context for command execution.

It constructs the configured Art codec and the private CLI infrastructure required by commands, then exposes them through `CommandContext`.

The context provides:

- the configuration;
- the Art codec;
- the operations log;
- command IO.

Commands use the context rather than constructing these dependencies directly.

## IO

IO provides the boundary between commands and the filesystem and standard streams.

`readInput` reads from stdin when no input target is supplied, or when the target is the stdin marker; otherwise it reads the specified file.

`writeOutput` writes to stdout when no output target is supplied, or to the specified file otherwise. Output is terminated before it is written.

Direct access to files, stdin, and stdout is contained within the private IO implementation.

## Logger

The logger provides diagnostic output for CLI execution.

Command handlers create and configure a logger before executing a command. The logger's output mode is determined by the command option when supplied, otherwise by the configured default output mode.

The logger is also used by the operation logging infrastructure.

## Presentation

Presentation formats values for output to the user.

`presentDocument` formats an `ArtDocument` as JSON for command output.

Presentation is separate from command execution and from the Commander interface: commands decide what result to present, while Presentation determines its representation.
