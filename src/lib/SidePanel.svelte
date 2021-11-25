<script context="module" lang="ts">
  export const sidePanelSelectableCategories = ["blog", "projects", "about"] as const;
  export type SidePanelSelectableCategory = typeof sidePanelSelectableCategories[number];
</script>

<script lang="ts">
  import NavbarLink from "./SidePanelLink.svelte";
  import { copyrightNotice } from "../content/branding";

  export let selectedCategory: SidePanelSelectableCategory;
</script>

<div class="side-panel-container">
  <div class="flex items-center mr-8 md:mr-0">
    <img class="w-32 h-auto md:w-64" src="/brand.svg" alt="Praca logo" />
  </div>
  <nav>
    <ul class="flex items-center flex-grow md:justify-start md:flex-col md:text-xl">
      <NavbarLink href="/" label="Projects" isSelected={selectedCategory === "projects"} />
      <NavbarLink href="/blog/about" label="About" isSelected={selectedCategory === "about"} />
    </ul>
  </nav>
  <footer>
    <span>{copyrightNotice}</span>
  </footer>
</div>

<style lang="postcss">
  .side-panel-container {
    @apply flex items-center flex-shrink-0 md:flex-col md:w-1/3 md:p-12;
    @apply w-full p-3;
    @apply text-white bg-black;

    footer {
      @apply hidden items-center justify-center md:flex;
      @apply text-gray;
    }
  }
</style>
