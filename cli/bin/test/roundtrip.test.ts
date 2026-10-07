import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeArtDocumentJSONFixture } from '../src/test/fixtures/makeArtDocumentJSONFixture';
import { makeMarkdownStringFixture } from '../src/test/fixtures/makeMarkdownStringFixture';
import { makeTempDir } from '../src/test/helpers/makeTempDir';

import { spawnCli } from './helpers/spawnCli';

const ENCODING = 'utf8';
const MARKDOWN_NAME = 'document.art';
const DOCUMENT_NAME = 'document.json';
const SERIALIZED_MARKDOWN = `${makeMarkdownStringFixture()}\n`;

describe('roundtrip', () => {
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
	it('WHEN the parsed json is piped back, returns the original markdown', async () => {
		const parsed = await spawnCli('parse', { args: [markdownPath] });

		const serialized = await spawnCli('serialize', { args: ['-'], stdin: parsed.stdout });

		expect(serialized.code).toBe(0);
		expect(serialized.stdout).toBe(SERIALIZED_MARKDOWN);
	});
});
