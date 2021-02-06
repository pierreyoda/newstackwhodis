import { join } from "path";
import debugLib from "debug";
import { promises as fs } from "fs";
import _orderBy from "lodash.orderby";
import { config as dotEnvConfig } from "dotenv";

import { fetchOwnPublicRepositoriesList } from "./fetcher";

dotEnvConfig();
const debug = debugLib("praca:website:fetcher:github");

const main = async () => {
  debug("Running GitHub fetcher...");

  // Preparation
  const outputFolder = join(process.cwd(), "./projects/github/");

  // Fetch repositories list & metadata
  debug("> Fetching GitHub public repositories...");
  const githubReposMeta = await fetchOwnPublicRepositoriesList();
  debug(`>> Found ${githubReposMeta.length} public repositories!`);

  // Transform
  const repositoriesData = _orderBy(githubReposMeta.map(({
    url,
    name,
    full_name,
    description,
    stargazers_count,
  }) => ({
    url,
    name,
    full_name,
    description,
    stargazers_count,
  })), repository => repository.stargazers_count, "desc");

  // Output
  const outputFilepath = join(outputFolder, "./public_repositories.json");
  const repositoriesDataJson = JSON.stringify(repositoriesData, null, 2);
  await fs.writeFile(outputFilepath, repositoriesDataJson);
  debug("> Done!");
};

main();
