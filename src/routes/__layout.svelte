<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  import type { BlogPost } from "../api/posts";

  export const load: Load = async ({ page, fetch }) => {
    if (!page.path.includes("blog/")) {
      return {};
    }
    const post: BlogPost = await fetch(`${page.path}.json`).then(res => res.json());
    console.log(post)
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
  import SidePanel from "$lib/SidePanel.svelte";
  import MobileFooter from "$lib/MobileFooter.svelte";
  import type { SidePanelSelectableCategory } from "$lib/SidePanel.svelte";
import path from "path/posix";

  let selectedCategory: SidePanelSelectableCategory = "projects";
</script>

<div class="flex flex-col justify-between w-full h-full font-sans antialiased">
  <div class="flex flex-col flex-grow w-full md:flex-row">
    <SidePanel {selectedCategory} />
    <main class="flex-grow px-2 pt-2 overflow-auto md:pt-28 md:px-0">
      <slot />
    </main>
    <div class="w-full mt-4 md:hidden">
      <MobileFooter />
    </div>
  </div>
</div>

<style lang="postcss">
  :global(html, body, #svelte) {
    @apply h-full;
  }
</style>
