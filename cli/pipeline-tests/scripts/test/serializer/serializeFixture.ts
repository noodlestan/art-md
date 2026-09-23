import * as fs from 'node:fs';
import * as path from 'node:path';

import type { ArtDocument } from '@art-md/primitives';
import { createDefaultSerializerConfig, serialize } from '@art-md/serializer';

import type { SerializeResult } from './types';

export function serializeFixture(snapshotPath: string): SerializeResult {
	const baseName = path.basename(snapshotPath);
	const start = Date.now();

	let artDocument: ArtDocument;
	try {
		artDocument = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
	} catch (error) {
		return {
			success: false,
			error: `Cannot read snapshot ${baseName}: ${(error as Error).message}`,
			durationMs: 0,
		};
	}

	try {
		const result = serialize(artDocument, createDefaultSerializerConfig());
		const parsed = result.content;
		const durationMs = Date.now() - start;

		if (!parsed || parsed.length === 0) {
			return {
				success: false,
				error: `ROUNDTRIP FAIL ${baseName} — serializer returned empty output`,
				durationMs,
			};
		}
		return { durationMs, success: true };
	} catch (err) {
		const durationMs = Date.now() - start;
		return {
			success: false,
			error: `ROUNDTRIP FAIL ${baseName} — serializer threw: ${(err as Error).message}`,
			durationMs,
		};
	}
}
