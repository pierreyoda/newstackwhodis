<script lang="ts">
  import "../../styles/prism-vs-code-dark.css";
</script>

<div class="post-container">
  <!-- TODO: display date -->
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
      @apply font-extrabold text-3xl mb-10;
    }
    :global(h2) {
      @apply font-bold text-2xl mt-8 mb-8;
    }
    :global(h3) {
      @apply font-bold text-xl mt-6 mb-6;
    }
    :global(h4) {
      @apply font-semibold text-lg mt-4 mb-4;
    }
    :global(h5) {
      @apply font-semibold mt-2 mb-2;
    }

    :global(ul) {
      @apply list-disc;
    }
    :global(ul > li) {
      @apply pl-2;
    }

    :global(p > code) {
      @apply font-mono font-semibold text-sm;
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
