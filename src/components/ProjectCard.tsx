import { FunctionComponent, useMemo } from "react";

import { Icon } from "./Icon";
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

const ProjectStat: FunctionComponent<{ icon: "star" | "fork"; count: number; unit: string }> = ({
  icon,
  count,
  unit,
}) => (
  <span className="flex items-center gap-1.5">
    <Icon name={icon} className={icon === "star" ? "text-yellow h-4 w-4" : "text-orange h-4 w-4"} />
    {count}
    <span className="sr-only">
      {unit}
      {count > 1 ? "s" : ""}
    </span>
  </span>
);

interface ProjectCardProps {
  meta: ProjectMeta;
}

/**
 * The whole card links to the project (its website if any, its GitHub repository otherwise):
 * the title link is stretched over it, below the GitHub link.
 */
export const ProjectCard: FunctionComponent<ProjectCardProps> = ({ meta }) => {
  const tags = useMemo<readonly ProjectTagType[]>(
    () => tagsPerProject[meta.githubFullName] ?? [],
    [meta.githubFullName],
  );
  return (
    <article className="group border-gray hover:border-gray-lighter/50 relative flex flex-col gap-5 rounded-lg border bg-black p-5 transition-colors">
      <div className="flex grow flex-col gap-3">
        <h2 className="flex items-center gap-1.5 text-lg font-bold text-white">
          <ExternalLink
            href={meta.href ?? meta.url}
            className="border-lychee focus-visible:after:outline-light-orange border-b-2 outline-none after:absolute after:inset-0 after:rounded-lg after:outline-offset-2 focus-visible:after:outline-2"
          >
            {meta.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </ExternalLink>
          <Icon
            name="arrow-up-right"
            className="text-gray-lighter group-hover:text-light-orange h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </h2>
        <p className="text-sm leading-6 text-white/80">{meta.description}</p>
        {tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-1">
            {tags.map(tag => (
              <li key={tag}>
                <ProjectTag tag={tag} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-gray flex items-center justify-between gap-4 border-t pt-4 text-sm">
        <ExternalLink
          href={meta.url}
          className="text-light-orange/70 hover:text-light-orange relative z-10 inline-flex items-center gap-1 font-semibold transition-colors"
        >
          View on GitHub
          <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </ExternalLink>
        <div className="text-gray-lighter flex items-center gap-4 tabular-nums">
          {meta.githubStars > 0 && <ProjectStat icon="star" count={meta.githubStars} unit="star" />}
          {meta.githubForksCount > 0 && <ProjectStat icon="fork" count={meta.githubForksCount} unit="fork" />}
        </div>
      </div>
    </article>
  );
};
