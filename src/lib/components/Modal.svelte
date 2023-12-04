<script>
  // Automatically shows when

  export let curModal;
  /*
    curModal = {
      title: '...',
      actions: [
        { label: '...', action: () => {...} }
        { label: '...', action: () => {...} }
        ...
      ]
    }
  */

  import { fade } from 'svelte/transition';

  let show = !!$curModal;
  curModal.subscribe((curModal) => (show = show || curModal));
</script>

{#if show}
  <div
    class="absolute z-20 flex h-full w-full items-start justify-center bg-neutral-500 bg-opacity-50 pt-40"
    transition:fade={{ duration: 100 }}
  >
    <div class="flex w-full max-w-sm flex-col gap-4 border bg-white px-6 py-4">
      <h1>{$curModal?.title}</h1>
      <div class="flex gap-4">
        {#each $curModal?.actions || [] as action}
          <button
            class="btn"
            on:click={() => {
              action.action();
              // Somehow, doing it in this order makes modal data display
              //   even while the modal is fading out. Not complaining.
              show = false;
              $curModal = null;
            }}>{action.label}</button
          >
        {/each}
      </div>
    </div>
  </div>
{/if}
