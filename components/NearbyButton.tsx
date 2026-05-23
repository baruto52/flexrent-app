"use client";

import {
  FaLocationArrow,
} from "react-icons/fa";

type Props = {

  onLocation: (
    lat: number,
    lng: number
  ) => void;
};

export default function NearbyButton({
  onLocation,
}: Props) {

  function getLocation() {

    if (
      !navigator.geolocation
    ) {

      alert(
        "Geolocation nicht unterstützt"
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        onLocation(
          lat,
          lng
        );

      },

      () => {

        alert(
          "Standort konnte nicht geladen werden"
        );

      }

    );
  }

  return (

    <button
      onClick={getLocation}
      className="bg-black hover:bg-gray-800 text-white px-5 py-4 rounded-2xl font-semibold flex items-center gap-3"
    >

      <FaLocationArrow />

      In meiner Nähe

    </button>

  );
}