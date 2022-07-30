import { mdsvex } from "mdsvex";
import preprocess from "svelte-preprocess";
import remarkEmoji from "remark-emoji";
import staticAdapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svelte.md", ".svx"],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    mdsvex({
      extensions: [".svelte.md", ".md", ".svx"],
      remarkPlugins: [remarkEmoji],
    }),
    preprocess({
      postcss: true,
    }),
  ],
  kit: {
    prerender: {
      default: true,
    },
    adapter: staticAdapter({
      pages: "./build/",
      assets: "./build/",
      fallback: null,
    }),
  },
};

export default config;
