<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { store } from '$lib/store.js';

  export let onClick = () => {};
  export let gameDays = null;
  export let cooldown = 0;

  let hover = false;
  let lastUsed = $gameDays - cooldown;
</script>

<!-- With cooldowns and a tooltip! -->
<div class={`${$$props.class || ''} relative`}>
  <button
    on:mouseover={() => (hover = true)}
    on:mouseout={() => (hover = false)}
    on:focus={() => (hover = true)}
    on:blur={() => (hover = false)}
    tabindex={$$props.tabindex}
    class="btn relative inline-block w-auto"
    disabled={$$props.disabled ||
      (cooldown > 0 && gameDays && $gameDays - lastUsed < cooldown)}
    on:click={() => {
      onClick();
      if (gameDays) lastUsed = $gameDays;
    }}
  >
    <slot />
    {#if cooldown > 0 && $gameDays - lastUsed < cooldown}
      <div
        class="absolute left-0 top-0 -z-10 h-full w-full bg-neutral-200"
        style={`width: ${Math.max(
          (1 - ($gameDays - lastUsed) / cooldown) * 100,
          0,
        )}%; transition: width 0.5s linear;`}
        transition:fade
      ></div>
    {/if}
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
