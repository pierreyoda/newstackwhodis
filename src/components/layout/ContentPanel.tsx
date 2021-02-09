import { FunctionComponent, useMemo } from "react";
import { useSelector } from "react-redux";
import tw, { styled } from "twin.macro";
import Link from "next/link";

import { selectGithubProjects } from "@/store";

import { SidePanelSelectableCategory } from "./SidePanel";

export interface ContentItem {
  href: string;
  title: string;
  description: string;
  highlighted: boolean;
  category: SidePanelSelectableCategory;
  linkType: "internal" | "github";
  githubStars?: number;
}

const ContentItemContainer = styled.div(({ highlighted }: {
  highlighted: boolean;
}) => [
  tw`flex flex-col items-start p-3 justify-around`,
  tw`border border-black rounded bg-lychee md:rounded-lg`,
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
      description: rawItem.description ?? "",
      highlighted: highlightContentCategory === "project",
      category: "project",
      linkType: "github",
      githubStars: rawItem.stargazersCount,
    })),
    [githubContent, highlightContentCategory],
  );

  // Content rendering
  return (
    <div tw="grid md:grid-cols-3 gap-4 p-3 md:pl-10">
      {content.map(({ href, highlighted, title, description, githubStars }) => (
        <ContentItemContainer key={href} highlighted={highlighted}>
          <h3 tw="text-lg text-white font-bold border-b-2 border-gray-200">{title}</h3>
          <p tw="text-sm text-gray-100">{description}</p>
          <div tw="w-full flex items-center justify-between text-sm">
            <div tw="rounded text-white">
              <Link passHref href={href}>
                <a target="_blank" rel="noopener noreferrer">
                  View on Github
                </a>
              </Link>
            </div>
            <div tw="text-yellow-400">
              {!!githubStars && <p>{githubStars} stars</p>}
            </div>
          </div>
        </ContentItemContainer>
      ))}
    </div>
  );
};

export default ContentPanel;
