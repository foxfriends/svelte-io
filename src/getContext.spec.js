import test from 'ava';
import getContext from './getContext.js';

test('should call getContext from the driver', t => {
  t.plan(1);
  const expectedKey = Symbol();
  const io = getContext(expectedKey);
  const driver = { getContext: (key) => t.is(key, expectedKey) };
  io.task(driver);
});
