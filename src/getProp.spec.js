import test from 'ava';
import getProp from './getProp.js';

test('should call getProp from the driver with the provided prop name', async t => {
  t.plan(1);
  const expectedProp = 'propname';
  const driver = {
    getProp: prop => t.is(prop, expectedProp),
  };
  await getProp(expectedProp).task(driver);
});

test('should return the result of getProp', async t => {
  const expectedResult = Symbol('Out');
  const driver = {
    getProp: () => expectedResult,
  };
  t.is(await getProp('prop').task(driver), expectedResult);
});
