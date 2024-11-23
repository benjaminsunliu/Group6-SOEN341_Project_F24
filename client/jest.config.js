module.exports = {

 moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios|js-cookie|jwt-decode)',
    ],
    testEnvironment: 'jsdom', // Set jsdom environment
  };
  
