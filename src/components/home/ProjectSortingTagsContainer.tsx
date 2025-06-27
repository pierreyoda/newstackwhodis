import { FunctionComponent } from "react";
import { ProjectTagType } from "@/api/github/project-tags";
import { SortingProjectTag } from "./ProjectSortingTag";

interface ProjectSortingTagContainerProps {
  projectsTags: readonly ProjectTagType[];
  onTagToggled: (tag: ProjectTagType) => void;
}

export const SortingProjectTagsContainer: FunctionComponent<ProjectSortingTagContainerProps> = ({
  projectsTags,
  onTagToggled,
}) => (
  <div className="flex justify-between">
    {projectsTags.map(tag => (
      <SortingProjectTag tag={tag} onToggle={onTagToggled} />
    ))}
  </div>
);
