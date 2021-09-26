<script>
  import { createEventDispatcher, getAllContexts } from 'svelte';
  import taskListStore from './private/taskListStore.js';
  import Cancel from './Cancel.js';

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

  function getProp(prop) { return $$props[prop]; }

  const driver = {
    render,
    dispatch,
    getContext,
    getProp,
  };

  export function run(io) { return io.task(driver); }

  export function runOrDefault(io, fallback) {
    return run(io).catch((error) => {
      if (error instanceof Cancel) { return fallback; }
      throw error;
    });
  }
</script>

{#each $renderTasks as task (task)}
  <svelte:component
    this={task.Component}
    {...task.props}
    on:next={({ detail }) => task.resolve(detail)}
    on:abort={({ detail }) => task.reject(detail)} />
{/each}
