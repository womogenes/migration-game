<script>
  import '../app.css';
</script>

<svelte:head>
  <title>Migration game</title>
  <link rel="icon" href="images/favicon.svg" />
</svelte:head>

<main
  class="flex h-full justify-center dark:bg-neutral-900 dark:text-neutral-200"
>
  <slot />
</main>

<style lang="css">
  /* Let's not kill our eyes */
  :global(body) {
    @apply dark:bg-neutral-900;
  }

  :global(hr) {
    @apply my-1 h-px w-48 bg-neutral-500;
  }

  :global(.btn) {
    @apply select-none; /* Disallow selecting button text */
    @apply border px-4 py-0.5 leading-snug;
    @apply transition-colors hover:bg-neutral-100 hover:underline;
    @apply disabled:no-underline disabled:opacity-60;
  }

  :global(h1) {
    @apply text-lg font-bold;
  }

  :global(pre) {
    @apply text-sm;
  }

  :global(html) {
    font-size: 16pt;
  }
</style>
