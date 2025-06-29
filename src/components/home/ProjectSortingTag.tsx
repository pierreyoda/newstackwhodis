import clsx from "clsx";
import { FunctionComponent, ReactNode, useMemo } from "react";

import { colorsPerTag } from "./constants";
import { ProjectTagType } from "@/api/github/project-tags";

interface SortingProjectTagProps {
  tag: ProjectTagType;
  enabled: boolean;
  onToggle: (tag: ProjectTagType, enabled: boolean) => void;
  className?: string;
  children: ReactNode;
}

export const SortingProjectTag: FunctionComponent<SortingProjectTagProps> = ({
  tag,
  enabled,
  onToggle,
  className,
  children,
}) => {
  const color = useMemo(() => colorsPerTag[tag], [tag]);
  return (
    <button
      className={clsx("bg-space h-8 rounded-sm", className)}
      style={{ backgroundColor: color }}
      onClick={_ => onToggle(tag, !enabled)}
    >
      {children}
    </button>
  );
};
