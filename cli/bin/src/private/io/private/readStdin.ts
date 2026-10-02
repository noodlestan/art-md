import process from 'node:process';
import { text } from 'node:stream/consumers';

export function readStdin(stdin: NodeJS.ReadableStream = process.stdin): Promise<string> {
	return text(stdin);
}
