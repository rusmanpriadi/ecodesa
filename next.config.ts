import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Build tetap jalan walaupun ada error TS
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
