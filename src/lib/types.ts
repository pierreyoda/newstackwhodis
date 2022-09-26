export const navigationSelectableCategories = ["projects", "blog", "about"] as const;
export type NavigationSelectableCategory = typeof navigationSelectableCategories[number];
