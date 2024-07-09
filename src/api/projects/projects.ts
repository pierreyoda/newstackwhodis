import * as nodeEmojiPkg from "node-emoji";
const { emojify } = nodeEmojiPkg;

import type { RepositoriesData } from "../github-fetcher";
import GithubPublicRepositoriesMeta from "./public_repositories.json";

export const parsedRepositoriesData = (): RepositoriesData => {
  const { metadata, githubRepositories } = GithubPublicRepositoriesMeta as RepositoriesData;
  return {
    metadata,
    githubRepositories: githubRepositories.map(({ name, description, ...meta }) => ({
      name: emojify(name),
      description: description ? emojify(description) : null,
      ...meta,
    })),
  };
};

