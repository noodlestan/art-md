import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

export default {
  common: {
    bundle: true,
    tsconfig: 'tsconfig.build.json',
    entryPoints: ['src/bin/codec.ts', 'src/bin/parse.ts', 'src/bin/serialize.ts'],
    external: ['commander'],
    define: { __BUILD_VERSION__: JSON.stringify(version) },
  },
  esm: {},
};
