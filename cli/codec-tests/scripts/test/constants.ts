import * as fs from 'node:fs';
import * as path from 'node:path';

const THIS_DIR = path.dirname(new URL(import.meta.url).pathname);

const findPkgRoot = (dir: string): string => {
	let current = dir;
	while (!fs.existsSync(path.join(current, 'package.json'))) {
		const parent = path.dirname(current);
		if (parent === current) {
			throw new Error('Could not find the package root above ' + THIS_DIR);
		}
		current = parent;
	}
	return current;
};

const DEFAULT_FIXTURES_DIR = path.resolve(
	findPkgRoot(THIS_DIR),
	'..',
	'..',
	'libs',
	'constructs',
	'test',
	'fixtures',
);

const pathArgIdx = process.argv.indexOf('--path');
const pathArg = pathArgIdx !== -1 ? process.argv[pathArgIdx + 1] : undefined;

export const FIXTURES_DIR = pathArg ? path.resolve(pathArg) : DEFAULT_FIXTURES_DIR;
