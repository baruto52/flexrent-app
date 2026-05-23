import type {
  Metadata,
} from "next";

export function generateListingMetadata({

  title,

  description,

  image,

}: {

  title: string;

  description?: string;

  image?: string;

}): Metadata {

  return {

    title,

    description:
      description ||
      "Premium Listing auf FlexRent.",

    openGraph: {

      title,

      description:
        description ||
        "Premium Listing auf FlexRent.",

      images: [

        {
          url:
            image ||
            "/og-image.png",
        },
      ],
    },

    twitter: {

      card:
        "summary_large_image",

      title,

      description:
        description ||
        "Premium Listing auf FlexRent.",

      images: [

        image ||
        "/og-image.png",
      ],
    },
  };
}