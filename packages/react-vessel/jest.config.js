module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/test/**/*.[jt]s?(x)',
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/index.ts', '!**/node_modules/**'],
  testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/node_modules/', '<rootDir>/test/utils/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
