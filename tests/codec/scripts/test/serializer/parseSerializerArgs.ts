import { FIXTURES_DIR } from '../constants.js';
import { getFilterFixtureArg } from '../shared/getFilterFixtureArg.js';

import type { SerializerCliArgs } from './types.js';

export function parseSerializerArgs(): SerializerCliArgs {
	return {
		doWriteDebug: process.argv.includes('--debug-write'),
		filterFixture: getFilterFixtureArg(),
		fixturesDir: FIXTURES_DIR,
	};
}
