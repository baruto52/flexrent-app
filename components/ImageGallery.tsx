"use client";

import {
  useState,
} from "react";

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

type Props = {
  images: string[];
};

export default function ImageGallery({
  images,
}: Props) {

  const [index, setIndex] =
    useState(0);

  if (
    !images ||
    images.length === 0
  ) {

    return (

      <img
        src="https://via.placeholder.com/1000x700"
        className="w-full h-[500px] object-cover rounded-3xl"
      />

    );
  }

  function prev() {

    setIndex((prev) =>

      prev === 0
        ? images.length - 1
        : prev - 1
    );
  }

  function next() {

    setIndex((prev) =>

      prev ===
      images.length - 1
        ? 0
        : prev + 1
    );
  }

  return (

    <div className="relative">

      {/* IMAGE */}

      <img
        src={images[index]}
        className="w-full h-[500px] object-cover rounded-3xl"
      />

      {/* LEFT */}

      {images.length > 1 && (

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-lg"
        >

          <FaChevronLeft />

        </button>

      )}

      {/* RIGHT */}

      {images.length > 1 && (

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-lg"
        >

          <FaChevronRight />

        </button>

      )}

      {/* DOTS */}

      {images.length > 1 && (

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">

          {images.map(
            (_, i) => (

            <button
              key={i}
              onClick={() =>
                setIndex(i)
              }
              className={`w-3 h-3 rounded-full ${
                i === index
                  ? "bg-white"
                  : "bg-white/50"
              }`}
            />

          ))}

        </div>

      )}

    </div>

  );
}