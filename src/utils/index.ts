export type PartiallyRequired<T extends Record<string, any>, K extends keyof T> = T & {
  [P in K]-?: Exclude<T[], null>;
};
