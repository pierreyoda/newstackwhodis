import type { RequestHandler } from "@sveltejs/kit";

import { getBlogPostBySlug } from "../../api/posts";

export const get: RequestHandler = async ({ params }) => {
  const { slug } = params;
  try {
    // TODO: better error handling
    const post = await getBlogPostBySlug({ slug });
    return {
      body: {
        slug: post.slug,
        code: post.code
      },
    }
  } catch (e) {
    console.error(e);
    return {
      status: 500
    }
  }
}
