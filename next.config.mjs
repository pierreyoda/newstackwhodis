import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  turbopack: {
    resolveAlias: {
      fs: { browser: "./src/empty.js" },
    },
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-emoji", "remark-prism"],
    rehypePlugins: ["rehype-slug", "rehype-autolink-headings", ["@jsdevtools/rehype-toc"]],
  },
});

export default withMDX(nextConfig);
