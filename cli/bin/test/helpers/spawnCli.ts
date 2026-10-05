import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BUNDLE_DIRECTORY = join(PACKAGE_ROOT, 'dist');
const ENCODING = 'utf8';
const BUILD_HINT = 'run `npm run build` in the @art-md/bin package first';

export type CliOptions = {
	args: string[];
	stdin?: string;
};

export type CliResult = {
	code: number;
	stdout: string;
	stderr: string;
};

function readBundlePath(command: string): string {
	const bundle = join(BUNDLE_DIRECTORY, `${command}.mjs`);
	if (!existsSync(bundle)) {
		throw new Error(`Cannot spawn ${command}: the bin bundles are missing, ${BUILD_HINT}`);
	}
	return bundle;
}

export async function spawnCli(command: string, options: CliOptions): Promise<CliResult> {
	const bundle = readBundlePath(command);

	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [bundle, ...options.args], {
			cwd: PACKAGE_ROOT,
		});

		let stdout = '';
		let stderr = '';
		child.stdout.setEncoding(ENCODING);
		child.stderr.setEncoding(ENCODING);
		child.stdout.on('data', (chunk: string) => {
			stdout += chunk;
		});
		child.stderr.on('data', (chunk: string) => {
			stderr += chunk;
		});
		child.on('error', reject);
		child.on('close', code => {
			resolve({ code: code ?? 0, stdout, stderr });
		});
		child.stdin.end(options.stdin ?? '');
	});
}
