const { createConfig } = require('eslint-config-galex/src/createConfig');
const {
  createTSOverride,
} = require('eslint-config-galex/src/overrides/typescript');
const { resolve } = require('path');

const packageJson = require('./package.json');

const tsOverride = createTSOverride({
  react: {
    hasReact: true,
  },
  typescript: {
    hasTypeScript: true,
    version: packageJson.devDependencies.typescript,
    config: resolve(__dirname, './tsconfig.json'),
  },
  rules: {
    'import/no-default-export': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
  },
});

module.exports = createConfig({
  overrides: [tsOverride],
});
