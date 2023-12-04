<script>
  import { fade, fly } from 'svelte/transition';
  import { derived, get, writable } from 'svelte/store';

  import { store } from '$lib/store.js';
  import { onMount } from 'svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Logs from '$lib/components/Logs.svelte';
  import Button from '../../lib/components/Button.svelte';

  // Utilities
  Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  // Game tick
  // Prevent setInterval from running twice with Svelte hot-reloading
  let timewarp = store('timewarp', 0.1);
  const startTime = store('start-time', new Date().getTime());
  const gameDays = store('game-days', 0);
  onMount(() => {
    const tickInterval = window.setInterval(() => {
      $gameDays += $timewarp;
      onTick();
    }, 200);
    return () => window.clearInterval(tickInterval);
  });
  $: gameDate = new Date($startTime + $gameDays * (1000 * 60 * 60 * 24));

  // Child things
  $: childAge = $gameDays / 30 + 1;
  const childStatus = store('child-status', 1);

  // Funds
  const funds = store('funds', {
    amount: Math.random() * 1000 + 6000,
    currency: 'GEL',
  });
  $: moneyFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  $: formattedFunds = moneyFormatter.format($funds.amount);

  // Log messages in left sidebar
  const logs = store('logs', ['Welcome.']);
  const addLog = (message) => ($logs = [...$logs, message]);

  // Import things from js file
  const events = [
    {
      queued: store('queued-checkups', 0),
      condition: function () {
        let res = $gameDays > (get(this.queued) + 1) * 30;
        return res;
      },
      effect: function () {
        this.queued.update((x) => x + 1);
        enqueueModal({
          title: 'Medical checkup',
          desc: `You need to bring Levan to the doctor for his ${Math.floor(
            childAge,
          )}-month checkup.`,
          actions: [
            {
              label: 'ok',
              tooltip: `<div class="flex justify-between"><span>Funds</span><span>&ndash;₾100</span></div>`,
              action: () => {
                funds.update((x) => {
                  return { ...x, amount: x.amount - 100 };
                });
              },
            },
          ],
        });
      },
    },
  ];

  // Things to do every game loop
  const onTick = () => {
    // Child gets hungry?
    if (Math.random() < 0.3) {
      $childStatus += (Math.random() - 0.8) * 0.1;
      $childStatus = Math.min(1, Math.max($childStatus, 0));
    }

    // Run all the events
    for (let event of events) {
      if (!event.condition()) continue;
      event.effect();
    }
  };

  // Modal actions
  let modalQueue = store('modal-queue', []);
  const enqueueModal = (modal) => {
    $modalQueue = [...$modalQueue, modal];
  };
</script>

<!-- Modal -->
<Modal {modalQueue} />

<!-- Main content -->
<div class="relative flex max-h-screen w-full max-w-5xl flex-col px-6 py-4">
  <div class="flex h-full flex-col items-start gap-6 sm:flex-row">
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
        <p><b>Occupation:</b> Security guard</p>
        <p><b>Status:</b> Paid parental leave (week 1 / 12)</p>
        <Button
          class="pt-2"
          disabled
          tabindex="0"
          tooltip="Levan currently requires all of your focus and attention."
        >
          Return to work
        </Button>

        <br />
        <p><b>Income:</b></p>
        <ol class="list-decimal pl-6">
          <li>Parental leave (₾1,500 / month)</li>
        </ol>
      </div>

      <!-- FAMILY -->
      <div class="w-full">
        <p class="mb-1"><b>Family</b></p>
        <div class="border px-3 py-2">
          <p>Levan</p>
          <p>
            <b>Age:</b>
            {`${Math.floor(childAge)} ${
              Math.floor(childAge) !== 1 ? 'months' : 'month'
            }`}
          </p>
          <p>
            <b>Status:</b>
            <span>
              {#if $childStatus > 0.7}
                Happy
              {:else if $childStatus > 0.5}
                Irritated
              {:else if $childStatus > 0.3}
                Frustrated
              {:else}
                Crying
              {/if}
            </span>
            <span>({($childStatus * 100).toFixed(0)}%)</span>
          </p>
          <Button
            class="my-1"
            onClick={() => {
              $childStatus += (1 - $childStatus) * 0.2;
              addLog(
                [
                  'Levan giggles with joy.',
                  'You cradle Levan, and a sweet smile lights up his face.',
                  'You playfully tickle Levan, eliciting adorable giggles.',
                  "Levan's tiny fingers wrap around yours, forming a heartwarming connection.",
                  "You sing a lullaby, and Levan's eyes slowly close as he drifts off to sleep",
                  "Levan's laughter brightens up the entire room.",
                  'Levan lets out a joyous laugh.',
                  'You gently rock Levan, and a happy grin spreads across his face.',
                  'A playful giggle escapes Levan, filling the room with delight.',
                  'As you make funny faces, Levan bursts into contagious laughter.',
                  'Levan snuggles close, finding comfort in your warm embrace.',
                ].sample(),
              );
            }}
            cooldown={1}
            {gameDays}>Feed</Button
          >
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
        <!-- ({gameDate.toLocaleDateString('en-us', { weekday: 'long' })}) -->
      </p>
      <p><b>Location:</b> Tbilisi, Georgia</p>
      <p>
        <b>Savings:</b>
        <span class="tabular-nums">₾{formattedFunds}</span>
      </p>
      <div class="w-full">
        <p class="mb-1">Timewarp: {($timewarp * 5).toFixed(2)} days / second</p>
        <input
          class="w-full"
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
          bind:value={$timewarp}
        />
      </div>
    </div>
  </div>

  <div class="absolute bottom-4 flex items-center gap-4 self-end bg-white px-4">
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
