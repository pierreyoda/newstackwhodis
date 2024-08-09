import type { GithubWhiteListedRepository } from "./whitelist";

export const projectTags = ["C#", "C++", "Java", "Rust", "React", "Vue.js", "Unity3D", "Typescript"] as const;
export type ProjectTagType = (typeof projectTags)[number];

export const tagsPerProject: Record<GithubWhiteListedRepository, readonly ProjectTagType[]> = {
  "pierreyoda/o2r": ["C++"],
  "pierreyoda/micropolis-rs": ["Rust", "Typescript", "React"],
  "pierreyoda/rust-neuralnet": ["Rust"],
  "pierreyoda/rustboycolor": ["Rust"],
  "pierreyoda/rust-chip8": ["Rust"],
  "pierreyoda/GameInc": ["C#", "Unity3D"],
  "pierreyoda/rust-mal": ["Rust"],
  "pierreyoda/hncli": ["Rust"],
  "pierreyoda/rust-lsystem": ["Rust"],
  "pierreyoda/lsystem-renderer": ["C++"],
  "pierreyoda/Tetris": ["Java"],
  "pierreyoda/vue-animations-test": ["Typescript", "Vue.js"],
};
