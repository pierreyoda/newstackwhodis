<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  import type { BlogPost } from "../api/posts";

  export const load: Load = async ({ page, fetch }) => {
    if (!page.path.includes("blog/")) {
      return {};
    }
    const post: BlogPost = await fetch(`${page.path}.json`).then(res => res.json());
    return {
      props: {
        slug: post.slug,
        code: post.code,
      },
    };
  };
</script>

<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/Navbar.svelte";
  import Footer from "$lib/Footer.svelte";
  import type { SidePanelSelectableCategory } from "$lib/Navbar.svelte";

  let selectedCategory: SidePanelSelectableCategory = "projects";
</script>

<div class="layout-container">
  <div class="flex flex-col flex-grow w-full">
    <Navbar {selectedCategory} />
    <main class="flex-grow px-2 pt-2 overflow-auto md:pt-28 md:px-0">
      <slot />
    </main>
    <Footer />
  </div>
</div>

<style lang="postcss">
  :global(html, body, #svelte) {
    @apply h-full bg-black-darker;
  }
  :global(#svelte) {
    @apply font-sans antialiased;
  }

  .layout-container {
    @apply flex flex-col w-full h-full;
    @apply max-w-3xl mx-auto;
  }
</style>
