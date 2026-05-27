/** @type {import('next').NextConfig} */

import withPWAInit
from "next-pwa";

const withPWA =
  withPWAInit({

    dest: "public",

    register: true,

    skipWaiting: true,

    disable: true,
  });

const nextConfig = {

  eslint: {

    ignoreDuringBuilds: true,
  },

  typescript: {

    ignoreBuildErrors: true,
  },

  images: {

    remotePatterns: [

      {
        protocol: "https",

        hostname:
          "pobizaxvmxgqfxwmhvq.supabase.co",
      },

      {
        protocol: "https",

        hostname:
          "**",
      },
    ],
  },
};

export default withPWA(
  nextConfig
);