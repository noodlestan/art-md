import { defineConfig } from 'vitest/config';

import { define } from './vitest.shared';

export default defineConfig({
	define,
	test: {
		include: ['src/**/*.test.ts'],
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary'],
			thresholds: {
				lines: 90,
				functions: 90,
				branches: 75,
				statements: 90,
			},
		},
	},
});
