<script context="module" lang="ts">
  import type { ProjectMeta } from "./ProjectCard.svelte";
  import type { GithubRepositoryMeta } from "../api/fetcher";
  import type { SidePanelSelectableCategory } from "./SidePanel.svelte";

  export type GithubProjectMeta = GithubRepositoryMeta & {
    blogPostSlug: string | null;
  };
</script>

<script lang="ts">
  import ProjectCard from "./ProjectCard.svelte";

  export let githubProjects: readonly GithubProjectMeta[];
  export let highlightContentCategory: SidePanelSelectableCategory;

  $: content = ((): readonly ProjectMeta[] => githubProjects.map(githubProject => ({
    type: "github",
    url: githubProject.url,
    title: githubProject.name,
    githubFullName: githubProject.fullName,
    description: githubProject.description ?? "",
    githubForksCount: githubProject.forksCount,
    githubStars: githubProject.stargazersCount ?? 0,
    blogPostSlug: githubProject.blogPostSlug,
  })))();
  $: highlighted = highlightContentCategory === "projects";
</script>

<div class="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-2 xl:grid-cols-3">
  {#each content as projectMeta}
    <ProjectCard {highlighted} {projectMeta} />
  {/each}
</div>
