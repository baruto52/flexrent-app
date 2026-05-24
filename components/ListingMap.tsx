"use client";

import {

  GoogleMap,

  Marker,

  InfoWindow,

  useLoadScript,

} from "@react-google-maps/api";

import {

  Navigation,

  MapPin,

  Star,

} from "lucide-react";

import {
  useState,
} from "react";

type Props = {

  lat: number;

  lng: number;

  title?: string;

  image?: string;

  price?: number;

  location?: string;
};

const mapContainerStyle = {

  width: "100%",

  height: "500px",
};

export default function ListingMap({

  lat,

  lng,

  title,

  image,

  price,

  location,

}: Props) {

  const [open, setOpen] =
    useState(true);

  const { isLoaded } =
    useLoadScript({

      googleMapsApiKey:

        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

  function openMaps() {

    window.open(

      `https://www.google.com/maps?q=${lat},${lng}`,

      "_blank"
    );
  }

  if (!isLoaded) {

    return (

      <div
        className="
          w-full
          h-[500px]
          rounded-[40px]
          bg-gray-200
          animate-pulse
        "
      />

    );
  }

  return (

    <div className="space-y-5">

      {/* MAP */}

      <div
        className="
          rounded-[40px]
          overflow-hidden
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        "
      >

        <GoogleMap
          zoom={13}
          center={{
            lat,
            lng,
          }}
          mapContainerStyle={
            mapContainerStyle
          }
          options={{

            disableDefaultUI: true,

            zoomControl: true,

            fullscreenControl: false,

            streetViewControl: false,

            mapTypeControl: false,
          }}
        >

          {/* MARKER */}

          <Marker
            position={{
              lat,
              lng,
            }}
            onClick={() =>
              setOpen(true)
            }
          />

          {/* INFO WINDOW */}

          {open && (

            <InfoWindow
              position={{
                lat,
                lng,
              }}
              onCloseClick={() =>
                setOpen(false)
              }
            >

              <div className="w-[240px]">

                {/* IMAGE */}

                <div
                  className="
                    h-[140px]
                    rounded-2xl
                    overflow-hidden
                    mb-4
                  "
                >

                  <img
                    src={
                      image ||

                      "https://placehold.co/800x600/png"
                    }
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>

                {/* TITLE */}

                <h3
                  className="
                    text-xl
                    font-black
                    mb-2
                    line-clamp-1
                  "
                >

                  {
                    title ||
                    "Listing"
                  }

                </h3>

                {/* LOCATION */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-500
                    mb-3
                  "
                >

                  <MapPin
                    size={16}
                  />

                  <span className="text-sm">

                    {
                      location ||
                      "Deutschland"
                    }

                  </span>

                </div>

                {/* RATING */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mb-4
                  "
                >

                  <Star
                    size={16}
                    className="
                      fill-yellow-400
                      text-yellow-400
                    "
                  />

                  <span
                    className="
                      font-bold
                    "
                  >

                    4.9

                  </span>

                </div>

                {/* PRICE */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <span
                      className="
                        text-3xl
                        font-black
                      "
                    >

                      €
                      {price || 0}

                    </span>

                  </div>

                  <button
                    onClick={
                      openMaps
                    }
                    className="
                      h-11
                      px-4
                      rounded-xl
                      bg-[#16d64d]
                      text-white
                      text-sm
                      font-black
                    "
                  >

                    Route

                  </button>

                </div>

              </div>

            </InfoWindow>

          )}

        </GoogleMap>

      </div>

      {/* BUTTON */}

      <button
        onClick={openMaps}
        className="
          w-full
          h-16
          rounded-2xl
          bg-black
          text-white
          font-black
          text-lg
          flex
          items-center
          justify-center
          gap-3
          hover:scale-[1.01]
          transition
        "
      >

        <Navigation
          size={22}
        />

        In Google Maps öffnen

      </button>

    </div>

  );
}