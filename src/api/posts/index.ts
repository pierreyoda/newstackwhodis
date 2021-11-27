import { join } from "path";
import { promises as fs } from "fs";
import { compile } from "mdsvex";
import remarkEmoji from "remark-emoji";

const postsDirectory = join(process.cwd(), "./src/routes/blog/");

export const getBlogPostsSlugs = async (): Promise<string[]> => fs.readdir(postsDirectory);

export interface BlogPost {
  slug: string;
  code: string;
}

export const getBlogPostBySlug = async ({ slug }: { slug: string }): Promise<BlogPost> => {
  const filepath = join(postsDirectory, slug, "index.svelte.md");
  const fileContent = await fs.readFile(filepath, "utf-8");

  const { code } = await compile(fileContent, {
    remarkPlugins: [remarkEmoji],
  });
  return { slug, code };
};
