import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/build/**', '**/uploads/**'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],

    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    plugins: {
      import: importPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tseslint.parser,

      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: true,
      },
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      // ====================
      // TYPE SAFETY
      // ====================

      '@typescript-eslint/await-thenable': 'error',

      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/explicit-function-return-type': 'off',

      '@typescript-eslint/no-floating-promises': 'error',

      '@typescript-eslint/no-unnecessary-condition': 'warn',

      '@typescript-eslint/no-unsafe-argument': 'error',

      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      // ====================
      // CODE QUALITY
      // ====================

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      eqeqeq: ['error', 'always', { null: 'ignore' }],

      'no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions'],
        },
      ],

      'no-eval': 'error',

      'prefer-const': 'error',

      'no-var': 'error',

      'prefer-template': 'error',

      'default-param-last': 'error',

      'no-else-return': 'warn',

      // ====================
      // ASYNC/AWAIT
      // ====================

      'no-return-await': 'error',

      'require-await': 'warn',

      'no-async-promise-executor': 'error',

      'no-await-in-loop': 'warn',

      // ====================
      // IMPORTS
      // ====================

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'always',
          jsx: 'always',
        },
      ],
    },
  },
]);
