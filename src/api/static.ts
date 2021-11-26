import { emojify } from "node-emoji";

import type { RepositoriesData } from "./fetcher";
import GithubPublicRepositoriesMeta from "../../static/projects/public_repositories.json";

export const parsedRepositoriesData = (): RepositoriesData => {
  const { metadata, githubRepositories }: RepositoriesData = GithubPublicRepositoriesMeta;
  return {
    metadata,
    githubRepositories: githubRepositories.map(({ name, description, ...meta }) => ({
      name: emojify(name),
      description: description ? emojify(description) : null,
      ...meta,
    })),
  };
};
