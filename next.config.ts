import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: [
      "localhost:3000",
      "192.168.1.8",
      "my-custom-domain.local:3000", // Example: Custom local domain
      "your-ngrok-url.app" // Example: Ngrok tunnel
    ],
};

export default nextConfig;
