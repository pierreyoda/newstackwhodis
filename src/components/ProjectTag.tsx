import clsx from "clsx";
import { FunctionComponent } from "react";

import { ProjectTagType } from "@/api/github/project-tags";

interface ProjectTagProps {
  tag: ProjectTagType;
  className?: string;
}

export const ProjectTag: FunctionComponent<ProjectTagProps> = ({ tag, className }) => (
  <span className={clsx("bg-space block rounded-md px-2 py-0.5 text-xs font-semibold text-white", className)}>
    {tag}
  </span>
);
