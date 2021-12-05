<script context="module" lang="ts">
  import dayjs from "dayjs";
  import type { Load } from "@sveltejs/kit";
  import type { BlogPostMeta } from "../../api/posts";

  export const load: Load = async ({ fetch }) => {
    const { postsMeta } = await fetch("/blog.json").then(res => res.json());
    return {
      props: {
        postsMeta: JSON.parse(postsMeta),
      },
    };
  };
</script>

<script lang="ts">
  export let postsMeta: readonly BlogPostMeta[];
</script>

<div class="container">
  <h1 class="mb-4 text-4xl font-bold md:mb-12">Posts</h1>
  {#each postsMeta as meta}
    <div class="post-meta">
      <a sveltekit:prefetch href={`/blog/${meta.slug}`}>
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
