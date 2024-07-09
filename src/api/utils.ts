import chalk from "chalk";
import debugLib from "debug";

export type Logger = (logged: string) => void;
export type LoggerLevel = "warning" | "error" | "info" | "success";

export const instantiateLogger = (domain: string): Record<LoggerLevel, Logger> => {
  const debug = debugLib(`newstackwhodis:website:api:${domain}`);
  return {
    warning: (logged: string) => debug(chalk.yellow(logged)),
    error: (logged: string) => debug(chalk.redBright(logged)),
    info: (logged: string) => debug(chalk.blueBright(logged)),
    success: (logged: string) => debug(chalk.green(logged)),
  };
};
