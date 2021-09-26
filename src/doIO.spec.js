import test from 'ava';
import { of } from 'fantasy-land';
import doIO from './doIO.js';
import SvelteIO from './SvelteIO.js';

test('should work when the same doIO is run multiple times', async t => {
  t.plan(2);
  // eslint-disable-next-line require-yield
  const io = doIO(async function * () {
    t.pass();
  });
  await io.task({});
  await io.task({});
});

test('should run each of the yielded SvelteIOs', async t => {
  t.plan(2);
  const first = new SvelteIO(() => t.pass());
  const second = new SvelteIO(() => t.pass());
  const io = doIO(async function * () {
    yield first;
    yield second;
  });
  await io.task({});
});

test('should each yielded SvelteIO on the same driver', async t => {
  t.plan(2);
  const expectedDriver = {};
  const first = new SvelteIO(driver => t.is(driver, expectedDriver));
  const second = new SvelteIO(driver => t.is(driver, expectedDriver));
  const io = doIO(async function * () {
    yield first;
    yield second;
  });
  await io.task(expectedDriver);
});

test('should provide the value of a yielded SvelteIO', async t => {
  t.plan(1);
  const expectedValue = 3;
  const inner = SvelteIO[of](expectedValue);
  const io = doIO(async function * () {
    t.is(yield inner, expectedValue);
  });
  await io.task({});
});

test('should return the return value of the passed generator when run', async t => {
  const expectedResult = 'Return Value';
  // eslint-disable-next-line require-yield
  const io = doIO(async function * () {
    return expectedResult;
  });
  t.is(await io.task({}), expectedResult);
});

test('should not start the generator if it has not been run', t => {
  t.plan(0);
  // eslint-disable-next-line require-yield
  doIO(async function * () {
    t.fail();
  });
});
