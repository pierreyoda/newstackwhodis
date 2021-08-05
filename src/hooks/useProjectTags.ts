import { useMemo } from "react";

import { ProjectTagType, tagsPerProject } from "@/api/github/project-tags";
import { GithubWhiteListedRepository } from "@/api/github/whitelist";

export const useProjectTags = (projectFullName: string): readonly ProjectTagType[] => {
  const tags = useMemo(() => tagsPerProject[projectFullName as GithubWhiteListedRepository] ?? [], [projectFullName]);

  return tags;
};
