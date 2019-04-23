module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/index.ts', '!**/node_modules/**'],
  testPathIgnorePatterns: [
    '<rootDir>/lib/',
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/utils/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
