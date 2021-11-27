<script lang="ts">
  import type { ProjectTagType } from "../api/github/project-tags";

  const backgroundColorByTag: Record<ProjectTagType, string> = {
    "C#": "#aaffaa",
    "C++": "#ffffff",
    Java: "#ffaaaa",
    Rust: "#d62626",
    React: "#61dafb",
    "Vue.js": "#42b983",
    Unity3D: "#ccffcc",
    Typescript: "#3178c6",
  };

  export let tag: ProjectTagType;
  export let extraClass: string | undefined;

  $: tagColor = backgroundColorByTag[tag];
  $: tagClass = `project-tag ${extraClass ?? ""}`;
</script>

<div class={tagClass} style="background-color: {tagColor}">
  {tag}
</div>

<style lang="postcss">
  .project-tag {
    @apply px-2 py-1 rounded-md font-medium text-xs;
  }
</style>
