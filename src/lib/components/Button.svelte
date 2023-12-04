<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let hover = false;
  let cooldown = 10; // In days
</script>

<!-- With cooldowns and a tooltip! -->
<div class={`${$$props.class || ''} relative`}>
  <button
    on:mouseover={() => (hover = true)}
    on:mouseout={() => (hover = false)}
    on:focus={() => (hover = true)}
    on:blur={() => (hover = false)}
    tabindex={$$props.tabindex}
    class="btn inline-block"
    disabled={$$props.disabled}
    on:click
  >
    <slot />
  </button>

  {#if hover && $$slots.tooltip}
    <div
      class="absolute top-[46px] w-48 border bg-white px-2 py-1 text-sm leading-tight"
      transition:fade
    >
      <slot name="tooltip" />
    </div>
  {/if}
</div>
