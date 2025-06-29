import { FunctionComponent } from "react";

import { ProjectTagType } from "@/api/github/project-tags";
import { SortingProjectTag, SortingProjectTagProps } from "./ProjectSortingTag";

export interface ProjectSortingTagContainerProps {
  /** Invariant: unique tags. */
  selectedTags: readonly ProjectTagType[];
  onSelectedTagToggled: (tag: ProjectTagType, enabled: boolean) => void;
}

export const SortingProjectTagsContainer: FunctionComponent<ProjectSortingTagContainerProps> = ({
  selectedTags,
  onSelectedTagToggled,
}) => (
  <div className="grid grid-rows-4 md:grid-rows-8">
    {selectedTags.map(tag => (
      <SortingProjectTag
        key={tag}
        tag={tag}
        selected={selectedTags.includes(tag)}
        onToggle={selected => onSelectedTagToggled(tag, selected)}
      >
        {tag}
      </SortingProjectTag>
    ))}
  </div>
);
