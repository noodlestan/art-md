#!/usr/bin/env node

import { buildParseProgram } from '../private/bin/programs/parse/buildParseProgram.js';
import { loadBinConfig } from '../private/config/loadBinConfig.js';

const config = loadBinConfig();
const program = buildParseProgram(config);
program.parse();
