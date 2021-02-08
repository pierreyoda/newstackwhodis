import { join } from "path";
import { promises as fs } from "fs";
import _orderBy from "lodash.orderby";
import { config as dotEnvConfig } from "dotenv";

import { instantiateLogger } from "./utils";
import { RepositoriesData } from "./static";
import {
  fetchOwnPublicRepositoriesList,
  filteredOwnPublicRepositoriesList,
} from "./github";

const { info, success } = instantiateLogger("content:fetcher");

const main = async () => {
  // Preparation
  info("Loading .env configuration...");
  dotEnvConfig();
  success("> Success!");

  const outputFolder = join(process.cwd(), "./projects/");
  info("Running content fetcher...");

  // Fetch repositories list and metadata
  info("> Fetching GitHub public repositories...");
  const githubRepositoriesMeta = await fetchOwnPublicRepositoriesList();
  success(`>> Found ${githubRepositoriesMeta.length} public repositories!`);

  // Transform and sort
  const keptGithubRepositoriesMeta = filteredOwnPublicRepositoriesList(githubRepositoriesMeta);
  info(`> Kept ${keptGithubRepositoriesMeta.length} GitHub public repositories...`);

  const githubRepositories = _orderBy(keptGithubRepositoriesMeta.map(({
    url,
    name,
    full_name,
    description,
    forks_count,
    stargazers_count,
  }) => ({
    url,
    name,
    description,
    fullName: full_name,
    forksCount: forks_count ?? 0,
    stargazersCount: stargazers_count ?? 0,
  })), repository => repository.stargazersCount, "desc");

  // Output
  info("Writting to file...");
  const output: RepositoriesData = {
    metadata: {
      exportDate: new Date().toISOString(),
    },
    githubRepositories,
  };

  const outputFilepath = join(outputFolder, "./public_repositories.json");
  const repositoriesDataJson = JSON.stringify(output, null, 2);
  await fs.writeFile(outputFilepath, repositoriesDataJson);
  success("> Done!");
};

main();
