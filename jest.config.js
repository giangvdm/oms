export default {
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testEnvironment: 'node',
    testMatch: ['**/server/tests/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: [
      'server/**/*.js',
      '!server/tests/**/*.js',
      '!server/config/**/*.js',
    ],
  };