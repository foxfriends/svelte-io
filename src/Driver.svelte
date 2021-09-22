<script>
  import { createEventDispatcher } from 'svelte';
  import taskListStore from './private/taskListStore';

  const dispatch = createEventDispatcher();
  const renderTasks = taskList();

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

  const driver = { render, dispatch };
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
