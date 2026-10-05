import { defineConfig } from 'vitest/config';

import { define } from './vitest.shared';

export default defineConfig({
	define,
	test: {
		include: ['test/**/*.test.ts'],
	},
});
