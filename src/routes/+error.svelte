<script lang="ts">
  import { page } from "$app/stores";

  $: message = `${$page.status}: ${$page.error?.message}`;
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
