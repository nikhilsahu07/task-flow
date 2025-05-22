import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginPrettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.turbo/**',
      'build/**',
      '**/*.d.ts',
      '**/*.js',
      '**/vite.config.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: eslintPluginReact,
      'react-hooks': reactHooks,
      'react-refresh': eslintPluginReactRefresh,
      prettier: pluginPrettier,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        URLSearchParams: 'readonly',
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Prettier overriding
      'prettier/prettier': 'error',

      // React specific rules from eslint-plugin-react (using flat config)
      ...eslintPluginReact.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',

      // React Refresh
      'react-refresh/only-export-components': 'off',

      // Typescript specific
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_|^err',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-undef': 'off', // TypeScript already handles this
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
