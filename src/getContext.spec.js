import test from 'ava';
import getContext from './getContext.js';

test('should call getContext from the driver with the provided key', async t => {
  t.plan(1);
  const expectedKey = Symbol('In');
  const driver = {
    getContext: key => t.is(key, expectedKey),
  };
  await getContext(expectedKey).task(driver);
});

test('should return the result of getContext', async t => {
  const expectedResult = Symbol('Out');
  const driver = {
    getContext: () => expectedResult,
  };
  t.is(await getContext('key').task(driver), expectedResult);
});
