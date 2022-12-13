<script lang="ts">
  import NavbarLink from "./NavbarLink.svelte";
  import ExternalLink from "./ExternalLink.svelte";
  import type { NavigationSelectableCategory } from "./types";

  export let selectedCategory: NavigationSelectableCategory;

  $: hideGitHubLink = selectedCategory === "blog";
  $: githubLinkContainerClasses = hideGitHubLink ? "github-link-container hidden" : "github-link-container";
</script>

<div class="outer-container">
  <div class="w-full justify-center flex items-center mr-12 text-white font-bold py-6">
    <a data-sveltekit-prefetch href="/">
      newstackwhodis
    </a>
  </div>
  <div class="container">
    <div />
    <div class="navbar-container">
      <nav>
        <ul class="flex items-center flex-grow md:text-xl">
          <NavbarLink href="/" label="Projects" isSelected={selectedCategory === "projects"} />
          <NavbarLink href="/blog" label="Blog" isSelected={selectedCategory === "blog"} />
          <NavbarLink href="/blog/about" label="About" isSelected={selectedCategory === "about"} />
        </ul>
      </nav>
    </div>
    <div class={githubLinkContainerClasses}>
      <ExternalLink href="https://github.com/pierreyoda/praca-website">
        GitHub
      </ExternalLink>
    </div>
  </div>
</div>

<style lang="postcss">
  .outer-container {
    @apply flex flex-col;
  }

  .container {
    @apply w-full flex flex-col self-center items-center justify-between;
  }

  .navbar-container {
    @apply flex items-center p-2;
    @apply max-w-3xl mx-auto;
    @apply text-gray-lighter;

    nav {
      @apply flex items-center flex-grow;
    }
  }

  .github-link-container {
    @apply text-white font-semibold py-2;
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

    .github-link-container {
      @apply py-0;
    }
  }
</style>
