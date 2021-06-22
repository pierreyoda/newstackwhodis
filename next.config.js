const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withSvgr = require("next-svgr");

module.exports = withBundleAnalyzer(withSvgr({
  webpack: (config, { isServer }) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "./"),
      },
      // fallback: {
      //   ...config.resolve.fallback,
      //   fs: isServer, // fixes npm packages that depend on `fs` module
      // },
    },
  }),
}));
