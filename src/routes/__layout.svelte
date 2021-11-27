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
    @apply max-w-3xl mx-auto;
  }
</style>
