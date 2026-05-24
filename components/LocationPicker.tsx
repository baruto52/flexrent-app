"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {

  GoogleMap,

  Marker,

  useLoadScript,

  Autocomplete,

} from "@react-google-maps/api";

type Props = {

  location: string;

  setLocation:
    (
      value: string
    ) => void;

  setLat:
    (
      value: number
    ) => void;

  setLng:
    (
      value: number
    ) => void;
};

export default function LocationPicker({

  location,

  setLocation,

  setLat,

  setLng,

}: Props) {

  const [marker, setMarker] =
    useState({

      lat: 52.52,

      lng: 13.405,
    });

  const autocompleteRef =
    useRef<any>(null);

  const { isLoaded } =
    useLoadScript({

      googleMapsApiKey:

        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",

      libraries: ["places"],
    });

  useEffect(() => {

    setLat(marker.lat);

    setLng(marker.lng);

  }, [marker]);

  function onPlaceChanged() {

    if (
      !autocompleteRef.current
    )
      return;

    const place =
      autocompleteRef.current.getPlace();

    if (
      !place.geometry
    )
      return;

    const lat =
      place.geometry.location.lat();

    const lng =
      place.geometry.location.lng();

    setMarker({
      lat,
      lng,
    });

    setLocation(
      place.formatted_address || ""
    );
  }

  if (!isLoaded) {

    return (

      <div
        className="
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

      {/* SEARCH */}

      <Autocomplete
        onLoad={(ref) =>
          (autocompleteRef.current = ref)
        }
        onPlaceChanged={
          onPlaceChanged
        }
      >

        <input
          type="text"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
          placeholder="Adresse suchen..."
          className="
            w-full
            h-16
            rounded-2xl
            border
            border-gray-200
            px-5
            text-lg
            outline-none
          "
        />

      </Autocomplete>

      {/* MAP */}

      <GoogleMap
        zoom={13}
        center={marker}
        mapContainerClassName="
          w-full
          h-[400px]
          rounded-[32px]
        "
        onClick={(e) => {

          if (
            !e.latLng
          )
            return;

          setMarker({

            lat:
              e.latLng.lat(),

            lng:
              e.latLng.lng(),
          });
        }}
      >

        <Marker
          position={marker}
        />

      </GoogleMap>

    </div>
  );
}