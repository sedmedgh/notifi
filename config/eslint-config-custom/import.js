/*
 * This is a custom ESLint configuration for use with
 * internal that utilize for Un used Import.
 *
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    'import/ignore': ['\\.md$', '\\.md\\?raw$'],
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'unused-imports'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    'unused-imports/no-unused-imports': 'error',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: false,
      },
    ],
    'prettier/prettier': ['error', { endOfLine: 'lf' }],
    'no-nested-ternary': 'off',
    'no-multi-assign': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    camelcase: [
      'error',
      {
        ignoreImports: true,
      },
    ],
  },
}
