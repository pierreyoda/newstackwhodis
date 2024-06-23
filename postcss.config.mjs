/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    "tailwindcss",
    // autoprefixer needs to be setup after tailwindcss
    "autoprefixer",
    "postcss-nested",
    "cssnano",
  ],
};

export default config;
