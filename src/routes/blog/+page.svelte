<script lang="ts">
  import type { PageData } from "./$types";
  import ExternalLink from "$lib/ExternalLink.svelte";

  export let data: PageData;
</script>

<div class="container">
  <div class="mb-8">
    <span class="mb-2">
      The entirety of these blog posts are licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International license.
    </span>
    See the
    <ExternalLink href="https://github.com/pierreyoda/praca-website/blob/main/src/routes/blog/BLOG_LICENSE">
      Full License Text
    </ExternalLink>
    .
  </div>
  <h1 class="mb-4 text-4xl font-bold md:mb-12">Posts</h1>
  {#each data.postsMeta as meta}
    <div class="post-meta">
      <a data-sveltekit-prefetch href={`/blog/${meta.slug}`}>
        <h2 class="title">{meta.title}</h2>
      </a>
      <p class="description">{meta.description}</p>
    </div>
  {/each}
</div>

<style lang="postcss">
  .container {
    @apply max-w-3xl mx-auto;
  }

  .post-meta {
    @apply mb-8;
    &:last-of-type {
      @apply mb-0;
    }

    .title {
      @apply font-semibold text-lychee my-0;
    }
  }
</style>
