import { useContext } from "react";
import { GetStaticProps, NextPage } from "next";

import { RepositoriesData } from "@/api/fetcher";
import { parsedRepositoriesData } from "@/api/static";
import { MainLayoutContext } from "@/layouts/MainLayout";
import ContentPanel from "@/components/layout/ContentPanel";

interface HomePageProps {
  repositoriesData: RepositoriesData;
}

const HomePage: NextPage<HomePageProps> = ({ repositoriesData: { githubRepositories } }) => {
  const { selectedCategory } = useContext(MainLayoutContext);

  return (
    <div className="flex flex-col px-2 md:px-8">
      <h1 className="mb-4 text-4xl font-bold md:mb-12">Personal Projects</h1>
      <ContentPanel githubProjects={githubRepositories} highlightContentCategory={selectedCategory} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => ({
  props: {
    repositoriesData: parsedRepositoriesData(),
  },
});

export default HomePage;
