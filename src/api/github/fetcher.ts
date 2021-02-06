import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  timeZone: "Europe/Paris",
});

export const fetchOwnPublicRepositoriesList = async (
): Promise<RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"]> =>
  (await octokit.repos.listForUser({
    username: "pierreyoda",
  })).data.filter(({ private: isPrivate }) => !isPrivate);
