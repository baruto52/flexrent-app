"use client";

import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

type Props = {
  location: string;
};

export default function ListingMap({
  location,
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
          w-full
          h-[400px]
          rounded-[32px]
          bg-gray-200
          animate-pulse
        "
      />
    );
  }

  /*
    TEMP CENTER
    später echte coords
  */

  const center = {
    lat: 52.52,
    lng: 13.405,
  };

  return (
    <GoogleMap
      zoom={12}
      center={center}
      mapContainerClassName="
        w-full
        h-[400px]
        rounded-[32px]
      "
    >

      <Marker position={center} />

    </GoogleMap>
  );
}