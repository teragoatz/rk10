module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    extraFileExtensions: ['.webp', '.sql'],
  },
  plugins: ['import', 'json'],
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    // 'plugin:json/recommended',
    // 'plugin:prettier/recommended',
  ],
  rules: {
    'json/*': ['error', 'allowComments'],
    'no-unused-vars': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'only-multiline'],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    quotes: [2, 'single', { avoidEscape: true }],
    '@typescript-eslint/no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used', 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-interface': ["error", { "allowSingleExtends": true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-unresolved': 'error',
    'react/no-unescaped-entities': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
    },
    // 'import/resolver': {
    //   typescript: {
    //     project: ['./packages/*/tsconfig.json'],
    //     extensions: ['.ts', '.tsx', '.js', '.jsx'],
    //   },
    //   node: {
    //     extensions: ['.ts', '.tsx', '.js', '.jsx'],
    //     paths: ['src'],
    //   },
    // },
    react: {
      version: 'detect',
    },
  },
};
