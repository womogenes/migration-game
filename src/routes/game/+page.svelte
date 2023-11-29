<script>
  import { fade } from 'svelte/transition';
  import { derived } from 'svelte/store';

  import allLocData from '$lib/locations.json';
  import { store } from '$lib/store.js';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Utilities
  Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  // Game tick
  // Prevent setInterval from running twice with Svelte hot-reloading
  const gameTick = store('game-tick', 0);
  onMount(() => {
    const tickInterval = window.setInterval(() => {
      $gameTick++;
      everyTick();
    }, 100);

    return () => window.clearInterval(tickInterval);
  });

  // Things to do every game loop
  const everyTick = () => {
    if ($gameTick % 60 === 1) {
      $logs = [...$logs, $locData.ambientMessages.sample()];
    }
  };

  // Choose a random location to start at
  const locID = store('location', 'seattle-usa');
  const locData = derived(locID, ($locID) =>
    allLocData.find((locObj) => locObj.id === $locID),
  );

  // Log messages in left sidebar
  const logs = store('logs', [`Welcome to ${$locData.location.city}.`]);
  const addLog = (message) => {
    $logs = [...$logs, message];
  };

  const status = store('status', 'alive');

  // Redirect user to different page + replace route so it isn't added to browser history
  function routeToPage(route, replaceState) {
    goto(`/${route}`, { replaceState }) 
  }

</script>

<div class="box-border h-full max-h-screen w-full max-w-5xl px-6 py-6">
  <div class="flex h-full gap-8">
    <!-- Left column, log -->
    <div
      class="relative flex h-full w-48 select-none flex-col items-start gap-4 overflow-hidden"
    >
      <div class="flex h-full flex-col-reverse justify-end gap-3" id="log">
        {#each $logs as log}
          <div transition:fade={{ duration: 500 }}>
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
        class="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-white to-transparent to-50%"
      ></div>
    </div>

    <!-- Central column, actions -->
    <div class="flex-grow">
      <h1 class="mb-3 underline">{$locData.location.city}</h1>

      <div class="flex flex-col items-start gap-2">
        <button
          class="btn"
          on:click={() => {
            localStorage.clear();
            window.location.reload(); 
          }}
          on:click={() => routeToPage('', true)}
        >
          Clear localStorage
        </button>
        <button
          class="btn"
          on:click={() => addLog($locData.ambientMessages.sample())}
        >
          Add log
        </button>
        <button class="btn" on:click={() => ($logs = [])}>Clear logs</button>
      </div>
    </div>

    <!-- Status column -->
    <div class="flex w-80 flex-col gap-2 leading-none">
      <p>Game tick: {$gameTick}</p>
      <div class="flex flex-col gap-2 border border-black px-2 py-2">
        <p>Status: {$status}</p>
        <p>Location: {$locData.location.city}, {$locData.location.country}</p>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .btn {
    @apply select-none; /* Disallow selecting button text */
    @apply border border-black bg-transparent px-4 py-0.5 hover:underline;
  }

  h1 {
    @apply text-lg;
  }
</style>
