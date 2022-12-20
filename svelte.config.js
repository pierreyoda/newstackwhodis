import { mdsvex } from "mdsvex";
import remarkEmoji from "remark-emoji";
import preprocess from "svelte-preprocess";
import staticAdapter from "@sveltejs/adapter-static";
import rehypeSlug from "rehype-slug";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import RemarkImagesMdsveXPluginPackage from "./plugins/remark-images.cjs";
// const { remarkImagesMdsveXPlugin } = RemarkImagesMdsveXPluginPackage;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svelte.md", ".svx"],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    mdsvex({
      extensions: [".svelte.md", ".md", ".svx"],
      remarkPlugins: [remarkEmoji],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        [
          rehypeToc,
          {
            customizeTOC: tableOfContents => {
              // quick and dirty solution to not display the ToC in the about page
              return tableOfContents.children?.[0]?.children?.[0]?.data?.hookArgs?.[0]?.properties?.id !== "about-me";
            },
          },
        ],
      ],
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
