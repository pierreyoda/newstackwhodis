<div class="post-container">
  <slot />
</div>

<style lang="postcss">
  .post-container {
    @apply p-4;
    @apply text-white;

    :global(> *) {
      @apply mt-4;
    }

    :global(a) {
      @apply text-lychee;
    }

    :global(h1) {
      @apply font-semibold text-2xl mb-4;
    }
    :global(h2) {
      @apply font-semibold text-xl mb-2;
    }
    :global(h3) {
      @apply font-semibold;
    }
  }
</style>
