import { join } from "path";
import { promises as fs } from "fs";
import RemarkEmojiPlugin from "remark-emoji";
import renderToString from "next-mdx-remote/render-to-string";
import { ReactNode } from "react";

import { Promised } from "@/utils";

const postsDirectory = join(process.cwd(), "./posts/");

export const getBlogPostsSlugs = async (): Promise<string[]> => fs.readdir(postsDirectory);

export type BlogPostRenderedContent = Promised<ReturnType<typeof renderToString>>;

export interface BlogPost {
  slug: string;
  content: BlogPostRenderedContent;
}

export const getBlogPostBySlug = async ({
  slug,
  components,
}: {
  slug: string;
  components: Record<string, ReactNode>;
}): Promise<BlogPost> => {
  const filepath = join(postsDirectory, slug, "index.mdx");
  const fileContent = await fs.readFile(filepath, "utf-8");

  const content = await renderToString(fileContent, {
    components,
    mdxOptions: {
      remarkPlugins: [RemarkEmojiPlugin],
    },
  });
  return { slug, content };
};
