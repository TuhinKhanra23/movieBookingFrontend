// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  coveragePathIgnorePatterns: [
    "<rootDir>/src/App.js",
    "<rootDir>/src/index.js",
    "<rootDir>/src/reportWebVitals.js",
    "<rootDir>/src/services/mocks/",
    "<rootDir>/src/services/mocks/user-service.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/src/index.js", // ignore this file
    "!**/src/App.js" ,
    "!**/src/reportWebVitals.js",
    "!**/src/services/mocks/",
    "!**/src/services/mocks/user-service.js",
  ],
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.js",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)"],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
