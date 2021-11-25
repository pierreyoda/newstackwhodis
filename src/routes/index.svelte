<script lang="ts">
  import ContentPanel from "$lib/ContentPanel.svelte";
  import type { GithubProjectMeta } from "$lib/ContentPanel.svelte";
  import { parsedRepositoriesData } from "../api/static";

  const githubProjects = parsedRepositoriesData().githubRepositories.map(({ name, ...meta }): GithubProjectMeta => ({
    name,
    ...meta,
    blogPostSlug: null, // TODO:
  }))
</script>

<div class="flex flex-col px-2 md:px-8">
  <h1 class="mb-4 text-4xl font-bold md:mb-12">Personal Projects</h1>
  <ContentPanel {githubProjects} highlightContentCategory="projects" />
</div>
