<script lang="ts">
  export let label: string;
  export let onPressed: () => void = () => {};
</script>

<button class="key" on:click={onPressed}>
  {label}
</button>

<style lang="postcss">
  .key {
    @apply w-8 h-8;
    @apply rounded bg-space;
  }
</style>
