module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'react/prop-types': 'off', 
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'warn',
    'eqeqeq': 'error',
    'curly': 'error'
  },
  settings: {
    react: {
      version: 'detect' 
    }
  },
  globals: {
    test: 'readonly'
  }
};