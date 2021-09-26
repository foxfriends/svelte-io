import SvelteIO from './SvelteIO.js';

export default function render(Component, props = {}) {
  return new SvelteIO((driver) => driver.render(Component, props));
}
