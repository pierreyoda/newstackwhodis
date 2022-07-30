import type { RequestHandler } from "@sveltejs/kit";

import { isDefined } from "../../utils";
import { getBlogPostMetaBySlug, getBlogPostsSlugs } from "../../api/posts";

export const GET: RequestHandler = async () => {
  try {
    const slugs: readonly string[] = await getBlogPostsSlugs();
    const postsMeta = (await Promise.all(slugs.map(slug => getBlogPostMetaBySlug({ slug }))))
      .filter(isDefined)
      .filter(meta => meta?.published)
      .sort((a, b) => b.date.localeCompare(a.date));
    return {
      body: {
        postsMeta: JSON.stringify(postsMeta),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
    };
  }
};
