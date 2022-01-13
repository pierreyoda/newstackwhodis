<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = async ({ url }) => ({
    props: {
      selectedCategory: ((): NavigationSelectableCategory =>
        url.pathname === "/blog/about" ? "about" : url.pathname.startsWith("/blog") ? "blog" : "projects")(),
    },
  });
</script>

<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/Navbar.svelte";
  import Footer from "$lib/Footer.svelte";
  import type { NavigationSelectableCategory } from "$lib/Navbar.svelte";

  export let selectedCategory: NavigationSelectableCategory;
</script>

<div class="layout-container" class:in-blog={selectedCategory === "blog"}>
  <div class="flex flex-col flex-grow w-full">
    <Navbar {selectedCategory} />
    <main class="flex-grow px-2 pt-2 overflow-auto md:px-8">
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
    &:not(.in-blog) {
      @apply max-w-3xl mx-auto;
    }
  }
</style>
