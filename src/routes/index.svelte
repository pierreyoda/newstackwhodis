<script lang="ts">
  import ContentPanel from "$lib/ContentPanel.svelte";
  import { parsedRepositoriesData } from "../api/static";
  import type { GithubProjectMeta } from "$lib/ContentPanel.svelte";

  const { githubRepositories } = parsedRepositoriesData();
  const githubProjects = ((): readonly GithubProjectMeta[] =>
    githubRepositories.map(({ name, ...meta }) => ({
      name,
      ...meta,
      blogPostSlug: null, // TODO:
    })))();
</script>

<div class="flex flex-col px-2 md:px-8">
  <h1 class="mb-4 text-4xl font-bold text-white md:mb-12">Personal Projects</h1>
  <ContentPanel {githubProjects} highlightContentCategory="projects" />
</div>
