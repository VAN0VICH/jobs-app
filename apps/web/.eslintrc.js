module.exports = {
  root: true,
  extends: ['custom/next'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    'no-nested-ternary': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/naming-convention': 'off',
  },
};
