import { supabase }
from "@/lib/supabase";

type Props = {

  params: {
    id: string;
  };
};

export default async function Head({
  params,
}: Props) {

  const {
    data: listing,
  } =
    await supabase
      .from("listings")
      .select("*")
      .eq(
        "id",
        params.id
      )
      .maybeSingle();

  if (!listing) {

    return (

      <>
        <title>
          Listing nicht gefunden
        </title>
      </>

    );
  }

  const image =

    listing.image ||

    listing.image_url ||

    listing.images?.[0] ||

    "/og-image.png";

  const title =
    `${listing.title} | FlexRent`;

  const description =

    listing.description?.slice(
      0,
      160
    ) ||

    "Premium Listing auf FlexRent";

  return (

    <>

      <title>
        {title}
      </title>

      <meta
        name="description"
        content={description}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:image"
        content={image}
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_SITE_URL}/listing/${listing.id}`}
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={image}
      />

    </>

  );
}