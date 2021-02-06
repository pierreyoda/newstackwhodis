import { NextPage } from "next";

import {
  parsedGithubPublicRepositories,
} from "@/api/github/static";
import { loadGithubProjects, storeWrapper } from "@/store";

const Home: NextPage = () => (
  <div>
  </div>
);

export const getStaticProps = storeWrapper.getStaticProps(store => async () => {
  const githubProjects = await parsedGithubPublicRepositories();
  store.dispatch(loadGithubProjects(githubProjects));
  return { props: {} };
});

export default Home;
