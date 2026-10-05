#!/usr/bin/env node

import { configureParseCommand, runParseCommand } from '../private/commander/buildParseCommand';
import { buildSingleOperationProgram } from '../private/commander/buildSingleOperationProgram';

const PROGRAM_NAME = 'art-parse';
const PROGRAM_DESCRIPTION = 'Parse Art MD markdown into a document.';

const spec = {
	name: PROGRAM_NAME,
	description: PROGRAM_DESCRIPTION,
	configure: configureParseCommand,
	run: runParseCommand,
};
const program = buildSingleOperationProgram(spec);

program.parse();
