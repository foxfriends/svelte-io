import SvelteIO from './SvelteIO.js';

export default function dispatch(event, detail) {
  return new SvelteIO((driver) => driver.dispatch(event, detail));
}
