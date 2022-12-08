<script lang="ts">
  import NavbarLink from "./NavbarLink.svelte";
  import ExternalLink from "./ExternalLink.svelte";
  import type { NavigationSelectableCategory } from "./types";

  export let selectedCategory: NavigationSelectableCategory;
</script>

<div class="container">
  <div class="navbar-container">
    <div class="flex items-center">
      <a data-sveltekit-prefetch href="/">
        <img class="w-28 h-auto" src="/brand.svg" alt="Praca logo" />
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
  <div class="github-link-container">
    <ExternalLink href="https://github.com/pierreyoda/praca-website">
      GitHub
    </ExternalLink>
  </div>
</div>

<style lang="postcss">
  .container {
    @apply w-full flex flex-col self-center items-center;
  }

  .navbar-container {
    @apply flex items-center w-full p-2;
    @apply max-w-3xl mx-auto;
    @apply text-gray-lighter;

    nav {
      @apply flex items-center flex-grow;
    }
  }

  .github-link-container {
    @apply text-white font-semibold;
  }

  @screen md {
    .container {
      @apply flex-row;
    }

    .navbar-container {
      nav {
        @apply text-xl;
      }
    }
  }
</style>
