module.exports = {
  testMatch: [
    "../**/__tests__/**/*.cjs",
    "**/?(*.)+(spec|test).cjs"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/playwright/"
  ]
};