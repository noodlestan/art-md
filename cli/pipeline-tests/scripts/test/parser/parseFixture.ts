import * as fs from 'node:fs';

import { createDefaultConfig, parse } from '@art-md/parser';

import type { ParseResult } from './types';

export function parseFixture(filePath: string): ParseResult {
	let content: string;
	try {
		content = fs.readFileSync(filePath, 'utf-8');
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message,
			durationMs: 0,
		};
	}

	const startTime = Date.now();
	try {
		const result = parse(content, createDefaultConfig());
		const durationMs = Date.now() - startTime;
		return { success: true, document: result.document, durationMs };
	} catch (error) {
		const durationMs = Date.now() - startTime;
		return {
			success: false,
			error: (error as Error).message,
			durationMs,
		};
	}
}
