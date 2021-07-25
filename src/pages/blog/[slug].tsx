import { MDXRemote } from "next-mdx-remote";
import { ReactNode } from "react";
// import { setupTwoslashHovers } from "shiki-twoslash/dom";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { BlogPost, getBlogPostBySlug, getBlogPostsSlugs } from "@/api/posts";

interface BlogPostPageProps {
  post: BlogPost;
}

const mdxComponents: Record<string, ReactNode> = {};

const BlogPostPage: NextPage<BlogPostPageProps> = ({ post: { content } }) => (
  <div className="flex flex-col items-center h-full pt-4 mx-auto md:pt-12">
    <article className="prose">
      <MDXRemote {...content} components={mdxComponents} />
    </article>
  </div>
);

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug;
  if (!slug || Array.isArray(slug)) {
    throw new Error(`BlogPostPage.getStaticProps: invalid slug ${slug}`);
  }

  const post = await getBlogPostBySlug({ slug, components: mdxComponents });
  return { props: { post } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getBlogPostsSlugs();
  return {
    paths: slugs.map(slug => ({
      params: {
        slug,
      },
      // TODO: handle locale detection
    })),
    fallback: false,
  };
};

export default BlogPostPage;
