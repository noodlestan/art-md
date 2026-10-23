import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createModuleEntityExtractor } from '@noodlestan/purrfiles-extract';
import { extractEntitiesFromFileSystem } from '@purrception/source-fs';

async function main() {
	const extracted = await extractEntitiesFromFileSystem({
		rootDir: 'src/',
		extractors: [createModuleEntityExtractor({ ignore: ['private', 'test'] })],
		meta: { package: '@art-md/parser' },
	});

	const entities = extracted.map(({ entity }) => entity);

	await mkdir('./dist', { recursive: true });
	await writeFile('./dist/meta.json', JSON.stringify({ entities }, null, 2));

	const fileStats = await stat('./dist/meta.json');
	console.info(
		`Wrote : ${path.resolve('./dist/meta.json')} (entities: ${entities.length} size: ${fileStats.size} bytes)`,
	);
}

main().catch(error => {
	console.error('Failed to extract entities from package:', error);
	process.exit(1);
});
