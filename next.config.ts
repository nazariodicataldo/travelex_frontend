import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "esperienze-viaggi-backend.test",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
