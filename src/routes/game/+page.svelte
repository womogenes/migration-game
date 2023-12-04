<script>
  import { fade, fly } from 'svelte/transition';
  import { derived, writable } from 'svelte/store';

  import { store } from '$lib/store.js';
  import { onMount } from 'svelte';
  import Modal from '$lib/components/modal.svelte';
  import Logs from '$lib/components/Logs.svelte';
  import Button from '../../lib/components/Button.svelte';

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
      $gameDays += 1 / 12;
      onTick();
    }, 1000);
    return () => window.clearInterval(tickInterval);
  });
  $: gameDate = new Date($startTime + $gameDays * (1000 * 60 * 60 * 24));

  // Child things
  $: childAge = $gameDays / 365 + 0.5;
  const childStatus = store('child-status', 1);

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

  // Things to do every game loop
  const onTick = () => {
    // Child gets hungry?
    if (Math.random() < 0.3) {
      $childStatus += (Math.random() - 0.8) * 0.1;
      $childStatus = Math.min(1, Math.max($childStatus, 0));
    }
  };

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
    <div
      class="flex flex-grow select-none flex-col items-start gap-4 leading-snug"
    >
      <!-- WORK -->
      <div class="flex flex-col items-start">
        <b>Work</b>
        <hr />
        <p><b>Occupation:</b> security guard</p>
        <p><b>Status:</b> Paid parental leave (week 1 of 12)</p>
        <Button class="py-2" disabled tabindex="0">
          Return to work
          <div slot="tooltip">
            You can't return to work right now because you need to take care of
            your child full-time.
          </div>
        </Button>

        <br />
        <p><b>Income:</b></p>
        <ol class="list-decimal pl-6">
          <li>Parental leave (1500 GEL/month)</li>
        </ol>
      </div>

      <!-- FAMILY -->
      <div class="w-full">
        <p class="mb-1"><b>Family</b></p>
        <div class="border px-3 py-2">
          <p>Levan (child)</p>
          <p>
            <b>Age:</b>
            {Math.floor(childAge * 12)} months
          </p>
          <p>
            <b>Status:</b>
            <span>
              {#if $childStatus > 0.7}
                Happy
              {:else if $childStatus > 0.5}
                Content
              {:else if $childStatus > 0.3}
                Hungry
              {:else}
                Very hungry
              {/if}
            </span>
            <span>({($childStatus * 100).toFixed(0)}%)</span>
          </p>
        </div>
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
