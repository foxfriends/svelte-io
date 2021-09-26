import test from 'ava';
import { chain, map, ap, of } from 'fantasy-land';
import SvelteIO from './SvelteIO.js';

const run = (io) => io.task({});

test('SvelteIO[of]', async t => {
  t.is(await run(SvelteIO[of](3)), 3);
});

test('SvelteIO[map]', async t => {
  t.is(await run(SvelteIO[of](3)[map]((x) => x * 2)), 6);
});

test('SvelteIO[ap]', async t => {
  t.is(await run(SvelteIO[of](3)[ap](SvelteIO[of]((x) => x * 2))), 6);
});

test('SvelteIO[chain]', async t => {
  t.is(await run(SvelteIO[of](3)[chain]((x) => SvelteIO[of](x * 2))), 6);
});

test('monad law: left identity', async t => {
  const func = (value) => new SvelteIO(() => value * 2);
  const value = 3;
  t.is(
    await run(SvelteIO[of](value)[chain](func)),
    await run(func(value)),
  );
})

test('monad law: right identity', async t => {
  const value = 3;
  t.is(
    await run(SvelteIO[of](value)[chain](SvelteIO[of])),
    await run(SvelteIO[of](value)),
  );
});

test('monad law: associativity', async t => {
  const value = 5;
  const m = SvelteIO[of](value);
  const g = (x) => SvelteIO[of](x * 2);
  const h = (x) => SvelteIO[of](x * 3);
  t.is(
    await run(m[chain](g)[chain](h)),
    await run(m[chain]((x) => g(x)[chain](h))),
  );
});
