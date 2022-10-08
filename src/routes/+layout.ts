import type { LayoutLoad } from "./$types";

import type { NavigationSelectableCategory } from "$lib/types";

export const csr = false;
export const prerender = true;

export const load: LayoutLoad = async ({ url }) => ({
  selectedCategory: ((): NavigationSelectableCategory =>
    url.pathname === "/blog/about" ? "about" : url.pathname.startsWith("/blog") ? "blog" : "projects")(),
});
