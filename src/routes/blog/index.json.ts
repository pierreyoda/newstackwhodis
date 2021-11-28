import type { RequestHandler } from "@sveltejs/kit";

import { getBlogPostMetaBySlug, getBlogPostsSlugs } from "../../api/posts";

export const get: RequestHandler = async () => {
  try {
    const slugs: readonly string[] = await getBlogPostsSlugs();
    const postsMeta = (await Promise.all(slugs.map(slug => getBlogPostMetaBySlug({ slug })))).filter(
      meta => meta?.published,
    );
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
