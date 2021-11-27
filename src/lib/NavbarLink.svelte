<script lang="ts">
  export let href: string;
  export let label: string;
  export let isSelected: boolean;
</script>

<li class="mr-8 last:mr-0">
  <a sveltekit:prefetch {href} class:selected={isSelected}>
    {label}
  </a>
</li>

<style lang="postcss">
  a {
    @apply cursor-pointer text-white hover:text-lychee;
    &.selected {
      @apply text-lychee;
    }
  }
</style>
