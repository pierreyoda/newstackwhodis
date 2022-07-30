import { mdsvex } from "mdsvex";
import preprocess from "svelte-preprocess";
import remarkEmoji from "remark-emoji";
import { sveltekit } from "@sveltejs/kit/vite";
import staticAdapter from "@sveltejs/adapter-static";

/** @type {import("vite").UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ["static"],
    },
  },
};

export default config;
