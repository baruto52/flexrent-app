"use client";

import Image from "next/image";

import RatingStars
from "@/components/RatingStars";

interface Props {

  review: any;
}

export default function ReviewCard({

  review,

}: Props) {

  return (

    <div
      className="
        bg-white
        rounded-[36px]
        p-8
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-start
          gap-5
        "
      >

        {/* AVATAR */}

        <div
          className="
            relative
            w-16
            h-16
            rounded-full
            overflow-hidden
            bg-gray-100
            flex-shrink-0
          "
        >

          <Image
            src={
              review.profiles
                ?.avatar_url ||

              "https://placehold.co/200x200/png"
            }
            alt="User"
            fill
            className="
              object-cover
            "
          />

        </div>

        {/* CONTENT */}

        <div className="flex-1">

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-3
              mb-4
            "
          >

            <div>

              <h3
                className="
                  text-2xl
                  font-black
                  mb-2
                "
              >

                {
                  review.profiles
                    ?.full_name ||

                  "Nutzer"
                }

              </h3>

              <RatingStars
                rating={
                  review.rating
                }
              />

            </div>

            <div
              className="
                text-gray-400
                text-sm
              "
            >

              {new Date(
                review.created_at
              ).toLocaleDateString(
                "de-DE"
              )}

            </div>

          </div>

          <p
            className="
              text-gray-700
              leading-8
              text-lg
            "
          >

            {
              review.comment ||
              "Keine Bewertung"
            }

          </p>

        </div>

      </div>

    </div>

  );
}