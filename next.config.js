const path = require("path");
const withMDX = require("@next/mdx");

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withMDX({
  // https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en-US", "fr"],
    defaultLocale: "en-US",
    localeDetection: true,
  },
  webpack: config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "./"),
      },
    },
  }),
}));
