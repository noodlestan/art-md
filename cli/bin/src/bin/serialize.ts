#!/usr/bin/env node

import { buildSerializeProgram } from '../private/bin/programs/serialize/buildSerializeProgram';
import { loadBinConfig } from '../private/config/loadBinConfig';

const config = loadBinConfig();
const program = buildSerializeProgram(config);
program.parse();
