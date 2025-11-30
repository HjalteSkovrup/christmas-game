export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  extensionsToTreatAsEsm: ['.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/**',
    '!src/server.js'
  ],
  testTimeout: 10000,
  verbose: true
};
