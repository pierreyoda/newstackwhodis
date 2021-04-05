import { useContext } from "react";
import { GetStaticProps, NextPage } from "next";

import { getBlogPostsSlugs } from "@/api/posts";
import { parsedRepositoriesData } from "@/api/static";
import { MainLayoutContext } from "@/layouts/MainLayout";
import ContentPanel, { GithubProjectMeta } from "@/components/layout/ContentPanel";

interface HomePageProps {
  githubProjects: readonly GithubProjectMeta[];
}

const HomePage: NextPage<HomePageProps> = ({ githubProjects }) => {
  const { selectedCategory } = useContext(MainLayoutContext);

  return (
    <div className="flex flex-col px-2 md:px-8">
      <h1 className="mb-4 text-4xl font-bold md:mb-12">Personal Projects</h1>
      <ContentPanel githubProjects={githubProjects} highlightContentCategory={selectedCategory} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const postsSlugs = await getBlogPostsSlugs();
  const repositoriesData = await parsedRepositoriesData();
  return {
    props: {
      githubProjects: repositoriesData.githubRepositories.map(
        ({ name, ...meta }): GithubProjectMeta => ({
          name,
          ...meta,
          blogPostSlug: postsSlugs.find(slug => slug === `project-${name}`) ?? null,
        }),
      ),
    },
  };
};

export default HomePage;
