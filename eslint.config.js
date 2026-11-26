import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { configs as tseslint } from 'typescript-eslint';

const NO_HTML_STRINGS = [
  {
    selector: 'AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]',
    message: 'Build DOM with createElement and textContent.',
  },
  {
    selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
    message: 'Do not insert HTML strings.',
  },
  { selector: 'TSEnumDeclaration', message: 'Use union types or as-const objects.' },
];

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    'reports',
    'public/legacy',
  ]),

  js.configs.recommended,
  tseslint.strictTypeChecked,
  tseslint.stylisticTypeChecked,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    languageOptions: {
      parserOptions: {
        // Root-level JS configs are not part of any tsconfig project.
        projectService: { allowDefaultProject: ['*.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-default-export': 'error',
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/core',
              from: ['./src/solver', './src/ui', './src/app'],
              message: 'core depends on nothing.',
            },
            {
              target: './src/solver',
              from: ['./src/ui', './src/app'],
              message: 'solver depends on core only.',
            },
            {
              target: './src/ui',
              from: ['./src/app', './src/solver'],
              message: 'ui reaches the solver only through app.',
            },
          ],
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'no-restricted-syntax': ['error', ...NO_HTML_STRINGS],
    },
  },

  // Pure layers: deterministic, no clock, no global randomness.
  {
    files: ['src/core/**/*.ts', 'src/solver/**/*.ts'],
    ignores: ['src/solver/worker.ts', '**/*.test.ts', '**/*.bench.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Use the seeded Rng from core/rng.' },
        { object: 'Date', property: 'now', message: 'Time comes in through actions (now).' },
      ],
      'no-restricted-syntax': [
        'error',
        ...NO_HTML_STRINGS,
        {
          selector: "NewExpression[callee.name='Date']",
          message: 'Time comes in through actions (now).',
        },
      ],
    },
  },

  { files: ['**/*.test.ts'], ...vitest.configs.recommended },
  {
    // Plain JS tool configs cannot carry type annotations.
    files: ['**/*.js'],
    extends: [tseslint.disableTypeChecked],
    rules: { '@typescript-eslint/explicit-module-boundary-types': 'off' },
  },
  { files: ['*.config.{js,ts}'], rules: { 'import-x/no-default-export': 'off' } },

  prettier, // always last
]);
