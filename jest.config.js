module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "node_modules/?!(aws-amplify-angular|aws-amplify|@aws-amplify)"
  ]
};
