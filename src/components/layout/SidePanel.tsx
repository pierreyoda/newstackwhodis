import { FunctionComponent } from "react";
import tw from "twin.macro";

import { siteName, copyrightNotice } from "@/content/branding";

export const sidePanelSelectableCategories = [
  "article",
  "project",
  "about",
] as const;
export type SidePanelSelectableCategory = typeof sidePanelSelectableCategories[number];

const categoriesLabels: Record<SidePanelSelectableCategory, string> = {
  article: "Posts",
  project: "Projects",
  about: "About Me",
};

interface SidePanelProps {
  selected: SidePanelSelectableCategory | null,
  onSelectedChange: (selected: SidePanelSelectableCategory | null) => void;
}

const SidePanel: FunctionComponent<SidePanelProps> = ({
  selected,
  onSelectedChange,
}) => (
  <div tw="w-1/3 bg-black text-white flex flex-col p-3 md:p-12">
    <div tw="flex">
      <h2 tw="text-3xl">{siteName}</h2>
    </div>
    <div tw="flex-grow">
      {sidePanelSelectableCategories.map(category => (
        <div key={category} onClick={() => onSelectedChange(category)} css={[
          tw`text-white cursor-pointer hover:text-lychee`,
          category === selected && tw`text-lychee`,
        ]}>
          {categoriesLabels[category]}
        </div>
      ))}
    </div>
    <footer css="flex items-center justify-center text-sm text-gray-200">
      <span>{copyrightNotice}</span>
    </footer>
  </div>
);

export default SidePanel;
