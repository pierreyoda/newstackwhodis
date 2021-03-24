import { RepositoriesData } from "@/api/fetcher";
import GithubPublicRepositoriesMeta from "~/projects/public_repositories.json";

export const parsedRepositoriesData = (): RepositoriesData => GithubPublicRepositoriesMeta;
