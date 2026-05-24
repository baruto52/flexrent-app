"use client";

import {

  GoogleMap,

  OverlayView,

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
          h-full
          rounded-[36px]
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
        h-full
        rounded-[36px]
      "
      options={{

        disableDefaultUI: true,

        zoomControl: true,

        clickableIcons: false,

        gestureHandling: "greedy",
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

            <OverlayView
              key={listing.id}
              position={{

                lat:
                  listing.latitude,

                lng:
                  listing.longitude,
              }}
              mapPaneName={
                OverlayView.OVERLAY_MOUSE_TARGET
              }
            >

              <button
                onClick={() => {

                  window.location.href =
                    `/listing/${listing.id}`;
                }}
                className="
                  bg-white
                  px-5
                  py-3
                  rounded-full
                  shadow-2xl
                  border
                  border-gray-200
                  font-black
                  text-sm
                  hover:scale-110
                  transition-all
                  duration-300
                  whitespace-nowrap
                  hover:bg-[#16d64d]
                  hover:text-white
                "
              >

                €
                {listing.price}

              </button>

            </OverlayView>

          );
        }
      )}

    </GoogleMap>
  );
}