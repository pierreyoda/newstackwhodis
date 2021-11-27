import { mdsvex } from "mdsvex";
import preprocess from "svelte-preprocess";
import remarkEmoji from "remark-emoji";
import vercel from "@sveltejs/adapter-vercel";

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
    adapter: vercel(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
  },
};

export default config;
