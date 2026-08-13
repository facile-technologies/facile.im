import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a fully static site in out/ (no Node server needed).
  // Deploys exactly like the Vite dist/ — nginx serves it at "/".
  output: "export",
  // Static export can't run the default next/image optimizer (needs a server),
  // and the site uses next/image with local images, so serve them unoptimized.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
