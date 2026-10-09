import { FIXTURES_DIR } from '../constants.js';
import { getFilterFixtureArg } from '../shared/getFilterFixtureArg.js';

import type { ParserCliArgs } from './types.js';

export function parseParserArgs(): ParserCliArgs {
	return {
		doWrite: process.argv.includes('--write'),
		doWriteDebug: process.argv.includes('--debug-write'),
		filterFixture: getFilterFixtureArg(),
		fixturesDir: FIXTURES_DIR,
	};
}
