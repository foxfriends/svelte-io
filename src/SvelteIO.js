import { ap, chain, map, of } from 'ramda';

export default class SvelteIO {
  constructor(task) {
    this.task = task;
  }

  static [of](value) {
    return new SvelteIO(async () => value);
  }

  [map](f) {
    return new SvelteIO(async (driver) => {
      const value = await this.task(driver);
      return f(value);
    });
  }

  [ap](b) {
    return new SvelteIO(async (driver) => {
      const value = await this.task(driver);
      const f = await b.task(driver);
      return f(value);
    });
  }

  [chain](f) {
    return new SvelteIO(async (driver) => {
      const value = await this.task(driver);
      const io = await f(value);
      return io.task(driver);
    });
  }
}
