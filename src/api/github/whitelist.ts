export const repositoriesWhiteList = [
  "pierreyoda/o2r",
  "pierreyoda/micropolis-rs",
  "pierreyoda/rust-neuralnet",
  "pierreyoda/rustboycolor",
  "pierreyoda/rust-chip8",
  "pierreyoda/GameInc",
  "pierreyoda/rust-mal",
  "pierreyoda/hncli",
  "pierreyoda/rust-lsystem",
  "pierreyoda/lsystem-renderer",
  "pierreyoda/Tetris",
  "pierreyoda/vue-animations-test",
] as const;
export type GithubWhiteListedRepository = (typeof repositoriesWhiteList)[number];
