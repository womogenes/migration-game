<script>
  // Automatically shows when curModal is not null.
  // Automatically hides on every action complete.
  export let modalQueue;
  /*
    modalQueue = [
      {
        title: '...',
        desc: '...',
        actions: [
          { label: '...', action: () => {...} }
          { label: '...', action: () => {...} }
          ...
        ]
      },
      ...
    ]
  */
  import { fade } from 'svelte/transition';
  import Button from '$lib/components/Button.svelte';

  $: show = $modalQueue.length > 0;
  modalQueue.subscribe((modalQueue) => (show = show || modalQueue));
</script>

{#if show}
  <div
    class="absolute z-20 flex h-full w-full items-start justify-center bg-white bg-opacity-50 pt-40"
    transition:fade={{ duration: 100 }}
  >
    <div
      class="relative flex w-full max-w-sm flex-col gap-2 border-2 bg-white px-6 py-6 shadow-md shadow-neutral-400"
    >
      <h1 class="absolute -top-2 left-4 bg-white px-2 font-bold leading-none">
        {@html $modalQueue[0]?.title}
      </h1>
      <p class="mb-4 leading-tight">{@html $modalQueue[0]?.desc}</p>
      <div class="flex gap-4">
        {#each $modalQueue[0]?.actions || [] as action}
          <Button
            onClick={() => {
              action.action();
              // Somehow, doing it in this order makes modal data display
              //   even while the modal is fading out. Not complaining.
              show = false;
              $modalQueue = $modalQueue.slice(1);
            }}
            tooltip={action.tooltip}
            >{action.label}
          </Button>
        {/each}
      </div>
    </div>
  </div>
{/if}
