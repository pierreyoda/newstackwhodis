import { FunctionComponent, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { SidePanelSelectableCategory } from "./SidePanel";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  linkType: "internal" | "github";
  category: SidePanelSelectableCategory;
}

const ContentItemContainer = styled.div(({ highlighted }: {
  highlighted: boolean;
}) => [
  tw`border border-black rounded md:rounded-lg bg-space`,
  highlighted && tw`border-lychee`,
]);

interface ContentPanelProps {
  content: readonly ContentItem[],
  highlightContentCategory: SidePanelSelectableCategory | null;
}

type InternalContentItem = ContentItem & {
  highlighted: boolean;
}

const ContentPanel: FunctionComponent<ContentPanelProps> = ({
  content,
  highlightContentCategory,
}) => {
  const processedContent = useMemo<readonly InternalContentItem[]>(
    () => content.map(item => ({
        ...item,
        highlighted: item.category === highlightContentCategory,
      })),
    [],
  );

  return (
    <div tw="grid md:grid-cols-3 gap-4">
      {processedContent.map(({ id, highlighted, ...item }) => (
        <ContentItemContainer key={id} highlighted={highlighted}>

        </ContentItemContainer>
      ))}
    </div>
  );
};

export default ContentPanel;
