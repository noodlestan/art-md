#!/usr/bin/env node

import { buildCodecProgram } from '../private/bin/programs/codec/buildCodecProgram.js';
import { loadBinConfig } from '../private/config/loadBinConfig.js';

const config = loadBinConfig();
const program = buildCodecProgram(config);
program.parse();
