<script>
  import { createEventDispatcher, getAllContexts } from 'svelte';
  import taskListStore from './private/taskListStore';

  export let state = {};

  const dispatch = createEventDispatcher();
  const renderTasks = taskList();
  const allContexts = getAllContexts();

  async function render(Component, props) {
    const task = { Component, props };
    const result = await new Promise((resolve, reject) => {
      task.resolve = resolve;
      task.reject = reject;
      renderTasks.add(task);
    });
    renderTasks.remove(task);
    return result;
  }

  function getContext(key) {
    return allContexts.get(key)
  }

  function getState() { return state; }
  function setState(newState) { state = newState; }

  const driver = {
    render,
    dispatch,
    getContext,
    getState,
    setState,
  };

  export const runOrDefault = (io, fallback) => io
    .task(driver)
    .catch((error) => {
      if (error instanceof Cancel) { return fallback; }
      throw error;
    });
  export const run = (io) => runOrDefault(io);
</script>

{#each $renderTasks as task (task)}
  <svelte:component
    this={task.Component}
    {...task.props}
    on:next={({ detail }) => task.resolve(detail)}
    on:cancel={() => task.reject(new Cancel)} />
{/each}
