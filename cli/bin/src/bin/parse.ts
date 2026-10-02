#!/usr/bin/env node

import { buildParseCommand } from '../private/commander/buildParseCommand';
import { buildProgram } from '../private/commander/buildProgram';

const PROGRAM_NAME = 'art-parse';
const PROGRAM_DESCRIPTION = 'Parse Art MD markdown into a document.';

const commands = [buildParseCommand()];
const spec = { name: PROGRAM_NAME, description: PROGRAM_DESCRIPTION, commands };
const program = buildProgram(spec);

program.parse();
