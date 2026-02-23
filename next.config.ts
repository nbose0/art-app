import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.metmuseum.org",
      },
      {
        protocol: "https",
        hostname: "www.artic.edu",
      },
      {
        protocol: "https",
        hostname: "lakeimagesweb.artic.edu",
      },
      {
        protocol: "https",
        hostname: "openaccess-cdn.clevelandart.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "iiif.micr.io",
      },
    ],
    unoptimized: true, // Museum CDN URLs vary; avoid next/image domain issues
  },
};

export default nextConfig;
