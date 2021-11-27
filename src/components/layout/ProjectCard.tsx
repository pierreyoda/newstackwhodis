import clsx from "clsx";
import Link from "next/link";
import { FunctionComponent } from "react";

import { useProjectTags } from "@/hooks/useProjectTags";
import { ProjectTag } from "./ProjectTag";

export interface ProjectMeta {
  type: "github";
  url: string;
  title: string;
  githubFullName: string;
  description: string;
  githubForksCount: number;
  githubStars: number;
  blogPostSlug: string | null;
}

interface ProjectCardProps {
  highlighted: boolean;
  projectMeta: ProjectMeta;
}

export const ProjectCard: FunctionComponent<ProjectCardProps> = ({ highlighted, projectMeta }) => {
  const projectTags = useProjectTags(projectMeta.githubFullName);

  return (
    <div
      className={clsx(
        "flex flex-col items-start justify-around p-3 border border-black rounded bg-black-lighter md:rounded-lg",
        highlighted && "border-gray",
      )}
    >
      <h3
        className={clsx(
          "text-lg font-bold text-white border-b-2 border-lychee",
          projectMeta.blogPostSlug && "hover:text-lychee",
        )}
      >
        {projectMeta.blogPostSlug ? (
          <Link href={`/blog/${projectMeta.blogPostSlug}`}>{projectMeta.title}</Link>
        ) : (
          projectMeta.title
        )}
      </h3>
      <p className="pt-3 text-sm text-white">{projectMeta.description}</p>
      <div className="flex flex-wrap items-center w-full py-2">
        {projectTags.map(tag => (
          <ProjectTag key={tag} tag={tag} className="mr-2" />
        ))}
      </div>
      <div className="flex items-center justify-between w-full text-sm">
        <div className="text-white rounded">
          <Link passHref href={projectMeta.url}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a target="_blank" rel="noopener noreferrer" className="font-bold hover:text-lychee">
              View on Github
            </a>
          </Link>
        </div>
        <div className="flex items-center font-semibold">
          {projectMeta.githubForksCount > 0 && (
            <p className="mr-4 text-orange">
              {projectMeta.githubForksCount} fork{projectMeta.githubForksCount > 1 ? "s" : ""}
            </p>
          )}
          {projectMeta.githubStars > 0 && (
            <p className="text-yellow">
              {projectMeta.githubStars} star{projectMeta.githubStars > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
