import Link from "next/link";
import { NextPage } from "next";

import { BlogPostMeta, getBlogPostsMeta } from "@/api/blog";
import { ExternalLink } from "@/components/ExternalLink";

const BlogPostsList: NextPage<{ metaList: readonly BlogPostMeta[] }> = ({ metaList }) => (
  <div className="max-w-3xl mx-auto">
    <div className="mb-8">
      <span className="mb-2">
        The entirety of these blog posts are licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International license.
      </span>
      See the
      <ExternalLink href="https://github.com/pierreyoda/newstackwhodis/blob/main/src/pages/blog/BLOG_LICENSE">
        Full License Text
      </ExternalLink>
      .
    </div>
    <h1 className="mb-4 text-4xl font-bold md:mb-12">Posts</h1>
    {metaList.map(({ slug, title, description }) => (
      <div key={slug} className="mb-8 last-of-type:mb-0">
        <Link href={`/blog/${slug}`}>
          <h2 className="font-semibold text-lychee my-0">
            {title}
          </h2>
        </Link>
        <p>{description}</p>
      </div>
    ))}
  </div>
);

BlogPostsList.getInitialProps = async () => ({
  metaList: await getBlogPostsMeta(),
});

export default BlogPostsList;
