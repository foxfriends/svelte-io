import SvelteIO from './SvelteIO';

export default function getProp(prop) {
  return new SvelteIO((driver) => driver.getProp(prop));
}
