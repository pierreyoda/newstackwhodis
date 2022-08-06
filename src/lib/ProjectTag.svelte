<script lang="ts">
  import type { ProjectTagType } from "../api/github/project-tags";

  export let tag: ProjectTagType;
  export let extraClass: string | undefined;

  $: tagClass = `project-tag ${extraClass ?? ""}`;
</script>

<div class={tagClass}>
  {tag}
</div>

<style lang="postcss">
  .project-tag {
    @apply py-1 rounded-md font-bold text-xs text-gray-lighter mr-2;
  }
</style>
