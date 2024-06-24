import { NextPage } from "next";
import { } from "@mdx-js/react";

import { getBlogPost } from "@/api/blog";
import { MdxRenderer } from "@/components/blog/MdxRenderer";

interface BlogPostProps {
  mdxContent: string;
}

const BlogPost: NextPage<BlogPostProps> = ({ mdxContent }) => (
  <section className="blog-post-container">
    <MdxRenderer source={mdxContent} />
  </section>
);

BlogPost.getInitialProps = async ({ asPath }) => ({
  mdxContent: await getBlogPost(asPath?.substring(5) ?? ""),
});

export default BlogPost;
