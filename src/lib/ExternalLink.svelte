<script lang="ts">
  export let href: string;
  export let inNewTab = true;

  $: target = inNewTab ? "_blank" : "_self";
</script>

<a {href} {target} rel="noopener noreferrer">
  <slot />
</a>

<style lang="postcss">
  a {
    @apply no-underline;
  }
</style>
