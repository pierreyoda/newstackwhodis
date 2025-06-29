import clsx from "clsx";
import { FunctionComponent, ReactNode, useMemo } from "react";

import { colorsPerTag } from "./constants";
import { ProjectTagType } from "@/api/github/project-tags";

export interface SortingProjectTagProps {
  tag: ProjectTagType;
  selected: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
  children: ReactNode;
}

export const SortingProjectTag: FunctionComponent<SortingProjectTagProps> = ({
  tag,
  selected,
  onToggle,
  className,
  children,
}) => {
  const color = useMemo(() => colorsPerTag[tag], [tag]);
  return (
    <button
      className={clsx("bg-space h-8 rounded-sm", className)}
      style={{ backgroundColor: color }}
      onClick={_ => onToggle(!selected)}
    >
      {children}
    </button>
  );
};
