import SvelteIO from './SvelteIO';

export default function dispatch(event, detail) {
  return new SvelteIO((driver) => driver.dispatch(event, detail));
}
