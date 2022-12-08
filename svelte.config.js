import { mdsvex } from "mdsvex";
import remarkEmoji from "remark-emoji";
import preprocess from "svelte-preprocess";
import staticAdapter from "@sveltejs/adapter-static";
import RemarkImagesMdsveXPluginPackage from "./plugins/remark-images.cjs";
const { remarkImagesMdsveXPlugin } = RemarkImagesMdsveXPluginPackage;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svelte.md", ".svx"],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    mdsvex({
      extensions: [".svelte.md", ".md", ".svx"],
      remarkPlugins: [remarkEmoji, remarkImagesMdsveXPlugin],
    }),
    preprocess({
      postcss: true,
    }),
  ],
  kit: {
    adapter: staticAdapter({
      pages: "./build/",
      assets: "./build/",
      fallback: null,
    }),
  },
};

export default config;
