import process from 'node:process';

export async function writeStdout(content: string): Promise<void> {
	const flushed = new Promise<void>(resolve => {
		process.stdout.write(content, () => resolve());
	});
	await flushed;
}
