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
const SERIALIZED_MARKDOWN = `${makeMarkdownStringFixture()}\n`;
const COMMANDS_HEADING = 'Commands:';

describe('art-codec', () => {
	const tempDirs: string[] = [];
	let markdownPath: string;
	let documentPath: string;

	beforeAll(async () => {
		const tempDir = makeTempDir(tempDirs);
		markdownPath = join(tempDir, MARKDOWN_NAME);
		documentPath = join(tempDir, DOCUMENT_NAME);
		await writeFile(markdownPath, makeMarkdownStringFixture(), ENCODING);
		await writeFile(documentPath, makeArtDocumentJSONFixture(), ENCODING);
	});

	afterAll(async () => {
		const removals = tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true }));
		await Promise.all(removals);
	});

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
		expect(result.stderr).toBe('');
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
