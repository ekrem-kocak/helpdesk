import nx from '@nx/eslint-plugin';

export default [
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/out-tsc',
      '**/.nx',
      '**/.git',
      'coverage',
    ],
  },

  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // 3. ARCHITECTURE & MODULE BOUNDARIES
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            // rules 1: apps can only depend on libs
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:lib', 'type:ui', 'type:util'],
            },
            // rules 2: shared libraries can depend on other libraries
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: ['type:lib', 'type:ui', 'type:util'],
            },
            // default: if no tag is provided, allow access to all libraries
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  // global best practices & overrides
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      // prevent console.log in production code (warn)
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // show unused variables as errors
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
];
