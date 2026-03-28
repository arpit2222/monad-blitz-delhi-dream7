import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.38.29.41"],
  transpilePackages: ['@privy-io/react-auth'],
};

export default nextConfig;