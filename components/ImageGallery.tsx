"use client";

import { useState } from "react";

import Image from "next/image";

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

type Props = {
  images?: string[];
};

export default function ImageGallery({
  images = [],
}: Props) {

  const safeImages =
    Array.isArray(images)
      ? images.filter(
          (img) =>
            typeof img === "string" &&
            img.trim() !== ""
        )
      : [];

  const finalImages =
    safeImages.length > 0
      ? safeImages
      : [
          "https://placehold.co/1200x900/png",
        ];

  const [index, setIndex] =
    useState(0);

  function prev() {

    setIndex((prev) =>

      prev === 0
        ? finalImages.length - 1
        : prev - 1
    );
  }

  function next() {

    setIndex((prev) =>

      prev ===
      finalImages.length - 1
        ? 0
        : prev + 1
    );
  }

  return (

    <div className="w-full">

      {/* MAIN IMAGE */}

      <div
        className="
          relative
          w-full
          h-[550px]
          rounded-[40px]
          overflow-hidden
          bg-white
          shadow-sm
        "
      >

        <Image
          src={
            finalImages[index]
          }
          alt="Listing"
          fill
          priority
          className="object-cover"
          unoptimized
        />

        {finalImages.length > 1 && (

          <>
            <button
              onClick={prev}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                z-20
                bg-white/90
                hover:bg-white
                p-4
                rounded-full
                shadow-xl
              "
            >

              <FaChevronLeft />

            </button>

            <button
              onClick={next}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                z-20
                bg-white/90
                hover:bg-white
                p-4
                rounded-full
                shadow-xl
              "
            >

              <FaChevronRight />

            </button>
          </>

        )}

      </div>

      {/* THUMBNAILS */}

      {finalImages.length > 1 && (

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            mt-5
            pb-2
          "
        >

          {finalImages.map(
            (image, i) => (

              <button
                key={i}
                onClick={() =>
                  setIndex(i)
                }
                className={`
                  relative
                  min-w-[120px]
                  h-[100px]
                  rounded-2xl
                  overflow-hidden
                  border-4
                  transition
                  ${
                    index === i

                      ? "border-[#16d64d]"

                      : "border-transparent"
                  }
                `}
              >

                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />

              </button>

            )
          )}

        </div>

      )}

    </div>

  );
}