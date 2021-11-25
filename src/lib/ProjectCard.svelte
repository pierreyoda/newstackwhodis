<script context="module" lang="ts">
  export interface ProjectMeta {
    type: "github";
    url: string;
    title: string;
    githubFullName: string;
    description: string;
    githubForksCount: number;
    githubStars: number;
    blogPostSlug: string | null;
  }
</script>

<script lang="ts">
  import { tagsPerProject } from "../api/github/project-tags";
  import type { ProjectTagType } from "../api/github/project-tags";

  export let isHighlighted: boolean;
  export let projectMeta: ProjectMeta;

  $: projectTags = ((): readonly ProjectTagType[] => tagsPerProject[projectMeta.githubFullName] ?? [])()
</script>

<div class="project-card-container">
  <h3 class="project-card-title">
    {#if projectMeta.blogPostSlug}
      <a sveltekit:prefetch href={`/blog/${projectMeta.blogPostSlug}`}>
        {projectMeta.title}
      </a>
    {:else}
      {projectMeta.title}
    {/if}
  </h3>
  <p class="project-card-description">{projectMeta.description}</p>
  <div class="project-card-content">
    <div class="project-card-github-link">
      <a href={projectMeta.url} target="_blank" rel="noopener noreferrer">
        View on GitHub
      </a>
    </div>
    <div class="project-card-github-stats">

    </div>
  </div>
</div>
