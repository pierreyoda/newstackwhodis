import clsx from "clsx";
import { FunctionComponent } from "react";

import { ProjectTagType } from "@/api/github/project-tags";

interface SortingProjectTagProps {
  tag: ProjectTagType;
  onToggle: (tag: ProjectTagType) => void;
  className?: string;
}

export const SortingProjectTag: FunctionComponent<SortingProjectTagProps> = ({ tag, onToggle, className }) => {
  return (
    <button className={clsx("bg-space h-8 rounded-sm", className)} onClick={_ => onToggle(tag)}>
      {tag}
    </button>
  );
};
