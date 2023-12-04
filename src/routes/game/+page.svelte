<script>
  import { fade, fly } from 'svelte/transition';
  import { derived, writable } from 'svelte/store';

  import { store } from '$lib/store.js';
  import { onMount } from 'svelte';
  import Modal from '../../lib/components/Modal.svelte';

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
      onTick();
    }, 100);

    return () => window.clearInterval(tickInterval);
  });

  // Things to do every game loop
  const onTick = () => {
    $funds.amount *= 1.001;
  };

  // Funds
  const funds = store('funds', {
    amount: 1,
    currency: 'GEL',
  });
  $: moneyFormatter = new Intl.NumberFormat('ka-GE', {
    style: 'currency',
    currency: $funds.currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  $: formattedFunds = moneyFormatter.format($funds.amount);

  // Log messages in left sidebar
  const logs = store('logs', ['Welcome']);
  const addLog = (message) => {
    $logs = [...$logs, message];
  };
  const status = store('status', 'alive');

  // Modal actions
  const curModal = store('cur-modal', null);

  // UI state things
  let activeTab = store('active-tab', 0); // Can be 'main' or 'portals'
</script>

<!-- Modal -->
<Modal {curModal} />

<!-- Main content -->
<div class="relative flex w-full max-w-5xl flex-col px-6 py-6">
  <div class="flex h-full flex-col gap-4 sm:flex-row">
    <!-- Left column, log -->
    <div
      class="relative flex select-none flex-col gap-4 overflow-hidden sm:h-auto sm:w-48"
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
    <div class="flex flex-grow select-none flex-col items-start gap-2">
      <p>Hi there</p>
      <button
        class="btn"
        on:click={() => {
          $curModal = {
            title: 'Modal title',
            actions: [{ label: 'okay', action: () => {} }],
          };
        }}>Open modal</button
      >
    </div>

    <!-- Status column -->
    <div class="flex select-none flex-col gap-2 leading-none md:w-80">
      <p>Game tick: {$gameTick}</p>
      <div class="flex flex-col gap-2 border px-2 py-2">
        <p>Location: Tbilisi, Georgia</p>
        <p>Status: {$status}</p>
        <p>
          Funds:
          <span class="tabular-nums">{formattedFunds}</span>
        </p>
      </div>
    </div>
  </div>
</div>
