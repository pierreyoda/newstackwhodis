<script lang="ts">
  import "../app.css";
  import SidePanel from "$lib/SidePanel.svelte";
  import type { SidePanelSelectableCategory } from "$lib/SidePanel.svelte";

  let selectedCategory: SidePanelSelectableCategory = "projects";
</script>

<div class="flex flex-col justify-between w-full h-full font-sans antialiased">
  <div class="flex flex-col flex-grow w-full md:flex-row">
    <SidePanel {selectedCategory} />
    <main class="flex-grow px-2 pt-2 overflow-auto md:pt-28 md:px-0">
      <slot />
    </main>
  </div>
</div>

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }
</style>
