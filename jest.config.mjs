// SPDX-FileCopyrightText: Estonian Information System Authority
// SPDX-License-Identifier: MIT

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
