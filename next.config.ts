import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cover art is displayed by the live YouTube iframe itself; we never re-host
  // thumbnails. next/image remote patterns are intentionally left unset.
  devIndicators: false,
};

export default nextConfig;
