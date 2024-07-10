import Link from "next/link";
import { GetStaticProps } from "next";
import { FunctionComponent } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { BlogPostMeta, getBlogPostsMeta } from "@/api/blog";

interface BlogPostListProps {
  metaList: readonly BlogPostMeta[];
}

const BlogPostsList: FunctionComponent<BlogPostListProps> = ({ metaList }) => (
  <div className="max-w-3xl mx-auto mt-4">
    <div className="mb-8">
      <span className="mb-2">
        The entirety of these blog posts are licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International license.
      </span>
      &nbsp;See the&nbsp;
      <ExternalLink className="text-lychee" href="https://github.com/pierreyoda/newstackwhodis/blob/main/src/pages/blog/BLOG_LICENSE">
        Full License Text
      </ExternalLink>
      .
    </div>
    <h1 className="mb-4 text-4xl font-bold md:mb-12">Posts</h1>
    {metaList.map(({ slug, title, description }) => (
      <div key={slug} className="mb-8 last-of-type:mb-0 leading-8">
        <Link href={`/blog/${slug}`}>
          <h2 className="font-semibold text-2xl text-lychee my-0">
            {title}
          </h2>
        </Link>
        <p>{description}</p>
      </div>
    ))}
  </div>
);

export const getStaticProps = (async () => ({
  props: {
    metaList: await getBlogPostsMeta(),
  },
})) satisfies GetStaticProps<BlogPostListProps>;

export default BlogPostsList;