/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "transform": {
    "^.+\\.css$": "jest-transform-css",
    '^.+\\.tsx?$': 'ts-jest',
  }
};