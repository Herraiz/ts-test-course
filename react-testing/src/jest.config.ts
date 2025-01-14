import type { Config } from "@jest/types";

const baseDir = "<rootDir>/src/";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,

  collectCoverage: true,
  collectCoverageFrom: [`${baseDir}/**/*.ts`, `${baseDir}/**/*.tsx`],
  forceCoverageMatch: [`${baseDir}/**/*.ts`, `${baseDir}/**/*.tsx`],

  testMatch: [`${baseDir}//**/*.test.ts`, `${baseDir}//**/*.test.tsx`],

  // We can use this to inject environment variables
  //   setupFiles: ["<rootDir>/src/test/server_app_integration/utils/config.ts"],
};

export default config;
