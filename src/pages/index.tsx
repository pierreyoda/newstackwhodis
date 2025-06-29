import { NextPage } from "next";

import { ProjectsPanel } from "@/components/home/ProjectsPanel";
import { parsedRepositoriesData } from "@/api/projects/projects";

const { githubRepositories } = parsedRepositoriesData();

// TODO: highlighted projects by selected tag
const Home: NextPage = () => (
  <div className="flex flex-col">
    <h1 className="mp-12 mb-6 text-4xl font-bold">Personal Projects</h1>
    <ProjectsPanel content={githubRepositories} />
  </div>
);

export default Home;
