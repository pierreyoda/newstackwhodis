import { join } from "path";
import { promises as fs } from "fs";

export interface GithubProject {
  url: string;
  name: string;
  fullName: string;
  forksCount: number;
  stargazersCount: number;
  description: string | null;
}

export interface RepositoriesData {
  metadata: {
    /** ISO-8601 */
    exportDate: string;
  };
  githubRepositories: GithubProject[];
}

let cachedRepositoriesData: Readonly<RepositoriesData> | undefined;
export const parsedRepositoriesData = async (): Promise<Readonly<RepositoriesData>> => {
  if (cachedRepositoriesData) {
    return cachedRepositoriesData;
  }

  const filepath = join(process.cwd(), "./projects/public_repositories.json");
  const filedata = await fs.readFile(filepath);

  cachedRepositoriesData = JSON.parse(filedata.toString());

  return cachedRepositoriesData!;
};
