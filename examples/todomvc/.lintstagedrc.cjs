const baseConfig = require('../../.lintstagedrc.cjs');

module.exports = {
  ...baseConfig,
  '*.{js,cjs,mjs,ts,tsx}': ['eslint --cache --fix', 'prettier --write'],
  '*.css': ['prettier --write'],
};
