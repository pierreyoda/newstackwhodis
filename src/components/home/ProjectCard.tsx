import { FunctionComponent, useMemo } from "react";

import { ExternalLink } from "../ExternalLink";
import { GithubWhiteListedRepository } from "@/api/github/whitelist";
import { ProjectTagType, tagsPerProject } from "@/api/github/project-tags";
import { ProjectTag } from "./ProjectTag";

export interface ProjectMeta {
  type: "github";
  url: string;
  title: string;
  githubFullName: GithubWhiteListedRepository;
  description: string;
  githubForksCount: number;
  githubStars: number;
  tags: readonly ProjectTagType[];
  /** If defined, link title to this URL. */
  href?: string;
}

interface ProjectCardProps {
  meta: ProjectMeta;
}

export const ProjectCard: FunctionComponent<ProjectCardProps> = ({ meta }) => (
  <div className="border-gray-lighter flex flex-col items-start justify-around border p-3 md:rounded-lg">
    {meta.href ? (
      <ExternalLink href={meta.href}>
        <h2 className="border-lychee border-b-2 text-lg font-bold">{meta.title}</h2>
      </ExternalLink>
    ) : (
      <h2 className="border-lychee border-b-2 text-lg font-bold">{meta.title}</h2>
    )}
    <p className="py-5 text-sm">{meta.description}</p>
    <div className="flex w-full flex-wrap items-center py-2">
      {meta.tags.map(tag => (
        <ProjectTag key={tag} tag={tag} className="mr-2 last:mr-0" />
      ))}
    </div>
    <div className="flex w-full items-center justify-between text-sm">
      <div className="hover:text-lychee rounded-sm font-bold">
        <ExternalLink href={meta.url}>View on GitHub</ExternalLink>
      </div>
      <div className="flex items-center font-semibold">
        {meta.githubForksCount > 0 && (
          <p className="text-orange mr-4">
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
