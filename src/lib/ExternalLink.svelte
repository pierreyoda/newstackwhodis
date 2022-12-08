<script lang="ts">
  export let href: string;
  export let label: string;
  export let inNewTab = true;

  $: target = inNewTab ? "_blank" : "_self";
</script>

<a {href} {target} rel="noopener noreferrer">
  {label}
</a>

<style lang="postcss">
  a {
    @apply no-underline text-white font-semibold;
  }
</style>
