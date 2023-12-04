<script>
  import { fade, fly } from 'svelte/transition';
  import { derived, writable } from 'svelte/store';

  import { store } from '$lib/store.js';
  import { onMount } from 'svelte';
  import Modal from '$lib/components/modal.svelte';
  import Logs from '$lib/components/Logs.svelte';

  // Utilities
  Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  // Game tick
  // Prevent setInterval from running twice with Svelte hot-reloading
  const startTime = store('start-time', new Date().getTime());
  const gameDays = store('game-days', 0);
  onMount(() => {
    const tickInterval = window.setInterval(() => {
      $gameDays += 0.1;
      onTick();
    }, 1000);
    return () => window.clearInterval(tickInterval);
  });
  $: gameDate = new Date($startTime + $gameDays * (1000 * 60 * 60 * 24));

  // Things to do every game loop
  const onTick = () => {};

  // Funds
  const funds = store('funds', {
    amount: Math.random() * 1000 + 6000,
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
  const logs = store('logs', ['Welcome.']);
  const addLog = (message) => ($logs = [...$logs, message]);

  // Import things from js file

  // Modal actions
  const curModal = store('cur-modal', null);
</script>

<!-- Modal -->
<Modal {curModal} />

<!-- Main content -->
<div class="relative flex w-full max-w-5xl flex-col px-6 py-4">
  <div class="flex h-full flex-col gap-4 sm:flex-row">
    <!-- Left column, log -->
    <Logs {logs} />

    <!-- Central column, actions -->
    <div class="flex flex-grow select-none flex-col items-start gap-2">
      <div>
        <b>Work</b>
        <hr />
        <p>Occupation: security guard</p>
        <p>Status: parental leave (10/12 weeks)</p>
        <p>
          <span>Income sources:</span>
        </p>
        <ol class="list-decimal pl-6">
          <li>Parental leave (1500 GEL/month)</li>
        </ol>
      </div>
    </div>

    <!-- Status column -->
    <div class="flex select-none flex-col gap-2 leading-none md:w-80">
      <p>
        <b>Date:</b>
        {gameDate.toLocaleDateString('en-us', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
        ({gameDate.toLocaleDateString('en-us', { weekday: 'long' })})
      </p>
      <p><b>Location:</b> Tbilisi, Georgia</p>
      <p>
        <b>Savings:</b>
        <span class="tabular-nums">{formattedFunds}</span>
      </p>
    </div>
  </div>

  <div class="flex items-center gap-4 self-end">
    <p>Game days: {$gameDays.toFixed(2)}</p>
    <button
      class="btn"
      on:click={() => {
        localStorage.clear();
        window.location.reload();
      }}>Reset game</button
    >
  </div>
</div>

<style>
  hr {
    @apply mb-1;
  }
</style>
