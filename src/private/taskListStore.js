import { writable } from 'svelte/store';

export function taskList(initial = []) {
  const store = writable(initial);

  const add = task => store.update(ts => [...ts, task]);
  const remove = task => store.update(ts => ts.filter(t => t === task));

  return {
    subscribe: store.subscribe,
    add,
    remove,
  };
}
