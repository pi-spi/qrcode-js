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
    // Ce build suppose que QRCode global est chargé via qrcode/build/qrcode.min.js
    {
        entry: ['src/index.ts'],
        format: ['iife'],
        globalName: 'PISPIQrcode',
        outDir: 'dist',
        platform: 'browser',
        target: 'es2017',
        outExtension() {
            return { js: '.umd.js' };
        },
        sourcemap: false,
        minify: true,
        // Externaliser qrcode - il doit être chargé séparément via qrcode/build/qrcode.min.js
        external: ['qrcode'],
        // Exclure les modules Node.js qui ne sont pas disponibles dans le navigateur
        banner: {
            js: '/* Browser-compatible build - requires QRCode global from qrcode/build/qrcode.min.js */',
        },
        esbuildOptions(options) {
            // Forcer le mode browser pour éviter les imports Node.js
            options.platform = 'browser';
            options.mainFields = ['browser', 'module', 'main'];
            // Définir des polyfills vides pour les modules Node.js
            options.define = {
                ...options.define,
                'process.env.NODE_ENV': '"production"',
            };
            // Exclure les modules Node.js
            options.external = options.external || [];
            if (Array.isArray(options.external)) {
                options.external.push('fs', 'path', 'crypto', 'stream', 'util', 'qrcode');
            }
            return options;
        },
    },
]);
