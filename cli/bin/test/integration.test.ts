import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeDocumentSourceFixture } from '../src/test/helpers/makeDocumentSourceFixture';
import { makeParseFixture } from '../src/test/helpers/makeParseFixture';
import { makeTempDir } from '../src/test/helpers/makeTempDir';

import { spawnCli } from './helpers/spawnCli';

const ENCODING = 'utf8';
const MARKDOWN_NAME = 'document.art';
const DOCUMENT_NAME = 'document.json';
const OUTPUT_NAME = 'output.json';
const MISSING_NAME = 'missing.art';
const SERIALIZED_MARKDOWN = `${makeParseFixture()}\n`;
const PENDING_GLYPH = '⏳';
const SUCCESS_GLYPH = '🟢';
const FAILURE_GLYPH = '🔴';
const COMMANDS_HEADING = 'Commands:';
const LINE_ENDING = '\n';

describe('cli integration', () => {
	const tempDirs: string[] = [];
	let markdownPath: string;
	let documentPath: string;
	let missingPath: string;
	let outputPath: string;

	beforeAll(async () => {
		const tempDir = makeTempDir(tempDirs);
		markdownPath = join(tempDir, MARKDOWN_NAME);
		documentPath = join(tempDir, DOCUMENT_NAME);
		missingPath = join(tempDir, MISSING_NAME);
		outputPath = join(tempDir, OUTPUT_NAME);
		await writeFile(markdownPath, makeParseFixture(), ENCODING);
		await writeFile(documentPath, makeDocumentSourceFixture(), ENCODING);
	});

	afterAll(async () => {
		const removals = tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true }));
		await Promise.all(removals);
	});

	describe('art-codec', () => {
		it('WHEN asked for the version, prints the bin package version', async () => {
			const result = await spawnCli('codec', { args: ['--version'] });

			expect(result.code).toBe(0);
			expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
		});

		it('WHEN asked for help, lists both commands', async () => {
			const result = await spawnCli('codec', { args: ['--help'] });

			expect(result.code).toBe(0);
			expect(result.stdout).toContain(COMMANDS_HEADING);
			expect(result.stdout).toContain('parse [options] [file]');
			expect(result.stdout).toContain('serialize [options] [file]');
		});

		it('WHEN parsing a file, writes the document json to stdout', async () => {
			const result = await spawnCli('codec', { args: ['parse', markdownPath] });

			expect(result.code).toBe(0);
			expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
			expect(result.stderr).toContain(SUCCESS_GLYPH);
		});

		it('WHEN serializing a document, writes the markdown to stdout', async () => {
			const result = await spawnCli('codec', { args: ['serialize', documentPath] });

			expect(result.code).toBe(0);
			expect(result.stdout).toBe(SERIALIZED_MARKDOWN);
		});

		it('WHEN parsing a file, rejects a json flag', async () => {
			const result = await spawnCli('codec', { args: ['parse', markdownPath, '--json'] });

			expect(result.code).not.toBe(0);
			expect(result.stderr).toContain('--json');
		});
	});

	describe('art-parse', () => {
		it('WHEN asked for the version, prints the bin package version', async () => {
			const result = await spawnCli('parse', { args: ['--version'] });

			expect(result.code).toBe(0);
			expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
		});

		it('WHEN asked for help, reports a flat usage with no subcommands', async () => {
			const result = await spawnCli('parse', { args: ['--help'] });

			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Usage: art-parse [options] [file]');
			expect(result.stdout).not.toContain(COMMANDS_HEADING);
		});

		it('WHEN parsing a file, writes the document json to stdout', async () => {
			const result = await spawnCli('parse', { args: [markdownPath] });

			expect(result.code).toBe(0);
			expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
		});

		it('GIVEN a leading subcommand word, treats it as the file path and fails', async () => {
			const result = await spawnCli('parse', { args: ['parse', markdownPath] });

			expect(result.code).toBe(1);
			expect(result.stderr).toContain(FAILURE_GLYPH);
			expect(result.stderr).toContain('parse');
		});

		it('WHEN given the stdin marker, reads the document from stdin', async () => {
			const result = await spawnCli('parse', { args: ['-'], stdin: makeParseFixture() });

			expect(result.code).toBe(0);
			expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
		});

		it('WHEN given no file, reads the document from stdin', async () => {
			const result = await spawnCli('parse', { args: [], stdin: makeParseFixture() });

			expect(result.code).toBe(0);
			expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
		});

		it('GIVEN a verbose output mode, logs the pending and success lines on stderr', async () => {
			const result = await spawnCli('parse', { args: [markdownPath, '-o', 'verbose'] });

			expect(result.code).toBe(0);
			expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
			expect(result.stderr).toContain(PENDING_GLYPH);
			expect(result.stderr).toContain(SUCCESS_GLYPH);
		});

		it('GIVEN a quiet output mode, logs the success line only on stderr', async () => {
			const result = await spawnCli('parse', { args: [markdownPath, '-o', 'quiet'] });

			expect(result.code).toBe(0);
			expect(result.stderr).not.toContain(PENDING_GLYPH);
			expect(result.stderr).toContain(SUCCESS_GLYPH);
		});

		it('GIVEN no output mode, logs the success line only on stderr', async () => {
			const result = await spawnCli('parse', { args: [markdownPath] });

			expect(result.code).toBe(0);
			expect(result.stderr).not.toContain(PENDING_GLYPH);
			expect(result.stderr).toContain(SUCCESS_GLYPH);
		});

		it('GIVEN a write target, writes the document to that file and keeps stdout empty', async () => {
			const result = await spawnCli('parse', { args: [markdownPath, '--write', outputPath] });
			const written = await readFile(outputPath, ENCODING);

			expect(result.code).toBe(0);
			expect(result.stdout).toBe('');
			expect(written.endsWith(LINE_ENDING)).toBe(true);
			expect(JSON.parse(written)).toMatchObject({ construct: 'Document' });
		});

		it('WHEN redirected to a file, terminates it with a single line ending', async () => {
			const result = await spawnCli('parse', { args: [markdownPath] });

			expect(result.code).toBe(0);
			expect(result.stdout.endsWith(LINE_ENDING)).toBe(true);
			expect(result.stdout.endsWith(`${LINE_ENDING}${LINE_ENDING}`)).toBe(false);
			expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
		});

		it('WHEN the file cannot be read, exits non-zero with a failure log line', async () => {
			const result = await spawnCli('parse', { args: [missingPath] });

			expect(result.code).toBe(1);
			expect(result.stderr).toContain(FAILURE_GLYPH);
			expect(result.stderr).toContain('parse');
		});
	});

	describe('art-serialize', () => {
		it('WHEN asked for the version, prints the bin package version', async () => {
			const result = await spawnCli('serialize', { args: ['--version'] });

			expect(result.code).toBe(0);
			expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
		});

		it('WHEN asked for help, reports a flat usage with no subcommands', async () => {
			const result = await spawnCli('serialize', { args: ['--help'] });

			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Usage: art-serialize [options] [file]');
			expect(result.stdout).not.toContain(COMMANDS_HEADING);
		});

		it('WHEN serializing a document, writes the markdown to stdout', async () => {
			const result = await spawnCli('serialize', { args: [documentPath] });

			expect(result.code).toBe(0);
			expect(result.stdout).toBe(SERIALIZED_MARKDOWN);
		});

		it('GIVEN a leading subcommand word, treats it as the file path and fails', async () => {
			const result = await spawnCli('serialize', { args: ['serialize', documentPath] });

			expect(result.code).toBe(1);
			expect(result.stderr).toContain(FAILURE_GLYPH);
			expect(result.stderr).toContain('serialize');
		});

		it('WHEN given the stdin marker, reads the document from stdin', async () => {
			const result = await spawnCli('serialize', {
				args: ['-'],
				stdin: makeDocumentSourceFixture(),
			});

			expect(result.code).toBe(0);
			expect(result.stdout).toBe(SERIALIZED_MARKDOWN);
		});

		it('WHEN the document cannot be read, exits non-zero with a failure log line', async () => {
			const result = await spawnCli('serialize', { args: [missingPath] });

			expect(result.code).toBe(1);
			expect(result.stderr).toContain(FAILURE_GLYPH);
			expect(result.stderr).toContain('serialize');
		});
	});

	describe('round trip', () => {
		it('WHEN the parsed json is piped back, returns the original markdown', async () => {
			const parsed = await spawnCli('parse', { args: [markdownPath] });

			const serialized = await spawnCli('serialize', { args: ['-'], stdin: parsed.stdout });

			expect(serialized.code).toBe(0);
			expect(serialized.stdout).toBe(SERIALIZED_MARKDOWN);
		});
	});
});
