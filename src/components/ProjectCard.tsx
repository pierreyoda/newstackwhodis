import { FunctionComponent, useMemo } from "react";

import { ProjectTag } from "./ProjectTag";
import { ExternalLink } from "./ExternalLink";
import { GithubWhiteListedRepository } from "@/api/github/whitelist";
import { ProjectTagType, tagsPerProject } from "@/api/github/project-tags";

export interface ProjectMeta {
  type: "github";
  url: string;
  title: string;
  githubFullName: GithubWhiteListedRepository;
  description: string;
  githubForksCount: number;
  githubStars: number;
  /** If defined, link title to this URL. */
  href?: string;
}

interface ProjectCardProps {
  meta: ProjectMeta;
}

export const ProjectCard: FunctionComponent<ProjectCardProps> = ({ meta }) => {
  const tags = useMemo<readonly ProjectTagType[]>(
    () => tagsPerProject[meta.githubFullName] ?? [],
    [meta.githubFullName],
  );
  return (
    <div className="flex flex-col items-start justify-around border border-gray-lighter p-3 md:rounded-lg">
      {meta.href ? (
        <ExternalLink href={meta.href}>
          <h2 className="border-b-2 border-lychee text-lg font-bold">{meta.title}</h2>
        </ExternalLink>
      ) : (
        <h2 className="border-b-2 border-lychee text-lg font-bold">{meta.title}</h2>
      )}
      <p className="py-5 text-sm">{meta.description}</p>
      <div className="flex w-full flex-wrap items-center py-2">
        {tags.map(tag => (
          <ProjectTag key={tag} tag={tag} className="mr-2 last:mr-0" />
        ))}
      </div>
      <div className="flex w-full items-center justify-between text-sm">
        <div className="rounded-sm font-bold hover:text-lychee">
          <ExternalLink href={meta.url}>View on GitHub</ExternalLink>
        </div>
        <div className="flex items-center font-semibold">
          {meta.githubForksCount > 0 && (
            <p className="mr-4 text-orange">
              {meta.githubForksCount} fork{meta.githubForksCount > 1 ? "s" : ""}
            </p>
          )}
          {meta.githubStars > 0 && (
            <p className="text-yellow">
              {meta.githubStars} star{meta.githubStars > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
