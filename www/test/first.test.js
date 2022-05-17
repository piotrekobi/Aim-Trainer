const testFunc = require('../first');

test('proof of concept test', () => {
  expect(testFunc()).toBe(true);
});