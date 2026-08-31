import type { NextConfig } from "next";

const isPlaywrightTest = process.env.PLAYWRIGHT_TEST === "1";

const nextConfig: NextConfig = {
  images: isPlaywrightTest
    ? {
        loader: "custom",
        loaderFile: "./playwright-image-loader.js",
      }
    : {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "picsum.photos",
            port: "",
            pathname: "/**",
            search: "",
          },
        ],
      },
};

export default nextConfig;
