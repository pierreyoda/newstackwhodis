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
  import ProjectTag from "$lib/ProjectTag.svelte";
  import { tagsPerProject } from "../api/github/project-tags";
  import type { ProjectTagType } from "../api/github/project-tags";

  export let isHighlighted: boolean;
  export let projectMeta: ProjectMeta;

  $: projectTags = ((): readonly ProjectTagType[] => tagsPerProject[projectMeta.githubFullName] ?? [])();
</script>

<div class="project-card-container" class:highlighted={isHighlighted}>
  <h2 class="project-card-title" class:has-blog-post={!!projectMeta.blogPostSlug}>
    {#if projectMeta.blogPostSlug}
      <a data-sveltekit-prefetch href={`/blog/${projectMeta.blogPostSlug}`}>
        {projectMeta.title}
      </a>
    {:else}
      {projectMeta.title}
    {/if}
  </h2>
  <p class="project-card-description">{projectMeta.description}</p>
  <div class="project-card-tags">
    {#each projectTags as tag}
      <ProjectTag {tag} extraClass="mr-2" />
    {/each}
  </div>
  <div class="project-card-content">
    <div class="project-card-github-link">
      <a href={projectMeta.url} target="_blank" rel="nofollow noopener noreferrer"> View on GitHub </a>
    </div>
    <div class="project-card-github-stats">
      {#if projectMeta.githubForksCount > 0}
        <p class="mr-4 text-orange">
          {projectMeta.githubForksCount} fork{projectMeta.githubForksCount > 1 ? "s" : ""}
        </p>
      {/if}
      {#if projectMeta.githubStars > 0}
        <p class="text-yellow">
          {projectMeta.githubStars} star{projectMeta.githubStars > 1 ? "s" : ""}
        </p>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .project-card-container {
    @apply flex flex-col items-start justify-around;
    @apply p-3 border border-gray-lighter;

    .project-card-title {
      @apply text-lg font-bold text-white;
      @apply border-b-2 border-lychee;
      &.has-blog-post:hover {
        @apply text-lychee;
      }
    }

    .project-card-description {
      @apply py-5 text-sm text-white;
    }

    .project-card-tags {
      @apply flex flex-wrap items-center w-full py-2;
    }

    .project-card-content {
      @apply flex items-center justify-between w-full text-sm;

      .project-card-github-link {
        @apply font-bold text-white rounded;
        a:hover {
          @apply text-lychee;
        }
      }

      .project-card-github-stats {
        @apply flex items-center font-semibold;
      }
    }
  }

  @screen md {
    .project-card-container {
      @apply rounded-lg;
    }
  }
</style>
