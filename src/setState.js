import SvelteIO from './SvelteIO';

export default function setState(newState) {
  return new SvelteIO((driver) => driver.setState(newState));
}
