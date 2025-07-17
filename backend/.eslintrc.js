module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin', // Plugin for TypeScript support
    'prettier', // Prettier integration
    'unused-imports', // Remove unused imports and variables
    'import', // Plugin for import sorting
  ],
  extends: [
    'eslint:recommended', // Basic rules from ESLint
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:prettier/recommended', // Combine Prettier with ESLint
    'prettier', // Use Prettier to override ESLint in formatting
  ],
  root: true, // Mark this as the root configuration
  env: {
    node: true, // Node.js environment configuration
    jest: true, // Jest environment configuration
  },
  ignorePatterns: ['.eslintrc.js', 'src/main.ts', 'pnpm-lock.yaml'], // Ignore linting for .eslintrc.js and src/main.ts
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error', // Require function return type definition
    '@typescript-eslint/explicit-module-boundary-types': 'error', // Require explicit types for module boundaries
    '@typescript-eslint/no-explicit-any': 'error', // Prohibit using 'any' type

    // Prettier rules
    'prettier/prettier': 'error', // Error if code doesn't follow Prettier formatting

    // unused-imports rules
    'unused-imports/no-unused-imports': 'error', // Remove unnecessary imports
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all', // Check all variables
        varsIgnorePattern: '^_', // Ignore variables starting with '_'
        args: 'after-used', // Check parameters after the last used parameter
        argsIgnorePattern: '^_', // Ignore parameters starting with '_'
        ignoreRestSiblings: true,
      },
    ],

    // Console control rules
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'], // Only allow console.warn and console.error
      },
    ],

    // Interface naming convention rules
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],

    // Import sorting rules
    'import/order': [
      'error',
      {
        "warnOnUnassignedImports": true,
        'newlines-between': 'always', // Insert blank line between import groups
        groups: [
          'builtin',
          'external',
          'internal', // Internal modules (files within project)
          'index',
          'parent',
          'sibling', // Parent, sibling, or index modules
          ['type', 'object']

        ],
        pathGroups: [
          {
            pattern: '@nestjs/**', // Ensure NestJS modules are always imported first
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '**/*.repository', // Ensure repository modules are prioritized
            group: 'internal',
            position: 'before',
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Other rules
    semi: ['error', 'always'], // Require semicolons
  },
};
