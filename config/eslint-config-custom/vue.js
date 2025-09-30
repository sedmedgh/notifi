const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * internal that utilize VueJS.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: ['@vercel/style-guide/eslint/browser', '@vue/eslint-config-typescript'].map(
    require.resolve,
  ),
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['vue'],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
    'import/ignore': ['\\.md$', '\\.md\\?raw$'],
  },
  ignorePatterns: ['node_modules/', 'dist/', '.eslintrc.js'],

  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off',
    'import/no-default-export': 'off',
    'vue/multi-word-component-names': 'off',
    'unicorn/filename-case': 'off',
    'prettier/prettier': ['error', { endOfLine: 'lf' }],
    'no-nested-ternary': 'off',
    'no-multi-assign': 'off',
    // add specific rules configurations here
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    camelcase: [
      'error',
      {
        ignoreImports: true,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.vue', '**/*.ts'],
      rules: {
        'ts/no-non-null-asserted-optional-chain': 'off',
        // 'ts/ban-ts-comment': 'warn',
        'ts/consistent-type-definitions': 'off',
        'ts/no-unsafe-function-type': 'off',
        'ts/no-unused-expressions': 'off',
        'ts/no-empty-object-type': 'off',
        'symbol-description': 'off',
        'no-console': 'off',
        'import/first': 'off',
        'import/order': 'off',
        // 'style/max-statements-per-line': ['error', { max: 2 }],
        'vue/one-component-per-file': 'off',
        'unicorn/prefer-dom-node-text-content': 'off',
        'unicorn/prefer-number-properties': 'off',
        'unused-imports/no-unused-vars': 'off',
        'regexp/no-super-linear-backtracking': 'off',
      },
    },
    /*    {
      files: ['**!/!*.vue'],
      rules: {
        'vue/max-attributes-per-line': [
          'error',
          {
            singleline: 1,
            multiline: 1,
          },
        ],
      },
    },*/
    {
      files: ['*.story.vue'],
      rules: {
        'no-console': 'off',
        'no-alert': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ],
}
