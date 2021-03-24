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

  return <ContentPanel githubProjects={githubRepositories} highlightContentCategory={selectedCategory} />;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => ({
  props: {
    repositoriesData: parsedRepositoriesData(),
  },
});

export default HomePage;
