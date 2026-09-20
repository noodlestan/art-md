import type { ConstructParserFactory } from '@art-md/constructs';

export type ParserConfig = {
	defaultConstruct: ConstructParserFactory;
	constructs: ConstructParserFactory[];
};
