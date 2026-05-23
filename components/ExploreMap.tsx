"use client";

import Link from "next/link";

import {

  GoogleMap,

  Marker,

  useLoadScript,

} from "@react-google-maps/api";

type Props = {

  listings: any[];
};

export default function ExploreMap({

  listings,

}: Props) {

  const { isLoaded } =
    useLoadScript({

      googleMapsApiKey:

        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

  if (!isLoaded) {

    return (

      <div
        className="
          h-[700px]
          rounded-[40px]
          bg-gray-200
          animate-pulse
        "
      />

    );
  }

  return (

    <GoogleMap
      zoom={6}
      center={{
        lat: 51.1657,
        lng: 10.4515,
      }}
      mapContainerClassName="
        w-full
        h-[700px]
        rounded-[40px]
      "
      options={{

        disableDefaultUI: true,

        zoomControl: true,
      }}
    >

      {listings.map(
        (listing) => {

          if (
            !listing.latitude ||
            !listing.longitude
          )
            return null;

          return (

            <Marker
              key={listing.id}
              position={{

                lat:
                  listing.latitude,

                lng:
                  listing.longitude,
              }}
              onClick={() => {

                window.location.href =
                  `/listing/${listing.id}`;
              }}
            />
          );
        }
      )}

    </GoogleMap>
  );
}