module.exports = function (w) {

  return {
    files: ['src/**/*.ts', 'test/helpers/*.ts'],

    tests: ['test/**/*.test.ts'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};