import SvelteIO from './SvelteIO';

export default function render(Component, props = {}) {
  return new SvelteIO((driver) => driver.render(Component, props));
}
