"use client";

import {

  GoogleMap,

  Marker,

  useLoadScript,

} from "@react-google-maps/api";

import {
  Navigation,
} from "lucide-react";

type Props = {

  lat: number;

  lng: number;
};

export default function ListingMap({

  lat,

  lng,

}: Props) {

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
          h-[400px]
          rounded-[32px]
          bg-gray-200
          animate-pulse
        "
      />

    );
  }

  return (

    <div className="space-y-5">

      {/* MAP */}

      <GoogleMap
        zoom={13}
        center={{
          lat,
          lng,
        }}
        mapContainerClassName="
          w-full
          h-[400px]
          rounded-[32px]
        "
        options={{

          disableDefaultUI: true,

          zoomControl: true,
        }}
      >

        <Marker
          position={{
            lat,
            lng,
          }}
        />

      </GoogleMap>

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
        "
      >

        <Navigation
          size={22}
        />

        Route öffnen

      </button>

    </div>
  );
}