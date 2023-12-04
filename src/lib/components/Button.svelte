<script>
  import { fade, fly } from 'svelte/transition';

  let hover = false;
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
    disabled={$$props.disabled}><slot /></button
  >

  {#if hover}
    <div
      class="text-sm absolute top-9 w-48 border bg-white px-2 py-1 leading-tight shadow"
      transition:fade
    >
      <slot name="tooltip" />
    </div>
  {/if}
</div>
