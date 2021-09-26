import test from 'ava';
import render from './render.js';


test('should call render from the driver with the provided Component and props', async t => {
  t.plan(2);
  class ExpectedComponent {}
  const expectedProps = { prop: true };
  const driver = {
    render: (Component, props) => {
      t.is(Component, ExpectedComponent);
      t.is(props, expectedProps);
    },
  };
  return render(ExpectedComponent, expectedProps).task(driver);
});

test('should call render from the driver with the provided Component and default props', async t => {
  t.plan(2);
  class ExpectedComponent {}
  const driver = {
    render: (Component, props) => {
      t.is(Component, ExpectedComponent);
      t.deepEqual(props, {});
    },
  };
  return render(ExpectedComponent).task(driver);
});

test('should return the result of render', async t => {
  const expectedResult = Symbol('Out');
  const driver = {
    render: () => expectedResult,
  };
  t.is(await render(class {}).task(driver), expectedResult);
});
