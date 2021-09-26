import { of, chain } from 'fantasy-land';
import SvelteIO from './SvelteIO.js';

export default function doIO(generator) {
  const next = (iter) => async (input) => {
    const { done, value } = await iter.next(input);
    if (done) { return SvelteIO[of](value); }
    return value[chain](next(iter));
  };
  return SvelteIO[of](undefined)[chain](() => next(generator(), undefined));
}
