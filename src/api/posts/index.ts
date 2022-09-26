import { join } from "path";
import { promises as fs } from "fs";
import { compile } from "mdsvex";
import remarkEmoji from "remark-emoji";

const postsDirectory = join(process.cwd(), "./src/routes/blog/");

export const getBlogPostsSlugs = async (): Promise<string[]> =>
  (await fs.readdir(postsDirectory, { withFileTypes: true }))
    .filter(fileOrDirectory => fileOrDirectory.isDirectory() && fileOrDirectory.name !== "about")
    .map(({ name }) => name);

/**
 * FrontMatter metadata.
 */
export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** Format: YYYY-MM-DD */
  date: string;
  published?: boolean;
}

export const getBlogPostMetaBySlug = async ({ slug }: { slug: string }): Promise<BlogPostMeta | null> => {
  try {
    const filepath = join(postsDirectory, slug, "+page.svelte.md");
    const fileContent = await fs.readFile(filepath, "utf-8");
    const compilationResult = await compile(fileContent, {
      remarkPlugins: [remarkEmoji],
    });
    console.log("r", compilationResult)
    return compilationResult?.data?.fm
      ? {
          ...(compilationResult?.data?.fm as BlogPostMeta),
          slug,
        }
      : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
