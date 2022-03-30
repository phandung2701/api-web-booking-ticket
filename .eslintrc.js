module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'linebreak-style': 0,
    'comma-dangle': 0,
    'implicit-arrow-linebreak': 0,
    'import/newline-after-import': 0,
    'prefer-destructuring': 0,
    'no-unused-vars': 0,
    'no-control-regex': 'errors'
  }
};
