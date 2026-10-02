import { readFileSync } from 'node:fs';

const { version } = JSON.parse(
	readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };

/**
 * Mirrors the `define` in `build.config.mjs`, so tests observe the same
 * build-injected globals the bundles do.
 */
export const define = {
	__BUILD_VERSION__: JSON.stringify(version),
};
