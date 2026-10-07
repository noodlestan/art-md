#!/usr/bin/env node

import { buildCodecProgram } from '../private/bin/programs/codec/buildCodecProgram';
import { loadBinConfig } from '../private/config/loadBinConfig';

const config = loadBinConfig();
const program = buildCodecProgram(config);
program.parse();
