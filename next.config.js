const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withSvgr = require("next-svgr");

module.exports = withBundleAnalyzer(withSvgr({
  // https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    localeDetection: true,
  },
  webpack: (config, { isServer }) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "./"),
      },
    },
    ...isServer ? {
      // fixes packages depending on fs/module module
      node: {
        fs: "empty",
        module: "empty",
      },
    } : {},
  }),
}));
