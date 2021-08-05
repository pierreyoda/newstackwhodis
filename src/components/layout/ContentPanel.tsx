import { FunctionComponent, useMemo } from "react";

import { GithubRepositoryMeta } from "@/api/fetcher";
import { SidePanelSelectableCategory } from "./Navbar";
import { ProjectCard, ProjectMeta } from "./ProjectCard";

export type GithubProjectMeta = GithubRepositoryMeta & {
  blogPostSlug: string | null;
};

interface ContentPanelProps {
  githubProjects: readonly GithubProjectMeta[];
  highlightContentCategory: SidePanelSelectableCategory | null;
}

const ContentPanel: FunctionComponent<ContentPanelProps> = ({ githubProjects, highlightContentCategory }) => {
  // Content gathering and processing
  const content = useMemo<ProjectMeta[]>(
    () =>
      githubProjects.map(rawItem => ({
        type: "github",
        url: rawItem.url,
        title: rawItem.name,
        githubFullName: rawItem.fullName,
        description: rawItem.description ?? "",
        githubForksCount: rawItem.forksCount,
        githubStars: rawItem.stargazersCount ?? 0,
        blogPostSlug: rawItem.blogPostSlug,
      })),
    [githubProjects],
  );

  const highlighted = highlightContentCategory === "projects";

  // Content rendering
  return (
    <div className="grid gap-4 pb-4 md:grid-cols-3">
      {content.map(projectMeta => (
        <ProjectCard key={projectMeta.githubFullName} highlighted={highlighted} projectMeta={projectMeta} />
      ))}
    </div>
  );
};

export default ContentPanel;
