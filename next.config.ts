import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker/Render deployment
  // This creates a self-contained server.js that includes all dependencies
  output: "standalone",
};

export default nextConfig;
