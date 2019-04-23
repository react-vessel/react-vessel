module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/index.ts', '!**/node_modules/**'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
