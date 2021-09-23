import SvelteIO from './SvelteIO';

export default function getContext(key) {
  return new SvelteIO((driver) => driver.getContext(key));
}
