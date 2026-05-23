"use client";

import {

  LayoutDashboard,

  Heart,

  CalendarDays,

} from "lucide-react";

interface Props {

  listingsCount: number;

  favoritesCount: number;

  bookingsCount: number;
}

export default function ProfileStats({

  listingsCount,

  favoritesCount,

  bookingsCount,

}: Props) {

  return (

    <div
      className="
        grid
        md:grid-cols-3
        gap-6
        mb-10
      "
    >

      {/* LISTINGS */}

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
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-gray-500
                mb-2
              "
            >
              Listings
            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              {
                listingsCount
              }
            </h2>

          </div>

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-[#16d64d]
              text-white
              flex
              items-center
              justify-center
            "
          >

            <LayoutDashboard
              size={30}
            />

          </div>

        </div>

      </div>

      {/* FAVORITES */}

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
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-gray-500
                mb-2
              "
            >
              Favoriten
            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              {
                favoritesCount
              }
            </h2>

          </div>

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-red-500
              text-white
              flex
              items-center
              justify-center
            "
          >

            <Heart
              size={30}
            />

          </div>

        </div>

      </div>

      {/* BOOKINGS */}

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
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-gray-500
                mb-2
              "
            >
              Buchungen
            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              {
                bookingsCount
              }
            </h2>

          </div>

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-black
              text-white
              flex
              items-center
              justify-center
            "
          >

            <CalendarDays
              size={30}
            />

          </div>

        </div>

      </div>

    </div>

  );
}