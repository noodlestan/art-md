import type { DirectoryExtractContext } from '@purrception/source-fs';

/**
 * Source extensions the TypeScript extractor is able to read.
 *
 * JavaScript files are intentionally unsupported: `@purrception/lang-ts-extract`
 * builds its compiler host without `allowJs`.
 */
export const DEFAULT_SOURCE_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts'];

export function getFileStem(filename: string): string | undefined {
	const at = filename.lastIndexOf('.');

	return at > 0 ? filename.slice(0, at) : undefined;
}

/**
 * Tells whether a filename is a source file the extractor can read.
 *
 * Test files (`*.test.ts`) and declaration files (`*.d.ts`) are not sources.
 */
export function isSourceFile(filename: string, extensions?: string[]): boolean {
	const at = filename.lastIndexOf('.');
	if (at <= 0) {
		return false;
	}

	const allowed = extensions ?? DEFAULT_SOURCE_EXTENSIONS;
	if (!allowed.includes(filename.slice(at))) {
		return false;
	}

	const segments = filename.slice(0, at).split('.');

	return !segments.includes('test') && !segments.includes('d');
}

export function getSourceFiles(ctx: DirectoryExtractContext, extensions?: string[]): string[] {
	return ctx.dirMeta.files.filter(file => isSourceFile(file, extensions));
}
