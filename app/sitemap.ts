import { MetadataRoute }
from "next";

export default function sitemap():
MetadataRoute.Sitemap {

  const baseUrl =
    process.env
      .NEXT_PUBLIC_SITE_URL ||

    "https://flexrent.de";

  return [

    {
      url: baseUrl,
      lastModified:
        new Date(),
      changeFrequency:
        "daily",
      priority: 1,
    },

    {
      url:
        `${baseUrl}/favorites`,
      lastModified:
        new Date(),
      changeFrequency:
        "weekly",
      priority: 0.8,
    },

    {
      url:
        `${baseUrl}/bookings`,
      lastModified:
        new Date(),
      changeFrequency:
        "weekly",
      priority: 0.8,
    },

    {
      url:
        `${baseUrl}/dashboard`,
      lastModified:
        new Date(),
      changeFrequency:
        "weekly",
      priority: 0.7,
    },

    {
      url:
        `${baseUrl}/notifications`,
      lastModified:
        new Date(),
      changeFrequency:
        "daily",
      priority: 0.7,
    },
  ];
}