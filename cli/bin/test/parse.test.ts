import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeArtDocumentJSONFixture } from '../src/test/fixtures/makeArtDocumentJSONFixture';
import { makeMarkdownStringFixture } from '../src/test/fixtures/makeMarkdownStringFixture';
import { makeTempDir } from '../src/test/helpers/makeTempDir';

import { spawnCli } from './helpers/spawnCli';

const ENCODING = 'utf8';
const MARKDOWN_NAME = 'document.art';
const DOCUMENT_NAME = 'document.json';
const OUTPUT_NAME = 'output.json';
const MISSING_NAME = 'missing.art';
const PENDING_GLYPH = '⏳';
const SUCCESS_GLYPH = '🟢';
const RAW_OPERATION_MARKER = 'outcome';
const COMMANDS_HEADING = 'Commands:';
const LINE_ENDING = '\n';

describe('art-parse', () => {
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
		await writeFile(markdownPath, makeMarkdownStringFixture(), ENCODING);
		await writeFile(documentPath, makeArtDocumentJSONFixture(), ENCODING);
	});

	afterAll(async () => {
		const removals = tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true }));
		await Promise.all(removals);
	});

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
		expect(result.stderr).toBe('');
	});

	it('WHEN given the stdin marker, reads the document from stdin', async () => {
		const result = await spawnCli('parse', { args: ['-'], stdin: makeMarkdownStringFixture() });

		expect(result.code).toBe(0);
		expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
	});

	it('WHEN given no file, reads the document from stdin', async () => {
		const result = await spawnCli('parse', { args: [], stdin: makeMarkdownStringFixture() });

		expect(result.code).toBe(0);
		expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
	});

	it('GIVEN a verbose output mode, logs the pending and success lines on stderr', async () => {
		const result = await spawnCli('parse', { args: [markdownPath, '-o', 'verbose'] });

		expect(result.code).toBe(0);
		expect(JSON.parse(result.stdout)).toMatchObject({ construct: 'Document' });
		expect(result.stderr).toContain(PENDING_GLYPH);
		expect(result.stderr).toContain(SUCCESS_GLYPH);
		expect(result.stderr).not.toContain(RAW_OPERATION_MARKER);
	});

	it('GIVEN a quiet output mode, logs nothing', async () => {
		const result = await spawnCli('parse', { args: [markdownPath, '-o', 'quiet'] });

		expect(result.code).toBe(0);
		expect(result.stderr).toBe('');
	});

	it('GIVEN a default output mode, logs the success line only on stderr', async () => {
		const result = await spawnCli('parse', { args: [markdownPath, '-o', 'default'] });

		expect(result.code).toBe(0);
		expect(result.stderr).not.toContain(PENDING_GLYPH);
		expect(result.stderr).toContain(SUCCESS_GLYPH);
		expect(result.stderr).not.toContain(RAW_OPERATION_MARKER);
	});

	it('GIVEN no output mode, logs nothing', async () => {
		const result = await spawnCli('parse', { args: [markdownPath] });

		expect(result.code).toBe(0);
		expect(result.stderr).toBe('');
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

	it('WHEN the file cannot be read, exits non-zero without a failure log line', async () => {
		const result = await spawnCli('parse', { args: [missingPath] });

		expect(result.code).toBe(1);
		expect(result.stderr).toBe('');
	});
});
