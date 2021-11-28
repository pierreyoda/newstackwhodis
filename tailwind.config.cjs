/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.svelte", "./src/**/*.svelte.md", "./src/**/*.html"],
  darkMode: "media",
  theme: {
    colors: {
      black: {
        lighter: "#2B2B2D",
        DEFAULT: "#141416",
        darker: "#0E0E14",
      },
      gray: {
        lighter: "#99989D",
        DEFAULT: "#333238",
      },
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
