<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="container">
  <h1 class="mb-4 text-4xl font-bold md:mb-12">Posts</h1>
  {#each data.postsMeta as meta}
    <div class="post-meta">
      <a data-sveltekit-prefetch href={`/blog/${meta.slug}`}>
        <h2 class="title">{meta.title}</h2>
      </a>
      <p class="date">{meta.date}</p>
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
    .date {
      @apply text-sm mb-1;
    }
  }
</style>
