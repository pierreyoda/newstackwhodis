export type PartiallyRequired<T extends Record<string, any>, K extends keyof T> = T & {
  [P in K]-?: Exclude<T[], null>;
};

export type Promised<T> = T extends PromiseLike<infer U> ? U : T;
