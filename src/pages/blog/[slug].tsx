import { ReactNode } from "react";
import hydrate from "next-mdx-remote/hydrate";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import "twin.macro";

import { BlogPost, getBlogPostBySlug, getBlogPostsSlugs } from "@/api/posts";

interface BlogPostPageProps {
  post: BlogPost;
}

const mdxComponents: Record<string, ReactNode> = {};

const BlogPostPage: NextPage<BlogPostPageProps> = ({ post: { content } }) => {
  const hydratedContent = hydrate(content, { components: mdxComponents });

  return (
    <div tw="flex flex-col items-center pt-4 md:pt-12 h-full mx-auto">
      <article tw="prose">{hydratedContent}</article>
    </div>
  );
};

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
