import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  webpack: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
      },
    },
  }),
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-emoji", "remark-prism"],
    rehypePlugins: ["rehype-slug", "rehype-autolink-headings", ["@jsdevtools/rehype-toc"]],
  },
});

export default withMDX(nextConfig);
