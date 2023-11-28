<script>
  import { fade } from 'svelte/transition';
  import { store } from '$lib/store.js';

  const logs = store('logs', ['Welcome.']);
  const addLog = (message) => {
    $logs = [...$logs, message];
  };
</script>

<div class="box-border h-full max-h-screen w-full max-w-4xl px-4 py-4">
  <div class="flex h-full gap-4">
    <!-- Left column, log -->
    <div
      class="relative flex h-full w-36 flex-col items-start gap-4 overflow-hidden"
    >
      <div class="flex h-full flex-col-reverse justify-end gap-4" id="log">
        {#each $logs as log}
          <div transition:fade={{ delay: 100, duration: 300 }}>
            <p class="leading-none">{log}</p>
          </div>
        {/each}
      </div>

      <!-- Gradient for vignette effect -->
      <div
        class="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-white to-transparent to-50%"
      ></div>
    </div>

    <!-- Central column, actions -->
    <div class="flex-grow">
      <h1 class="mb-3 underline">Location</h1>

      <!-- Actions (should eventually change based on tab) -->
      <button class="btn" on:click={() => ($logs = [])}>Clear logs</button>
      <button class="btn" on:click={() => addLog($logs.length)}>Add log</button>
    </div>

    <!-- Status -->
    <div></div>
  </div>
</div>

<style lang="postcss">
  :global(html) {
    font-size: 16pt;
  }

  .btn {
    @apply border border-black bg-transparent px-4 py-0.5 hover:underline;
  }
</style>
