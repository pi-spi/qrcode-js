import { defineConfig } from 'tsup';

export default defineConfig([
    // Build pour Node.js et bundlers (ESM + CJS)
    {
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
    },
    // Build UMD pour utilisation directe dans le navigateur (CDN)
    // Ce build inclut toutes les dépendances pour être autonome
    {
        entry: ['src/index.ts'],
        format: ['iife'],
        globalName: 'PISPIQrcode',
        outDir: 'dist',
        outExtension() {
            return { js: '.umd.js' };
        },
        sourcemap: false,
        minify: true,
        // Ne pas externaliser qrcode - il sera bundlé dans le fichier UMD
        noExternal: ['qrcode'],
    },
]);
