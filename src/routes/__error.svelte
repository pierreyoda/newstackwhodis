<script context="module" lang="ts">
  import type { ErrorLoad } from "@sveltejs/kit";

  export const load: ErrorLoad = ({ error, status }) => ({
    props: {
      message: `${status}: ${error.message}`,
    },
  });
</script>

<script lang="ts">
  export let message: string;
</script>

<div class="container">
  <h2>Error</h2>
  <p class="message">{message ?? "An error has occurred."}</p>
</div>

<style lang="postcss">
  .container {
    @apply flex flex-col items-start justify-start w-full h-full;
    @apply text-gray-lighter;
  }
</style>
