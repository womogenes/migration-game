<script>
  import { fade, fly } from 'svelte/transition';
  import { derived, writable } from 'svelte/store';

  import allLocData from '$lib/locations.json';
  import { store } from '$lib/store.js';
  import { onMount } from 'svelte';

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
    if ($gameTick % 100 === 50) {
      $logs = [...$logs, $locData.ambientMessages.sample()];
    }
  };

  // Choose a random location to start at
  const locID = store('location', 'seattle-usa');
  const locData = derived(locID, ($locID) =>
    allLocData.find((locObj) => locObj.id === $locID),
  );

  // Funds
  const funds = store('funds', { amount: 0, currency: 'USD' });

  // Log messages in left sidebar
  const logs = store('logs', [`Welcome to ${$locData.location.city}.`]);
  const addLog = (message) => {
    $logs = [...$logs, message];
  };

  const status = store('status', 'alive');

  // UI state things
  let activeTab = store('active-tab', 'city'); // Can be 'main' or 'portals'

  // Purely cosmetic things
  let soundOn = writable(false);
  let audioEls;
  const initializeAudio = () => {
    audioEls = Array.from(document.querySelectorAll('audio'));
    audioEls.forEach((audioEl) => (audioEl.volume = 0.1));
    soundOn.subscribe(($soundOn) => {
      if ($soundOn) {
        // Play all the sounds
        audioEls.forEach((audioEl) => audioEl.play());
      } else {
        audioEls.forEach((audioEl) => audioEl.pause());
      }
    });
  };
  onMount(initializeAudio);
</script>

<!-- Let's add some sound effects :) -->
{#each $locData.sounds as sound}
  <audio loop>
    <source src={sound.url} />
  </audio>
{/each}

<!-- Main content -->
<div class="flex w-full max-w-5xl flex-col px-6 pb-3 pt-6">
  <div class="flex h-full flex-col gap-4 sm:flex-row">
    <!-- Left column, log -->
    <div
      class="relative flex max-h-[calc(100vh-5em)] select-none flex-col items-start gap-4 overflow-hidden sm:w-48"
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

    <!-- Central column, actions -->
    <div class="flex-grow overflow-x-hidden px-4">
      <!-- Headings (tabs) -->
      <div class="mb-4 flex divide-x" id="tabs">
        <button
          class="pr-3 leading-none {$activeTab === 'city' && 'underline'}"
          on:click={() => ($activeTab = 'city')}
          >{$locData.location.city}</button
        >
        <button
          class="pl-3 pr-3 leading-none {$activeTab === 'portals' &&
            'underline'}"
          on:click={() => ($activeTab = 'portals')}>Portals</button
        >
      </div>

      <!-- Content (three panels) -->
      <div class="relative flex w-full">
        {#if $activeTab === 'city'}
          <div
            class="absolute flex w-full flex-col items-start gap-2"
            in:fly={{ x: '-100%' }}
            out:fly={{ x: '100%' }}
          >
            <button
              class="btn"
              on:click={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Clear localStorage
            </button>
            <button
              class="btn"
              on:click={() => addLog($locData.ambientMessages.sample())}
            >
              Add log
            </button>
            <button class="btn" on:click={() => ($logs = [])}>Clear logs</button
            >
          </div>
        {:else if $activeTab === 'portals'}
          <div
            class="absolute flex w-full flex-col items-start gap-2"
            in:fly={{ x: '-100%' }}
            out:fly={{ x: '100%' }}
          >
            <button>Content</button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Status column -->
    <div class="flex w-80 flex-col gap-2 leading-none">
      <p>Game tick: {$gameTick}</p>
      <div class="flex flex-col gap-2 border px-2 py-2">
        <p>Location: {$locData.location.city}, {$locData.location.country}</p>
        <p>Status: {$status}</p>
        <p>Funds: {$funds.amount} {$funds.currency}</p>
      </div>
    </div>
  </div>

  <!-- Game settings/controls -->
  <div class="self-end text-neutral-700 dark:text-neutral-400">
    <button class="hover:underline" on:click={() => ($soundOn = !$soundOn)}>
      sound {$soundOn ? 'on' : 'off'}.
    </button>
  </div>
</div>

<style lang="css">
  .btn {
    @apply select-none; /* Disallow selecting button text */
    @apply border bg-transparent px-4 py-0.5 hover:underline;
  }

  h1 {
    @apply text-lg;
  }

  :global(html) {
    font-size: 16pt;
  }
</style>
