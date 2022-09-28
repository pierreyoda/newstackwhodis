/* eslint-disable camelcase */

import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";

import { repositoriesWhiteList } from "./whitelist";

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  timeZone: "Europe/Paris",
});

type RawGithubRepositoryMeta = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

export const fetchOwnPublicRepositoriesList = async (): Promise<readonly RawGithubRepositoryMeta[]> =>
  (
    await octokit.repos.listForUser({
      username: "pierreyoda",
    })
  ).data.filter(({ private: isPrivate }) => !isPrivate);

export const filteredOwnPublicRepositoriesList = (
  repositories: readonly RawGithubRepositoryMeta[],
): readonly RawGithubRepositoryMeta[] =>
  repositories.filter(
    ({ owner, full_name }) =>
      owner && owner.login === "pierreyoda" && (repositoriesWhiteList as readonly string[]).includes(full_name),
  );
