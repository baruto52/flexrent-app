import "./globals.css";

import type {
  Metadata,
  Viewport,
} from "next";

import { Toaster }
from "react-hot-toast";

import MobileBottomBar
from "@/components/MobileBottomBar";

import PushNotifications
from "@/components/PushNotifications";

import OnlineStatus
from "@/components/OnlineStatus";

import {
  siteConfig,
} from "@/config/site";

export const metadata: Metadata = {

  metadataBase:
    new URL(
      process.env
        .NEXT_PUBLIC_SITE_URL ||

      siteConfig.url
    ),

  title: {

    default:
      siteConfig.name,

    template:
      `%s | ${siteConfig.name}`,
  },

  description:
    siteConfig.description,

  keywords:
    siteConfig.keywords,

  authors: [

    {
      name:
        siteConfig.company,
    },
  ],

  creator:
    siteConfig.company,

  publisher:
    siteConfig.company,

  robots: {

    index: true,

    follow: true,

    nocache: false,

    googleBot: {

      index: true,

      follow: true,

      noimageindex: false,

      "max-video-preview":
        -1,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,
    },
  },

  openGraph: {

    type: "website",

    locale: "de_DE",

    url:
      process.env
        .NEXT_PUBLIC_SITE_URL ||

      siteConfig.url,

    title:
      siteConfig.name,

    description:
      siteConfig.description,

    siteName:
      siteConfig.name,

    images: [

      {
        url:
          "/og-image.png",

        width: 1200,

        height: 630,

        alt:
          siteConfig.name,
      },
    ],
  },

  twitter: {

    card:
      "summary_large_image",

    title:
      siteConfig.name,

    description:
      siteConfig.description,

    images: [

      "/og-image.png",
    ],
  },

  manifest:
    "/manifest.json",

  icons: {

    icon: [

      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },

      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },

      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    shortcut:
      "/favicon.ico",

    apple:
      "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {

  width:
    "device-width",

  initialScale: 1,

  maximumScale: 1,

  themeColor:
    "#16d64d",

  viewportFit:
    "cover",
};

export default function RootLayout({

  children,

}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="de"
      suppressHydrationWarning
    >

      <body
        className="
          antialiased
          bg-[#f4f7fb]
          text-gray-900
          overflow-x-hidden
          pb-28
          md:pb-0
        "
      >

        {/* TOASTER */}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "18px",
              padding: "16px",
              fontWeight: "700",
            },
          }}
        />

        {children}

        {/* ONLINE STATUS */}

        <OnlineStatus />

        {/* PUSH */}

        <PushNotifications />

        {/* MOBILE APP BAR */}

        <MobileBottomBar />

      </body>

    </html>
  );
}