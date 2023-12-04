<script>
  import '../app.css';
</script>

<svelte:head>
  <title>Migration game</title>
  <link rel="icon" href="images/favicon.svg" />
</svelte:head>

<main
  class="flex h-full justify-center overflow-y-hidden dark:bg-neutral-900 dark:text-neutral-200"
>
  <slot />
</main>

<style lang="css">
  /* Let's not kill our eyes */
  :global(body) {
    @apply dark:bg-neutral-900;
  }

  :global(hr) {
    @apply w-full border-b border-neutral-500;
  }

  :global(.btn) {
    @apply select-none; /* Disallow selecting button text */
    @apply border bg-transparent px-4 py-0.5 pt-1;
    @apply transition-colors hover:bg-neutral-100 hover:underline;
  }

  :global(h1) {
    @apply text-lg;
  }

  :global(html) {
    font-size: 16pt;
  }
</style>
