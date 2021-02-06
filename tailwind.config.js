module.exports = {
  purge: [
    "./components/**/*.tsx",
    "./layouts/**/*.tsx",
    "./pages/**/*.tsx",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        black: "#141416",
        space: "#2a2b58",
        lychee: "#e04f4f",
        velvet: "#2d0607",
        "space-blue": "#1b21dd",
      },
    },
  },
  variants: {
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),({
      modifiers: ["lg", "xl"],
    }),
  ],
};
