/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-declaration-strict-value'],
  ignoreFiles: ['public/legacy/**', 'dist/**', 'coverage/**'],
  rules: {
    // Colors and spacing come from tokens.css only.
    'scale-unlimited/declaration-strict-value': [
      ['/color$/', 'fill', 'stroke', 'background', '/^margin/', '/^padding/', '/gap$/', 'inset'],
      {
        ignoreValues: [
          '0',
          'auto',
          'inherit',
          'initial',
          'unset',
          'none',
          'transparent',
          'currentcolor',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/styles/tokens.css'],
      rules: { 'scale-unlimited/declaration-strict-value': null },
    },
  ],
};
