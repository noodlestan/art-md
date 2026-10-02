import { makeCodecContextMock } from './makeCodecContextMock';
import { makeParseFixture } from './makeParseFixture';

export function makeDocumentSourceFixture(): string {
	const parsed = makeCodecContextMock().codec.parse(makeParseFixture());
	return JSON.stringify(parsed.document);
}
