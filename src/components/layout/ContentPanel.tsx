import { FunctionComponent, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";

import { GithubRepositoryMeta } from "@/api/fetcher";
import { SidePanelSelectableCategory } from "./Navbar";

const ContentItemContainer: FunctionComponent<{ highlighted: boolean }> = ({ highlighted, children }) => (
  <div
    className={clsx(
      "flex flex-col items-start justify-around p-3 border border-black rounded bg-gray md:rounded-lg",
      highlighted && "border-gray",
    )}
  >
    {children}
  </div>
);

export type GithubProjectMeta = GithubRepositoryMeta & {
  blogPostSlug: string | null;
};

interface ContentPanelProps {
  githubProjects: readonly GithubProjectMeta[];
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
        blogPostSlug: rawItem.blogPostSlug,
      })),
    [githubProjects, highlightContentCategory],
  );

  // Content rendering
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {content.map(({ href, highlighted, title, description, githubStars, forksCount, blogPostSlug }) => (
        <ContentItemContainer key={href} highlighted={highlighted}>
          <h3
            className={clsx(
              "text-lg font-bold text-white border-b-2 border-lychee",
              blogPostSlug && "hover:text-lychee",
            )}
          >
            {blogPostSlug ? <Link href={`/blog/${blogPostSlug}`}>{title}</Link> : title}
          </h3>
          <p className="py-3 text-sm text-white">{description}</p>
          <div className="flex items-center justify-between w-full text-sm">
            <div className="text-white rounded">
              <Link passHref href={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-lychee">
                  View on Github
                </a>
              </Link>
            </div>
            <div className="flex items-center font-semibold">
              {forksCount > 0 && (
                <p className="mr-4 text-orange">
                  {forksCount} fork{forksCount > 1 ? "s" : ""}
                </p>
              )}
              {githubStars > 0 && (
                <p className="text-yellow">
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
