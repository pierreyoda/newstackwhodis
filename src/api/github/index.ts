import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";

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

const repositoriesBlackList = [
  // Own website
  "pierreyoda/praca-website",
  // Forks
  "pierreyoda/good-first-issue",
  "pierreyoda/osgameclones",
  // Too unfinished
  "pierreyoda/advent-2019-rust",
  "pierreyoda/advent-2020-ts",
  "pierreyoda/advent-2020",
  "pierreyoda/hacker-news-pwa",
  // Forks
  "pierreyoda/opensourcegames",
  // Too old and/or too unfinished
  "pierreyoda/7guis",
  "pierreyoda/open-advanced-war",
  "pierreyoda/praca_website",
  "pierreyoda/solar-rust",
  "pierreyoda/space-carrier",
  // School stuff
  "pierreyoda/TwitterElectionResults",
];
export const filteredOwnPublicRepositoriesList = (
  repositories: readonly RawGithubRepositoryMeta[],
): readonly RawGithubRepositoryMeta[] =>
  repositories.filter(
    ({ owner, full_name }) => owner && owner.login === "pierreyoda" && !repositoriesBlackList.includes(full_name),
  );
