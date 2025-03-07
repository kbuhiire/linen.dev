//https://vercel.com/support/articles/can-i-redirect-from-a-subdomain-to-a-subpath
const { withSentryConfig } = require('@sentry/nextjs');

const SKIP_SENTRY = process.env.SKIP_SENTRY === 'true';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.slack-edge.com',
      'cdn.discordapp.com',
      `linen-assets.s3.amazonaws.com`,
      'linen-assets.s3.us-east-1.amazonaws.com',
      `${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com`,
      `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
    ],
  },
  sentry: {
    hideSourceMaps: true,
  },
};
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  dryRun: SKIP_SENTRY,
  hideSourceMaps: true,
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
}
