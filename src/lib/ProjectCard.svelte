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
import ProjectTag from "./ProjectTag.svelte";

  export let isHighlighted: boolean;
  export let projectMeta: ProjectMeta;

  $: projectTags = ((): readonly ProjectTagType[] => tagsPerProject[projectMeta.githubFullName] ?? [])()
</script>

<div class="project-card-container" class:highlighted="{isHighlighted}">
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
  <div class="project-card-tags">
    {#each projectTags as tag}
      <ProjectTag {tag} extraClass="mr-2" />
    {/each}
  </div>
  <div class="project-card-content">
    <div class="project-card-github-link">
      <a href={projectMeta.url} target="_blank" rel="nofollow noopener noreferrer">
        View on GitHub
      </a>
    </div>
    <div class="project-card-github-stats">
      {#if projectMeta.githubForksCount}
        <p class="mr-4 text-orange">
          {projectMeta.githubForksCount} fork{projectMeta.githubForksCount > 1 ? "s" : ""}
        </p>
      {/if}
      {#if projectMeta.githubStars}
        <p class="text-yellow">
          {projectMeta.githubStars} fork{projectMeta.githubStars > 1 ? "s" : ""}
        </p>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .project-card-container {
    @apply flex flex-col items-start justify-around;
    @apply p-3 bg-black-lighter border rounded;

    .project-card-title {
      @apply text-lg font-bold text-white border-b-2 border-lychee;
      &:hover {
        @apply text-lychee;
      }
    }
    .project-card-description {
      @apply pt-3 text-sm text-white;
    }
    .project-card-tags {
      @apply flex flex-wrap items-center w-full py-2;
    }
    .project-card-content {
      @apply flex items-center justify-between w-full text-sm;
      .project-card-github-link {
        @apply text-white rounded;
        a {
          @apply font-bold hover:text-lychee;
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
