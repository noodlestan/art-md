import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeArtDocumentJSONFixture } from '../src/test/fixtures/makeArtDocumentJSONFixture.js';
import { makeMarkdownStringFixture } from '../src/test/fixtures/makeMarkdownStringFixture.js';
import { makeTempDir } from '../src/test/helpers/makeTempDir.js';

import { spawnCli } from './helpers/spawnCli.js';

const ENCODING = 'utf8';
const MARKDOWN_NAME = 'document.art';
const DOCUMENT_NAME = 'document.json';
const MISSING_NAME = 'missing.art';
const SERIALIZED_MARKDOWN = `${makeMarkdownStringFixture()}\n`;
const COMMANDS_HEADING = 'Commands:';

describe('cli integration', () => {
	const tempDirs: string[] = [];
	let markdownPath: string;
	let documentPath: string;
	let missingPath: string;

	beforeAll(async () => {
		const tempDir = makeTempDir(tempDirs);
		markdownPath = join(tempDir, MARKDOWN_NAME);
		documentPath = join(tempDir, DOCUMENT_NAME);
		missingPath = join(tempDir, MISSING_NAME);
		await writeFile(markdownPath, makeMarkdownStringFixture(), ENCODING);
		await writeFile(documentPath, makeArtDocumentJSONFixture(), ENCODING);
	});

	afterAll(async () => {
		const removals = tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true }));
		await Promise.all(removals);
	});
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
		expect(result.stderr).toBe('');
	});

	it('WHEN given the stdin marker, reads the document from stdin', async () => {
		const result = await spawnCli('serialize', {
			args: ['-'],
			stdin: makeArtDocumentJSONFixture(),
		});

		expect(result.code).toBe(0);
		expect(result.stdout).toBe(SERIALIZED_MARKDOWN);
	});

	it('WHEN the document cannot be read, exits non-zero without a failure log line', async () => {
		const result = await spawnCli('serialize', { args: [missingPath] });

		expect(result.code).toBe(1);
		expect(result.stderr).toBe('');
	});
});
