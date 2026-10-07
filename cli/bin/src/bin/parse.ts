#!/usr/bin/env node

import { buildParseProgram } from '../private/bin/programs/parse/buildParseProgram';
import { loadBinConfig } from '../private/config/loadBinConfig';

const config = loadBinConfig();
const program = buildParseProgram(config);
program.parse();
