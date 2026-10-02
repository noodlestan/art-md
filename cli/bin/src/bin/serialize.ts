#!/usr/bin/env node

import { buildProgram } from '../private/commander/buildProgram';
import { buildSerializeCommand } from '../private/commander/buildSerializeCommand';

const PROGRAM_NAME = 'art-serialize';
const PROGRAM_DESCRIPTION = 'Serialize an Art MD document into markdown.';

const commands = [buildSerializeCommand()];
const spec = { name: PROGRAM_NAME, description: PROGRAM_DESCRIPTION, commands };
const program = buildProgram(spec);

program.parse();
