<script lang="ts">
  import { copyrightNotice } from "../content";
</script>

<footer>
  <span class="text-sm text-center">{copyrightNotice}</span>
</footer>

<style lang="postcss">
  footer {
    @apply flex flex-col w-full md:hidden;
    @apply p-3 text-white bg-black;
  }
</style>
