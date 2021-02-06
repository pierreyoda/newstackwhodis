import { join } from "path";
import { readFile } from "fs/promises";

export interface GithubProject {
  url: string;
  name: string;
  fullName: string;
  description: string;
  stargazersCount: string;
}

export interface PracaPageCommonStaticProps {
  projects: readonly Readonly<GithubProject>[];
}

let cachedGithubRepositories: readonly Readonly<GithubProject>[] | undefined = undefined;
export const parsedGithubPublicRepositories = async (
): Promise<readonly Readonly<GithubProject>[]> => {
  if (cachedGithubRepositories) { return cachedGithubRepositories; }

  const filepath = join(process.cwd(), "./projects/github/public_repositories.json");
  console.log(filepath)
  const filedata = await readFile(filepath);

  const rawRepositoriesList: readonly {
    url: string;
    name: string;
    full_name: string;
    description: string;
    stargazers_count: string;
  }[] = JSON.parse(filedata.toString());

  cachedGithubRepositories = rawRepositoriesList.map(({
    full_name,
    stargazers_count,
    ...others
  }) => ({
    ...others,
    fullName: full_name,
    stargazersCount: stargazers_count,
  }));

  return cachedGithubRepositories;
};
