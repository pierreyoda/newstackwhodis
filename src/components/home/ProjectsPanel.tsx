import { FunctionComponent, useMemo } from "react";

import { HNCLI_WEBSITE_URL } from "@/content/constants";
import { ProjectCard, ProjectMeta } from "./ProjectCard";
import { GithubRepositoryMeta } from "@/api/github-fetcher";
import { GithubWhiteListedRepository } from "@/api/github/whitelist";

interface ProjectsPanelProps {
  content: readonly GithubRepositoryMeta[];
}

export const ProjectsPanel: FunctionComponent<ProjectsPanelProps> = ({ content }) => {
  const projects = useMemo<readonly ProjectMeta[]>(
    () =>
      content.map(meta => ({
        type: "github",
        url: meta.url,
        title: meta.name,
        githubFullName: meta.fullName as GithubWhiteListedRepository,
        description: meta.description ?? "",
        githubForksCount: meta.forksCount,
        githubStars: meta.stargazersCount ?? 0,
        blogPostSlug: null,
        href: meta.name === "hncli" ? HNCLI_WEBSITE_URL : undefined,
      })),
    [content],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {projects.map(meta => (
        <ProjectCard key={meta.title} meta={meta} />
      ))}
    </div>
  );
};
