import { FunctionComponent, useCallback, useMemo, useState } from "react";

import { HNCLI_WEBSITE_URL } from "@/content/constants";
import { ProjectCard, ProjectMeta } from "./ProjectCard";
import { GithubRepositoryMeta } from "@/api/github-fetcher";
import { SortingProjectTagsContainer } from "./ProjectSortingTagsContainer";
import { PROJECT_TAGS, ProjectTagType, tagsPerProject } from "@/api/github/project-tags";
import { SortingProjectTagProps } from "./ProjectSortingTag";
import { ProjectTag } from "./ProjectTag";

type TaggedGithubRepositoryMeta = GithubRepositoryMeta & { tags: readonly ProjectTagType[] };

interface ProjectsPanelProps {
  /** Sorted by GitHub stars count. */
  content: readonly GithubRepositoryMeta[];
}

export const ProjectsPanel: FunctionComponent<ProjectsPanelProps> = ({ content }) => {
  const projects = useMemo<readonly ProjectMeta[]>(
    () =>
      content.map(meta => ({
        type: "github",
        url: meta.url,
        title: meta.name,
        githubFullName: meta.fullName,
        description: meta.description ?? "",
        githubForksCount: meta.forksCount,
        githubStars: meta.stargazersCount ?? 0,
        tags: tagsPerProject[meta.fullName],
        blogPostSlug: null,
        href: meta.name === "hncli" ? HNCLI_WEBSITE_URL : undefined,
      })),
    [content],
  );

  const [selectedProjectTags, setSelectedProjectTags] = useState<readonly ProjectTagType[]>(PROJECT_TAGS);
  const onSelectedTagToggled = (tag: ProjectTagType, enabled: boolean) => {
    setSelectedProjectTags(tags) => {
      const set = new Set([...tags]);
      if (enabled) {
        set.add(tag);
      } else {
        set.delete(tag);
      }
      return set;
    };
  }

  const filteredProjects = useMemo(
    () => projects.filter(({ tags }) => tags.some(tag => selectedProjectTags.includes(tag))),
    [projects, selectedProjectTags],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SortingProjectTagsContainer selectedTags={selectedProjectTags} onSelectedTagToggled={onSelectedTagToggled} />
      {filteredProjects.map(meta => (
        <ProjectCard key={meta.title} meta={meta} />
      ))}
    </div>
  );
};
