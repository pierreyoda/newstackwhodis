import type { PageLoad } from "./$types";
import type { BlogPostMeta } from "../../api/posts";

export const load: PageLoad = async ({ fetch }) => {
  const { postsMeta } = await fetch("/blog.json").then(res => res.json());
  return {
    postsMeta: JSON.parse(postsMeta) as readonly BlogPostMeta[],
  };
};
