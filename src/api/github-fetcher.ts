/* eslint-disable camelcase */

import { join } from "path";
import { promises as fs } from "fs";
import _orderBy from "lodash.orderby";

import { instantiateLogger } from "./utils";
import { GithubWhiteListedRepository } from "./github/whitelist";
import { fetchOwnPublicRepositoriesList, filteredOwnPublicRepositoriesList } from "./github";

const { info, success } = instantiateLogger("content:fetcher");

export interface GithubRepositoryMeta {
  url: string;
  name: string;
  fullName: GithubWhiteListedRepository;
  description: string | null;
  stargazersCount: number;
  forksCount: number;
}

export interface RepositoriesData {
  metadata: {
    /** ISO-8601 */
    exportDate: string;
  };
  githubRepositories: GithubRepositoryMeta[];
}

const main = async () => {
  const outputFolder = join(process.cwd(), "./src/api/projects/");
  info("Running content fetcher...");

  // Fetch repositories list and metadata
  info("> Fetching GitHub public repositories...");
  const githubRepositoriesMeta = await fetchOwnPublicRepositoriesList();
  success(`>> Found ${githubRepositoriesMeta.length} public repositories!`);

  // Transform and sort
  const keptGithubRepositoriesMeta = filteredOwnPublicRepositoriesList(githubRepositoriesMeta);
  info(`> Kept ${keptGithubRepositoriesMeta.length} GitHub public repositories...`);

  const githubRepositories = _orderBy(
    keptGithubRepositoriesMeta.map(
      ({ html_url, name, full_name, description, forks_count, stargazers_count }): GithubRepositoryMeta => ({
        url: html_url,
        name,
        description,
        fullName: full_name as GithubWhiteListedRepository,
        forksCount: forks_count ?? 0,
        stargazersCount: stargazers_count ?? 0,
      }),
    ),
    repository => repository.stargazersCount,
    "desc",
  );

  // Output
  info("Writing to file...");
  const output: RepositoriesData = {
    metadata: {
      exportDate: new Date().toISOString(),
    },
    githubRepositories,
  };

  const outputFilepath = join(outputFolder, "./public_repositories.json");
  const repositoriesDataJson = JSON.stringify(output, null, 2);
  await fs.writeFile(outputFilepath, `${repositoriesDataJson}\n`);
  success("> Done!");
};

main();
