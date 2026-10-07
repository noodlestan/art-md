import { describe, expect, it } from 'vitest';

import { createParseOperation } from '../commands/parse/private/createParseOperation';
import { createSerializeOperation } from '../commands/serialize/private/createSerializeOperation';

import { createGenericOperation } from './createGenericOperation';
import { createOperationFailure } from './createOperationFailure';

const URI = 'file:///tmp/document.art';

describe('createOperationFailure', () => {
	it('GIVEN a pending parse operation and an Error', () => {
		const pending = createParseOperation({ uri: URI });

		const failure = createOperationFailure(pending, new Error('unexpected construct'));

		expect(failure.outcome).toBe('failure');
		expect(failure.operation).toBe('parse');
		expect(failure.error).toBe('unexpected construct');
		expect(failure.finishedTs).toBeInstanceOf(Date);
		expect(failure.timing()).toBeGreaterThanOrEqual(0);
	});

	it('GIVEN an error carrying a parenthetical reason', () => {
		const pending = createParseOperation({ uri: URI });

		const failure = createOperationFailure(pending, new Error('parse failed (unexpected EOF)'));

		expect(failure.message()).toBe('unexpected EOF');
	});

	it('GIVEN a multi-line error without a reason', () => {
		const pending = createSerializeOperation({ uri: URI });

		const failure = createOperationFailure(pending, new Error('serialize failed\n  at serialize'));

		expect(failure.message()).toBe('serialize failed');
	});

	it('GIVEN a non-Error failure', () => {
		const pending = createParseOperation({ uri: URI });

		const failure = createOperationFailure(pending, 'plain string failure');

		expect(failure.error).toBe('plain string failure');
	});

	it('GIVEN a parse failure', () => {
		const failure = createOperationFailure(createParseOperation({ uri: URI }), new Error('boom'));

		expect(failure.errorSerialized()).toContain('ParseError');
	});

	it('GIVEN a serialize failure', () => {
		const failure = createOperationFailure(
			createSerializeOperation({ uri: URI }),
			new Error('boom'),
		);

		expect(failure.errorSerialized()).toContain('SerializeError');
	});

	it('GIVEN a generic operation failure', () => {
		const failure = createOperationFailure(createGenericOperation('command'), new Error('boom'));

		expect(failure.errorSerialized()).toContain('OperationError');
	});

	it('GIVEN a serialised failure', () => {
		const failure = createOperationFailure(
			createParseOperation({ uri: URI }),
			new Error('parse failed (unexpected EOF)\n  at parse'),
		);

		expect(failure.errorSerialized()).toBe(
			'ParseError: unexpected EOF\n\n  parse failed (unexpected EOF)\n  at parse',
		);
	});

	it('GIVEN an error without a message line', () => {
		const failure = createOperationFailure(createParseOperation({ uri: URI }), '');

		expect(failure.message()).toBe('unknown error');
	});
});
