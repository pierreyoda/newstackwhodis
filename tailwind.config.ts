import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
  plugins: [require("@tailwindcss/typography")],
};

export default config;
