#!/usr/bin/env node

import { buildParseCommand } from '../private/commander/buildParseCommand';
import { buildProgram } from '../private/commander/buildProgram';
import { buildSerializeCommand } from '../private/commander/buildSerializeCommand';

const PROGRAM_NAME = 'art-codec';
const PROGRAM_DESCRIPTION = 'Parse and serialize Art MD documents.';

const commands = [buildParseCommand(), buildSerializeCommand()];
const spec = { name: PROGRAM_NAME, description: PROGRAM_DESCRIPTION, commands };
const program = buildProgram(spec);

program.parse();
