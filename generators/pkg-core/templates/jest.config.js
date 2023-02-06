/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  rootDir: "src",
  moduleNameMapper: {
    "@/lib/(.*)": "<rootDir>/lib/$1",
    "@/models/(.*)": "<rootDir>/models/$1",
    "@/endpoints/(.*)": "<rootDir>/endpoints/$1",
    "@/tasks/(.*)": "<rootDir>/tasks/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/lib/test-utils/setup-tests"],
};
