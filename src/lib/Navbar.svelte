<script context="module" lang="ts">
  export const navigationSelectableCategories = ["blog", "projects", "about"] as const;
  export type NavigationSelectableCategory = typeof navigationSelectableCategories[number];
</script>

<script lang="ts">
  import NavbarLink from "./NavbarLink.svelte";

  export let selectedCategory: NavigationSelectableCategory;
</script>

<div class="navbar-container">
  <div class="flex items-center">
    <a sveltekit:prefetch href="/">
      <img class="w-32 h-auto" src="/brand.svg" alt="Praca logo" />
    </a>
  </div>
  <nav>
    <ul class="flex items-center flex-grow md:text-xl">
      <NavbarLink href="/" label="Projects" isSelected={selectedCategory === "projects"} />
      <NavbarLink href="/blog" label="Blog" isSelected={selectedCategory === "blog"} />
      <NavbarLink href="/blog/about" label="About" isSelected={selectedCategory === "about"} />
    </ul>
  </nav>
</div>

<style lang="postcss">
  .navbar-container {
    @apply flex items-center w-full p-2;
    @apply max-w-3xl mx-auto;
    @apply text-gray-lighter;

    nav {
      @apply flex items-center flex-grow;
    }
  }

  @screen md {
    .navbar-container {
      nav {
        @apply text-xl;
      }
    }
  }
</style>
