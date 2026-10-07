import { describe, expect, it } from 'vitest';

import { createParseOperation } from '../commands/parse/private/createParseOperation';
import { createGenericOperation } from '../operations/createGenericOperation';
import { createOperationSuccess } from '../operations/createOperationSuccess';

import { makeOperationLogLine } from './makeOperationLogLine';

const URI = 'file:///tmp/document.art';

describe('makeOperationLogLine', () => {
	it('GIVEN a standalone pending operation, renders the glyph and the operation', () => {
		const pending = createParseOperation({ uri: URI });

		const line = makeOperationLogLine(pending, { standalone: true });

		expect(line[0]).toBe('⏳');
		expect(line[1]).toBe('parse');
		expect(line[2]).toBe(URI);
		expect(line[3]).toBe('');
	});

	it('GIVEN a standalone success operation, renders the timing in brackets', () => {
		const success = createOperationSuccess(createParseOperation({ uri: URI }));

		const line = makeOperationLogLine(success, { standalone: true });

		expect(line[0]).toBe('🟢');
		expect(line[3]).toMatch(/^\(\d+ms\)$/);
	});

	it('GIVEN no standalone option, renders the raw timing', () => {
		const success = createOperationSuccess(createParseOperation({ uri: URI }));

		const line = makeOperationLogLine(success);

		expect(line[3]).toMatch(/^\d+$/);
	});

	it('GIVEN a failure operation, renders the failure glyph', () => {
		const pending = createParseOperation({ uri: URI });
		const failure = { ...pending, outcome: 'failure' as const, finishedTs: new Date() };

		const line = makeOperationLogLine(failure, { standalone: true });

		expect(line[0]).toBe('🔴');
	});

	it('GIVEN a generic operation, renders the serialised data as the message', () => {
		const pending = createGenericOperation('command', ['parse', URI]);

		const line = makeOperationLogLine(pending, { standalone: true });

		expect(line[1]).toBe('command');
		expect(line[2]).toBe(JSON.stringify(['parse', URI]));
	});
});
