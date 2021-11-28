<div class="post-container">
  <slot />
</div>

<style lang="postcss">
  .post-container {
    @apply text-white;

    :global(> *) {
      @apply mt-4;
    }

    :global(a) {
      @apply text-lychee;
    }

    :global(h1) {
      @apply font-semibold text-2xl mb-10;
    }
    :global(h2) {
      @apply font-semibold text-xl mt-8 mb-8;
    }
    :global(h3) {
      @apply font-semibold mt-6 mb-6;
    }
  }
</style>
