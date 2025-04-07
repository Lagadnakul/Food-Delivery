import process from 'process';
import module from 'module';
// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true // This enables Node.js globals
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
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    plugins: [
      'react',
      'react-hooks'
    ],
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // Common React rules
      'react/prop-types': 'off', // Disable prop-types as you might be using TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // General rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    },
    // Allow some globals that you might use in your project
    globals: {
      process: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly'
    }
  };