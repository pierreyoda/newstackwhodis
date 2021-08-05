import clsx from "clsx";
import { FunctionComponent } from "react";

import { ProjectTagType } from "@/api/github/project-tags";

interface ProjectTagProps {
  tag: ProjectTagType;
  className?: string;
}

const backgroundColorByTag: Record<ProjectTagType, string> = {
  "C#": "#aaffaa",
  "C++": "#ffffff",
  Java: "#ffaaaa",
  Rust: "#ef3300",
  React: "#61dafb",
  "Vue.js": "#42b983",
  Unity3D: "#ccffcc",
  Typescript: "#3178c6",
};

export const ProjectTag: FunctionComponent<ProjectTagProps> = ({ tag, className }) => (
  <div
    style={{ backgroundColor: backgroundColorByTag[tag] }}
    className={clsx("px-2 py-1 rounded-md font-medium text-xs", className)}
  >
    {tag}
  </div>
);
