<script>
  export let logs;

  import { fade } from 'svelte/transition';
</script>

<div
  class="relative flex h-full select-none flex-col gap-4 overflow-hidden sm:w-48"
>
  <div class="flex flex-col-reverse justify-end gap-3 sm:h-full" id="log">
    {#each $logs as log}
      <div transition:fade={{ delay: 150, duration: 500 }}>
        {#if log.message}
          <p class="leading-tight">{log.message}</p>
        {:else}
          <p class="leading-tight">{log}</p>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Gradient for vignette effect -->
  <div
    class="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-white to-transparent to-50% dark:from-neutral-900"
  ></div>
</div>
