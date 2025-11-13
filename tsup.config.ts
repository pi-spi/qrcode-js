import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: false,
    clean: true,
    outExtension({ format }) {
        if (format === 'esm') {
            return { js: '.mjs' };
        }

        if (format === 'cjs') {
            return { js: '.cjs' };
        }

        return { js: '.js' };
    },
});
