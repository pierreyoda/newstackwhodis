<script lang="ts">
  import { copyrightNotice } from "../content/branding";
</script>

<footer>
  <span>{copyrightNotice}</span>
</footer>

<style lang="postcss">
  footer {
    @apply flex items-center justify-center px-4 py-6;
    @apply text-sm text-gray-lighter;
  }
</style>
