import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_NAME = '@art-md/bin';
const MANIFEST_NAME = 'package.json';
const ROOT_PATH = '/';
const ENCODING = 'utf8';

type PackageManifest = {
	name?: string;
	version?: string;
};

function readManifest(directory: string): PackageManifest | undefined {
	let contents: string;
	try {
		contents = readFileSync(join(directory, MANIFEST_NAME), ENCODING);
	} catch {
		return undefined;
	}
	return JSON.parse(contents) as PackageManifest;
}

function findPackageManifest(from: string): PackageManifest {
	let directory = from;
	while (directory !== ROOT_PATH) {
		const manifest = readManifest(directory);
		if (manifest?.name === PACKAGE_NAME) {
			return manifest;
		}
		directory = dirname(directory);
	}
	throw new Error(`Cannot find the ${PACKAGE_NAME} manifest above ${from}`);
}

function readModuleDirectory(): string {
	if (typeof import.meta.url === 'string') {
		return dirname(fileURLToPath(import.meta.url));
	}
	return dirname(__filename);
}

export function readPackageVersion(from: string = readModuleDirectory()): string {
	const manifest = findPackageManifest(from);
	const version = manifest.version;

	if (version === undefined) {
		throw new Error(`Cannot read a version from the ${PACKAGE_NAME} manifest`);
	}
	return version;
}
