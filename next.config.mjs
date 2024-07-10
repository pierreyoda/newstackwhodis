import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import remarkEmoji from "remark-emoji";
import remarkPrism from "remark-prism";
import rehypeToc from "@jsdevtools/rehype-toc";
import remarkFrontmatter from "remark-frontmatter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

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
    remarkPlugins: [remarkFrontmatter, remarkEmoji, remarkPrism],
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
  },
});

export default withMDX(nextConfig);
