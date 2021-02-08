import { NextPage } from "next";

import { parsedRepositoriesData } from "@/api/static";
import { loadGithubProjects, storeWrapper } from "@/store";

const Home: NextPage = () => <div></div>;

export const getStaticProps = storeWrapper.getStaticProps(store => async () => {
  const {
    metadata: { exportDate },
    githubRepositories,
  } = await parsedRepositoriesData();
  store.dispatch(
    loadGithubProjects({
      fetchingDate: exportDate,
      githubProjects: githubRepositories,
    }),
  );
  return { props: {} };
});

export default Home;
