// See https://nextjs.org/docs/advanced-features/customizing-postcss-config#customizing-plugins

const productionOnlyPlugins = [
  "postcss-flexbugs-fixes",
  [
    "postcss-preset-env",
    {
      autoprefixer: {
        flexbox: "no-2009",
      },
      stage: 3,
      features: {
        "custom-properties": false,
      },
    },
  ],
];

module.exports = {
  plugins: [
    "tailwindcss",
    ...process.env.NODE_ENV === "production"
      ? productionOnlyPlugins
      : [],
  ],
};
