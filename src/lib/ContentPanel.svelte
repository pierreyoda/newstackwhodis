<script context="module" lang="ts">
  import type { GithubRepositoryMeta } from "../api/fetcher";
  import type { SidePanelSelectableCategory } from "./SidePanel.svelte";

  export type GithubProjectMeta = GithubRepositoryMeta & {
    blogPostSlug: string | null;
  };
</script>

<script lang="ts">
  import ProjectCard from "./ProjectCard.svelte";
  import type { ProjectMeta } from "./ProjectCard.svelte";

  export let githubProjects: readonly GithubProjectMeta[];
  export let highlightContentCategory: SidePanelSelectableCategory | null;

  $: content = githubProjects.map(
    (githubProject): ProjectMeta => ({
      type: "github",
      url: githubProject.url,
      title: githubProject.name,
      githubFullName: githubProject.fullName,
      description: githubProject.description ?? "",
      githubForksCount: githubProject.forksCount,
      githubStars: githubProject.stargazersCount ?? 0,
      blogPostSlug: githubProject.blogPostSlug,
    }),
  );

  $: isHighlighted = highlightContentCategory === "projects";
</script>

<div class="content-panel">
  {#each content as projectMeta}
    <ProjectCard {isHighlighted} {projectMeta} />
  {/each}
</div>

<style lang="postcss">
  .content-panel {
    @apply grid grid-cols-1 gap-4 pb-4;
  }
  @screen lg {
    .content-panel {
      @apply grid-cols-2;
    }
  }
  @screen xl {
    .content-panel {
      @apply grid-cols-3;
    }
  }
</style>
