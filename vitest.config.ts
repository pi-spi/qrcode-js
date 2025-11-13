import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: false,
        environment: 'node',
        include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
        coverage: {
            enabled: true,
            reporter: ['text', 'lcov'],
            reportsDirectory: './coverage',
        },
    },
});
