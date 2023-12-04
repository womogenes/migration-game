<script>
  import { fade, fly } from 'svelte/transition';
  import { derived, writable } from 'svelte/store';

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
{#if $curModal}
  <div
    class="absolute z-20 flex h-full w-full items-center justify-center bg-neutral-900 bg-opacity-50"
    transition:fade
  >
    <div class="flex w-full max-w-sm flex-col gap-4 border bg-white px-6 py-4">
      <h1>{$curModal.title}</h1>
      <div class="flex gap-4">
        {#each $curModal.actions as action}
          <button
            class="btn"
            on:click={() => {
              action.action();
              $curModal = null;
            }}>{action.label}</button
          >
        {/each}
      </div>
    </div>
  </div>
{/if}

<!-- Main content -->
<div class="relative flex w-full max-w-5xl flex-col px-6 pb-3 pt-6">
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
    <div class="flex-grow select-none overflow-x-hidden sm:px-4">
      <!-- Headings (tabs) -->
      <div class="mb-4 flex divide-x" id="tabs">
        <button
          class="pr-3 leading-none {$activeTab === 0 && 'underline'}"
          on:click={() => ($activeTab = 0)}>Tab name</button
        >
      </div>

      <!-- Content (three panels) -->
      <div class="relative flex w-full">
        <p>Hi there</p>
      </div>
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
