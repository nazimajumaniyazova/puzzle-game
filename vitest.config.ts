import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // Removed once the first core test lands in stage 2.
    passWithNoTests: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.bench.ts', 'src/main.ts', 'src/solver/worker.ts'],
      thresholds: {
        'src/core/**': { lines: 100, branches: 100, functions: 100, statements: 100 },
        'src/solver/**': { branches: 90 },
      },
    },
  },
});
