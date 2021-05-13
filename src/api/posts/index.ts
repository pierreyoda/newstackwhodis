import { join } from "path";
import { promises as fs } from "fs";
import RemarkEmojiPlugin from "remark-emoji";
import { UserConfigSettings } from "shiki-twoslash";
import RemarkShikiTwoslash from "remark-shiki-twoslash";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { ReactNode } from "react";

const postsDirectory = join(process.cwd(), "./posts/");

export const getBlogPostsSlugs = async (): Promise<string[]> => fs.readdir(postsDirectory);

export type BlogPostRenderedContent = MDXRemoteSerializeResult;

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

  const content = await serialize(fileContent, {
    scope: components,
    mdxOptions: {
      remarkPlugins: [
        RemarkEmojiPlugin,
        [RemarkShikiTwoslash, { theme: "dark-plus" } as UserConfigSettings],
      ],
    },
  });
  return { slug, content };
};
