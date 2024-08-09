import { join } from "path";
import matter from "gray-matter";
import { promises as fs } from "fs";

import { isDefined } from "@/utils";

const postsDirectory = join(process.cwd(), "./src/pages/blog/");

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

export const getBlogPost = async (slug: string) => {
  const filepath = join(postsDirectory, `./${slug}/page.mdx`);
  const fileContent = await fs.readFile(filepath, "utf-8");
  return matter(fileContent).content;
};

export const getBlogPostsSlugs = async (): Promise<string[]> =>
  (await fs.readdir(postsDirectory, { withFileTypes: true }))
    .filter(
      fileOrDirectory =>
        fileOrDirectory.isFile() && fileOrDirectory.name.endsWith(".mdx") && fileOrDirectory.name !== "about.mdx",
    )
    .map(({ name }) => name.substring(0, name.length - 4));

type MetaFieldValidator = (v: string | boolean | null) => boolean;
const defaultMetaFieldValidator: MetaFieldValidator = v => typeof v === "string" && (v?.length ?? 0) > 0;
const DATE_VALIDATION_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const metaFieldsValidators: Record<keyof BlogPostMeta, (v: string | boolean | null) => boolean> = {
  slug: defaultMetaFieldValidator,
  title: defaultMetaFieldValidator,
  description: defaultMetaFieldValidator,
  date: v => typeof v === "string" && DATE_VALIDATION_REGEX.test(v),
  published: v => typeof v === "boolean",
};

export const getBlogPostsMeta = async (): Promise<BlogPostMeta[]> => {
  const postsSlugs = await getBlogPostsSlugs();
  return (
    await Promise.all(
      postsSlugs.map(async slug => {
        const filepath = join(postsDirectory, `./${slug}.mdx`);
        const raw = await fs.readFile(filepath, "utf-8");
        const rawMeta: Record<string, string | undefined> = matter(raw).data;
        try {
          const meta = Object.entries({ ...rawMeta, slug }).reduce((acc, [key, value]) => {
            if (!isDefined(value)) {
              throw new Error(`post meta field no value for "${key}", slug="${slug}"`);
            }
            if (!metaFieldsValidators[key as keyof BlogPostMeta](value)) {
              throw new Error(`post meta field validation failed for "${key}", slug="${slug}"`);
            }
            return { ...acc, [key]: value };
          }, {}) as BlogPostMeta;
          return meta.published ? meta : null;
        } catch (err) {
          throw new Error(`cannot GET list of posts' meta: ${err}`);
        }
      }),
    )
  )
    .filter(isDefined)
    .sort((a, b) => b.date.localeCompare(a.date));
};
