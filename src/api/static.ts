import { emojify } from "node-emoji";

import { RepositoriesData } from "@/api/fetcher";
import GithubPublicRepositoriesMeta from "~/projects/public_repositories.json";

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
