#!/usr/bin/env node

import { buildSerializeProgram } from '../private/bin/programs/serialize/buildSerializeProgram.js';
import { loadBinConfig } from '../private/config/loadBinConfig.js';

const config = loadBinConfig();
const program = buildSerializeProgram(config);
program.parse();
