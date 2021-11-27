<div class="post-container">
  <slot />
</div>

<style lang="postcss">
  .post-container {
    @apply p-4;

    :global(> *) {
      @apply mt-4;
    }

    :global(a) {
      @apply text-lychee;
    }

    :global(h1) {
      @apply font-semibold text-2xl;
    }
  }
</style>
