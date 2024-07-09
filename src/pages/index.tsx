import { NextPage } from "next";

import { parsedRepositoriesData } from "@/api/projects/projects";
import { ProjectsPanel } from "@/components/ProjectsPanel";

const { githubRepositories } = parsedRepositoriesData();

// TODO: highlighted projects by selected tag
const Home: NextPage = () => (
  <div className="flex flex-col">
    <h1 className="mb-4 text-4xl font-bold md:mb-12">Personal Projects</h1>
    <ProjectsPanel content={githubRepositories} />
  </div>
);

export default Home;
