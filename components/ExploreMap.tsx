"use client";

import {
  useMemo,
  useState,
} from "react";

import Link
from "next/link";

import {

  GoogleMap,

  OverlayView,

  useLoadScript,

} from "@react-google-maps/api";

import {

  MapPin,

  Star,

  ShieldCheck,

} from "lucide-react";

type Props = {

  listings: any[];
};

export default function ExploreMap({

  listings,

}: Props) {

  const [activeListing, setActiveListing] =
    useState<any>(null);

  const { isLoaded } =
    useLoadScript({

      googleMapsApiKey:

        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

  /*
    CENTER
  */

  const center =
    useMemo(() => {

      const valid =
        listings.filter(

          (listing) =>

            listing.latitude &&

            listing.longitude
        );

      if (
        valid.length === 0
      ) {

        return {

          lat: 51.1657,

          lng: 10.4515,
        };
      }

      return {

        lat:
          valid[0].latitude,

        lng:
          valid[0].longitude,
      };

    }, [listings]);

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

    <div className="relative h-full">

      {/* MAP */}

      <GoogleMap
        zoom={6}
        center={center}
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

          styles: [

            {
              featureType:
                "poi",

              stylers: [
                {
                  visibility:
                    "off",
                },
              ],
            },

            {
              featureType:
                "transit",

              stylers: [
                {
                  visibility:
                    "off",
                },
              ],
            },
          ],
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
                  onMouseEnter={() =>
                    setActiveListing(
                      listing
                    )
                  }
                  onMouseLeave={() =>
                    setActiveListing(
                      null
                    )
                  }
                  onClick={() => {

                    window.location.href =
                      `/listing/${listing.id}`;
                  }}
                  className={`
                    px-5
                    py-3
                    rounded-full
                    shadow-2xl
                    border
                    font-black
                    text-sm
                    transition-all
                    duration-300
                    whitespace-nowrap

                    ${
                      activeListing?.id ===
                      listing.id

                        ? `
                          bg-[#16d64d]
                          text-white
                          border-[#16d64d]
                          scale-110
                        `

                        : `
                          bg-white
                          text-black
                          border-gray-200
                          hover:scale-110
                          hover:bg-[#16d64d]
                          hover:text-white
                        `
                    }
                  `}
                >

                  €
                  {listing.price}

                </button>

              </OverlayView>

            );
          }
        )}

      </GoogleMap>

      {/* FLOATING PREVIEW */}

      {activeListing && (

        <Link
          href={`/listing/${activeListing.id}`}
          className="
            absolute
            left-6
            bottom-6
            z-30
            w-[360px]
            bg-white
            rounded-[32px]
            overflow-hidden
            shadow-[0_25px_80px_rgba(0,0,0,0.18)]
            border
            border-gray-100
            animate-in
            fade-in
            slide-in-from-bottom-5
            duration-300
          "
        >

          {/* IMAGE */}

          <div
            className="
              relative
              h-[220px]
              bg-gray-100
            "
          >

            <img
              src={
                activeListing.image ||

                activeListing.image_url ||

                activeListing.images?.[0] ||

                "/placeholder.jpg"
              }
              className="
                w-full
                h-full
                object-cover
              "
            />

            {/* PRICE */}

            <div
              className="
                absolute
                top-4
                left-4
                bg-white
                rounded-2xl
                px-4
                py-3
                shadow-xl
              "
            >

              <p
                className="
                  text-xs
                  text-gray-400
                  mb-1
                "
              >

                Pro Tag

              </p>

              <h2
                className="
                  text-2xl
                  font-black
                  leading-none
                "
              >

                €
                {
                  activeListing.price
                }

              </h2>

            </div>

          </div>

          {/* CONTENT */}

          <div className="p-6">

            {/* TITLE */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                mb-3
              "
            >

              <h2
                className="
                  text-2xl
                  font-black
                  line-clamp-2
                "
              >

                {
                  activeListing.title
                }

              </h2>

              <div
                className="
                  flex
                  items-center
                  gap-1
                  bg-[#16d64d]/10
                  text-[#16d64d]
                  px-3
                  py-2
                  rounded-2xl
                  font-black
                  text-sm
                "
              >

                <Star
                  size={15}
                  fill="#16d64d"
                />

                4.9

              </div>

            </div>

            {/* LOCATION */}

            <div
              className="
                flex
                items-center
                gap-2
                text-gray-500
                mb-4
              "
            >

              <MapPin
                size={16}
              />

              <span
                className="
                  line-clamp-1
                "
              >

                {
                  activeListing.location
                }

              </span>

            </div>

            {/* DESCRIPTION */}

            <p
              className="
                text-gray-600
                text-sm
                leading-7
                line-clamp-2
                mb-5
              "
            >

              {
                activeListing.description
              }

            </p>

            {/* FOOTER */}

            <div
              className="
                flex
                items-center
                justify-between
                pt-5
                border-t
                border-gray-100
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                "
              >

                <ShieldCheck
                  size={18}
                  className="
                    text-[#16d64d]
                  "
                />

                Verifiziert

              </div>

              <div
                className="
                  text-sm
                  font-black
                  text-[#16d64d]
                "
              >

                Jetzt ansehen

              </div>

            </div>

          </div>

        </Link>

      )}

    </div>
  );
}