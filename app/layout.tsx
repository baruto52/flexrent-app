import "./globals.css";

import type {
  Metadata,
  Viewport,
} from "next";

import { Toaster }
from "react-hot-toast";

export const metadata: Metadata = {

  metadataBase:
    new URL(

      process.env
        .NEXT_PUBLIC_SITE_URL ||

      "https://flexrent.de"
    ),

  title: {

    default:
      "FlexRent",

    template:
      "%s | FlexRent",
  },

  description:
    "Premium Marketplace für Werkzeuge, Fahrzeuge, Immobilien, Elektronik und mehr.",

  keywords: [

    "FlexRent",

    "Marketplace",

    "Mieten",

    "Werkzeuge",

    "Fahrzeuge",

    "Immobilien",

    "Elektronik",

    "Sharing Economy",

    "Deutschland",

    "Buchung",

    "Verleihplattform",
  ],

  authors: [

    {
      name:
        "FlexRent",
    },
  ],

  creator:
    "FlexRent",

  publisher:
    "FlexRent",

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

      "https://flexrent.de",

    title:
      "FlexRent",

    description:
      "Premium Marketplace für Vermietungen aller Art.",

    siteName:
      "FlexRent",

    images: [

      {
        url:
          "/og-image.png",

        width: 1200,

        height: 630,

        alt:
          "FlexRent",
      },
    ],
  },

  twitter: {

    card:
      "summary_large_image",

    title:
      "FlexRent",

    description:
      "Premium Marketplace für Vermietungen.",

    images: [

      "/og-image.png",
    ],
  },

  manifest:
    "/manifest.json",

  icons: {

    icon:
      "/favicon.ico",

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

      </body>

    </html>

  );
}