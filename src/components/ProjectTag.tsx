import clsx from "clsx";
import { FunctionComponent } from "react";

import { ProjectTagType } from "@/api/github/project-tags";

interface ProjectTagProps {
  tag: ProjectTagType;
  className?: string;
}

export const ProjectTag: FunctionComponent<ProjectTagProps> = ({ tag, className }) => (
  <div className={clsx("project-tag", className)}>
    {tag}
  </div>
);
