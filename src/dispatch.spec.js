import test from 'ava';
import dispatch from './dispatch.js';

test('should call dispatch from the driver with the provided event and detail', async t => {
  t.plan(2);
  const expectedEvent = 'event';
  const expectedDetail = { value: true };
  const driver = {
    dispatch: (event, detail) => {
      t.is(event, expectedEvent);
      t.is(detail, expectedDetail);
    },
  };
  await dispatch(expectedEvent, expectedDetail).task(driver);
});

test('should call dispatch from the driver with the provided event and no detail', async t => {
  t.plan(2);
  const expectedEvent = 'event';
  const driver = {
    dispatch: (event, detail) => {
      t.is(event, expectedEvent);
      t.is(detail, undefined);
    },
  };
  await dispatch(expectedEvent).task(driver);
});

test('should return undefined', async t => {
  const driver = {
    dispatch: () => 'Not Undefined',
  };
  t.is(await dispatch('event').task(driver), undefined);
});
