/** @type {import('jest').Config} */
const config = {
  preset:          "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "/node_modules",
    "/examples"
]
};

export default config;
