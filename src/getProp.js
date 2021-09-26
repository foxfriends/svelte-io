import SvelteIO from './SvelteIO.js';

export default function getProp(prop) {
  return new SvelteIO((driver) => driver.getProp(prop));
}
