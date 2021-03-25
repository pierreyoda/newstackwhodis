import { FunctionComponent, useMemo } from "react";
import tw, { styled } from "twin.macro";
import Link from "next/link";

import { GithubRepositoryMeta } from "@/api/fetcher";
import { SidePanelSelectableCategory } from "./SidePanel";

const ContentItemContainer = styled.div(({ highlighted }: { highlighted: boolean }) => [
  tw`flex flex-col items-start justify-around p-3`,
  tw`border border-black rounded bg-gray md:rounded-lg`,
  highlighted && tw`border-black`,
]);

interface ContentPanelProps {
  githubProjects: readonly GithubRepositoryMeta[];
  highlightContentCategory: SidePanelSelectableCategory | null;
}

const ContentPanel: FunctionComponent<ContentPanelProps> = ({ githubProjects, highlightContentCategory }) => {
  // Content gathering and processing
  const content = useMemo(
    () =>
      githubProjects.map(rawItem => ({
        href: rawItem.url,
        title: rawItem.name,
        description: rawItem.description ?? "",
        highlighted: highlightContentCategory === "projects",
        category: "projects",
        linkType: "github",
        forksCount: rawItem.forksCount,
        githubStars: rawItem.stargazersCount ?? 0,
      })),
    [githubProjects, highlightContentCategory],
  );

  // Content rendering
  return (
    <div tw="grid md:grid-cols-3 gap-4">
      {content.map(({ href, highlighted, title, description, githubStars, forksCount }) => (
        <ContentItemContainer key={href} highlighted={highlighted}>
          <h3 tw="text-lg text-white font-bold border-b-2 border-lychee">{title}</h3>
          <p tw="text-sm text-white py-3">{description}</p>
          <div tw="w-full flex items-center justify-between text-sm">
            <div tw="rounded text-white">
              <Link passHref href={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" tw="font-bold hover:text-lychee">
                  View on Github
                </a>
              </Link>
            </div>
            <div tw="flex items-center font-semibold">
              {forksCount > 0 && (
                <p tw="text-orange mr-4">
                  {forksCount} fork{forksCount > 1 ? "s" : ""}
                </p>
              )}
              {githubStars > 0 && (
                <p tw="text-yellow">
                  {githubStars} star{githubStars > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </ContentItemContainer>
      ))}
    </div>
  );
};

export default ContentPanel;
