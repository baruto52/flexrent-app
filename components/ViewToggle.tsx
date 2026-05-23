"use client";

import {
  FaMapMarkedAlt,
  FaList,
} from "react-icons/fa";

type Props = {

  mapView: boolean;

  setMapView: (
    value: boolean
  ) => void;
};

export default function ViewToggle({

  mapView,

  setMapView,
}: Props) {

  return (

    <div className="flex items-center gap-3 mb-8">

      {/* LIST */}

      <button
        onClick={() =>
          setMapView(false)
        }
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition ${
          !mapView
            ? "bg-black text-white"
            : "bg-white border"
        }`}
      >

        <FaList />

        Liste

      </button>

      {/* MAP */}

      <button
        onClick={() =>
          setMapView(true)
        }
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition ${
          mapView
            ? "bg-black text-white"
            : "bg-white border"
        }`}
      >

        <FaMapMarkedAlt />

        Karte

      </button>

    </div>

  );
}