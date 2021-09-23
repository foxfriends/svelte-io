import SvelteIO from './SvelteIO';

export default function getState() {
  return new SvelteIO((driver) => driver.getState());
}
