import { selectGithubProjects } from "@/store";
import { FunctionComponent, useMemo } from "react";
import { useSelector } from "react-redux";
import tw, { styled } from "twin.macro";

import { SidePanelSelectableCategory } from "./SidePanel";

export interface ContentItem {
  href: string;
  title: string;
  description: string;
  highlighted: boolean;
  category: SidePanelSelectableCategory;
  linkType: "internal" | "github";
}

const ContentItemContainer = styled.div(({ highlighted }: {
  highlighted: boolean;
}) => [
  tw`flex flex-col items-start p-3`,
  tw`border border-black rounded bg-velvet md:rounded-lg`,
  highlighted && tw`border-black`,
]);

interface ContentPanelProps {
  highlightContentCategory: SidePanelSelectableCategory | null;
}

const ContentPanel: FunctionComponent<ContentPanelProps> = ({
  highlightContentCategory,
}) => {
  // Content gathering and processing
  const githubContent = useSelector(selectGithubProjects) ?? [];
  const content = useMemo<readonly ContentItem[]>(
    () => githubContent.map(rawItem => ({
      href: rawItem.url,
      title: rawItem.name,
      description: rawItem.description,
      highlighted: highlightContentCategory === "project",
      category: "project",
      linkType: "github",
    })),
    [githubContent, highlightContentCategory],
  );

  // Content rendering
  return (
    <div tw="grid md:grid-cols-3 gap-4 p-3 md:pl-10">
      {content.map(({ href, highlighted, title, description }) => (
        <ContentItemContainer key={href} highlighted={highlighted}>
          <h3 tw="text-lg text-gray-200 border-b-2 border-gray-200">{title}</h3>
          <p tw="text-base text-white">{description}</p>
        </ContentItemContainer>
      ))}
    </div>
  );
};

export default ContentPanel;
