module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest to transform JS and JSX files
  },
  // Make sure certain modules are transformed, even though they're in node_modules
  transformIgnorePatterns: [
    '/node_modules/(?!axios|js-cookie|jwt-decode)', // Transform these specific node_modules
  ],
  testEnvironment: 'jsdom', // Set the environment to jsdom (for simulating browser)
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy', // Mock CSS imports using identity-obj-proxy
  },
 
};
