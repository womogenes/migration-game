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
</style>
