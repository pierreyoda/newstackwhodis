const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const nested = require("postcss-nested");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const config = {
  plugins: [
    tailwindcss(),
    // autoprefixer needs to be setup after tailwindcss
    autoprefixer(),
    nested(),
    !dev &&
      cssnano({
        preset: "default",
      }),
  ],
};

module.exports = config;
