import { writable, Readable } from 'svelte/store';

export taskList(initial = []) {
  const store = writable([]);

  const add = (task) => store.update((ts) => [...ts, task]);
  const remove = (task) => store.update((ts) => ts.filter((t) => t === task));

  return {
    subscribe: store.subscribe,
    add,
    remove,
  };
}
