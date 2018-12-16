process.env.NODE_ENV = 'test';

module.exports = function(wallaby) {
  return {
    files: ['src/**/*.ts?(x)', './jest.config.js', './jest.setup.ts', '!src/**/*.test.ts?(x)'],

    tests: ['src/**/*.test.ts?(x)'],
    environment: {
      type: 'node',
    },

    env: {
      type: 'node',
      runner: 'node',
    },

    testFramework: 'jest',

    debug: true,

    setup: function(wallaby) {
      const jestConfig = require('./jest.config');
      jestConfig.modulePaths = jestConfig.modulePaths.map(p => p.replace('<rootDir>', wallaby.projectCacheDir));
      wallaby.testFramework.configure(jestConfig);
    }
  };
};
