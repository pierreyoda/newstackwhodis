<script lang="ts">
  import "../../styles/prism-vs-code-dark.css";
</script>

<div class="post-container">
  <slot />
</div>

<style lang="postcss">
  .post-container {
    @apply text-white;

    :global(> *) {
      @apply mt-4 max-w-3xl mx-auto;
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
    :global(h4) {
      @apply font-semibold mt-4 mb-4;
    }
    :global(h5) {
      @apply font-light mt-2 mb-2;
    }

    :global(ul) {
      @apply list-disc;
    }
  }

  @screen lg {
    .post-container {
      :global(pre) {
        @apply max-w-5xl;
      }
    }
  }
</style>
