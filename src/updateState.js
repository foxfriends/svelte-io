import SvelteIO from './SvelteIO';

export default function updateState(transform) {
  return new SvelteIO((driver) => driver.setState(transform(driver.getState())));
}
