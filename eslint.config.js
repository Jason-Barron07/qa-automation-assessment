import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        ignores: ['node_modules/**', '.features-gen/**', 'playwright-report/**', 'test-results/**', 'blob-report/**', 'tmp/**']
    },
    {
        files: ['**/*.js'],
        extends: [js.configs.recommended]
    },
    {
        files: ['**/*.ts'],
        extends: [tseslint.configs.recommendedTypeChecked],
        languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
        plugins: { '@stylistic': stylistic, jsdoc },
        settings: { jsdoc: { mode: 'typescript' } },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/naming-convention': [
                'error',
                { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
                { selector: 'class', format: ['PascalCase'] },
                { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' }
            ],
            '@stylistic/brace-style': ['error', 'allman'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/member-delimiter-style': ['error', { multiline: { delimiter: 'semi', requireLast: true } }],
            'curly': ['error', 'all'],
            'no-empty-pattern': 'off',
            'jsdoc/check-param-names': 'error',
            'jsdoc/check-tag-names': 'error',
            'jsdoc/require-param': 'error',
            'jsdoc/require-returns': 'error',
            'jsdoc/require-jsdoc': ['error', {
                publicOnly: true,
                require: { FunctionDeclaration: true, MethodDefinition: true }
            }]
        }
    },
    {
        files: ['src/**/*.ts', 'tests/**/*.ts'],
        ignores: ['**/*.types.ts'],
        rules: {
            'no-restricted-syntax': [
                'error',
                { selector: 'TSInterfaceDeclaration', message: 'Declare named contracts in a types file.' },
                { selector: 'TSTypeAliasDeclaration', message: 'Declare named types in a types file.' },
                { selector: 'TSTypeLiteral', message: 'Extract inline object types into named interfaces.' }
            ]
        }
    },
    {
        files: ['src/pages/**/*.ts', 'src/components/**/*.ts', 'tests/**/*.ts'],
        rules: {
            'no-restricted-properties': ['error', { object: 'process', property: 'env', message: 'Read validated configuration through fixtures.' }]
        }
    },
    {
        files: ['src/**/*.ts'],
        rules: {
            'no-restricted-imports': ['error', { patterns: [{ group: ['**/tests/**'], message: 'src must not depend on test features.' }] }]
        }
    }
]);
