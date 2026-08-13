import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Google Identity Services (FedCM/One Tap) needs this referrer policy
        // to reach the id assertion endpoint — without it, Chrome aborts the
        // FedCM request and GSI logs "[GSI_LOGGER]: FedCM get() rejects with
        // AbortError: signal is aborted without reason".
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
        ],
      },
    ];
  },
};

export default nextConfig;
