import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  timeZone: "Europe/Paris",
});

type GithubRepositoryMeta = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

export const fetchOwnPublicRepositoriesList = async (
): Promise<readonly GithubRepositoryMeta[]> =>
  (await octokit.repos.listForUser({
    username: "pierreyoda",
  })).data.filter(({ private: isPrivate }) => !isPrivate);

const repositoriesBlackList = [
  // Own website
  "pierreyoda/praca-website",
  // Forks
  "pierreyoda/good-first-issue",
  "pierreyoda/osgameclones",
  // Too unfinished
  "pierreyoda/advent-2020-ts",
  "pierreyoda/hacker-news-pwa",
  "pierreyoda/opensourcegames",
  // Too old and/or too unfinished
  "pierreyoda/7guis",
  "pierreyoda/open-advanced-war",
  "pierreyoda/praca_website",
  "pierreyoda/solar-rust",
  "pierreyoda/space-carrier",
];
export const filteredOwnPublicRepositoriesList = (
  repositories: readonly GithubRepositoryMeta[],
): readonly GithubRepositoryMeta[] => repositories.filter(({
  owner,
  full_name,
}) => owner && owner.login === "pierreyoda" && !repositoriesBlackList.includes(full_name));
