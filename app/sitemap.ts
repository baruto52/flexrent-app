import { MetadataRoute }
from "next";

import { supabase }
from "@/lib/supabase";

export default async function sitemap():
Promise<MetadataRoute.Sitemap> {

  const baseUrl =

    process.env
      .NEXT_PUBLIC_SITE_URL ||

    "https://flexrent.de";

  /*
    STATIC PAGES
  */

  const staticPages = [

    "",

    "/map",

    "/favorites",

    "/bookings",

    "/dashboard",

    "/notifications",

    "/messages",

    "/create",
  ].map((route) => ({

    url:
      `${baseUrl}${route}`,

    lastModified:
      new Date(),

    changeFrequency:
      "daily" as const,

    priority:
      1,
  }));

  /*
    DYNAMIC LISTINGS
  */

  const {
    data: listings,
  } =
    await supabase
      .from("listings")
      .select(
        "id, updated_at"
      )
      .eq(
        "active",
        true
      );

  const listingPages =

    listings?.map(
      (listing) => ({

        url:
          `${baseUrl}/listing/${listing.id}`,

        lastModified:
          new Date(
            listing.updated_at
          ),

        changeFrequency:
          "daily" as const,

        priority:
          0.9,
      })
    ) || [];

  return [

    ...staticPages,

    ...listingPages,
  ];
}