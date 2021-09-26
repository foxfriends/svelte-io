import SvelteIO from './SvelteIO.js';

export default function dispatch(event, detail) {
  return new SvelteIO(async (driver) => { await driver.dispatch(event, detail) });
}
