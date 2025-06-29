import { FunctionComponent } from "react";
import { ProjectTagType } from "@/api/github/project-tags";
import { SortingProjectTag } from "./ProjectSortingTag";

interface ProjectSortingTagContainerProps {
  /** Invariant: unique tags. */
  selectedTags: readonly ProjectTagType[];
  onSelectedTagToggled: (tag: ProjectTagType) => void;
}

export const SortingProjectTagsContainer: FunctionComponent<ProjectSortingTagContainerProps> = ({
  selectedTags,
  onSelectedTagToggled,
}) => {
  return (
    <div className="grid grid-rows-4 md:grid-rows-8">
      {selectedTags.map(tag => (
        <SortingProjectTag key={tag} tag={tag} enabled={selectedTags.includes(tag)} onToggle={onSelectedTagToggled}>
          {tag}
        </SortingProjectTag>
      ))}
    </div>
  );
};
