import { createEventDispatcher } from 'svelte';
import Cancel from './Cancel.js';

export default function useSvelteIO() {
  const { dispatch } = createEventDispatcher();

  function next(value) {
    dispatch('next', value);
  }

  function cancel() {
    dispatch('abort', new Cancel());
  }

  function abort(error) {
    dispatch('abort', error);
  }

  return { next, cancel, abort };
}
