/* eslint-disable global-require */

module.exports = {
  mode: "jit",
  purge: ["./src/components/**/*.tsx", "./src/layouts/**/*.tsx", "./src/pages/**/*.tsx"],
  darkMode: "media",
  theme: {
    colors: {
      black: {
        DEFAULT: "#141416",
        lighter: "#2B2B2D",
      },
      gray: "#333238",
      space: "#2A2B58",
      lychee: "#E04F4F",
      velvet: "#2D0607",
      "space-blue": "#1B21DD",
      "pale-red": "#D07869",
      yellow: "#F9F871",
      orange: "#F9B163",
      white: "#FFFFFF",
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
