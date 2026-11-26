export default {
  '*.{ts,js}': [
    'eslint --fix --max-warnings=0',
    'prettier --write',
    'cspell --no-must-find-files --no-progress',
  ],
  '*.css': ['stylelint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml,html}': ['prettier --write'],
  '*.md': ['cspell --no-must-find-files --no-progress'],
};
