import SvelteIO from './SvelteIO.js';

export default function getContext(key) {
  return new SvelteIO((driver) => driver.getContext(key));
}
