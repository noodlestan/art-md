#!/usr/bin/env node

import {
	configureSerializeCommand,
	runSerializeCommand,
} from '../private/commander/buildSerializeCommand';
import { buildSingleOperationProgram } from '../private/commander/buildSingleOperationProgram';

const PROGRAM_NAME = 'art-serialize';
const PROGRAM_DESCRIPTION = 'Serialize an Art MD document into markdown.';

const spec = {
	name: PROGRAM_NAME,
	description: PROGRAM_DESCRIPTION,
	configure: configureSerializeCommand,
	run: runSerializeCommand,
};
const program = buildSingleOperationProgram(spec);

program.parse();
