"use client";

import {

  LayoutDashboard,

  CheckCircle2,

  XCircle,

  BadgeEuro,

} from "lucide-react";

interface Props {

  totalListings: number;

  activeListings: number;

  inactiveListings: number;

  totalValue: number;
}

export default function DashboardStats({

  totalListings,

  activeListings,

  inactiveListings,

  totalValue,

}: Props) {

  return (

    <div
      className="
        grid
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-14
      "
    >

      {/* TOTAL */}

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
                totalListings
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

            <LayoutDashboard
              size={30}
            />

          </div>

        </div>

      </div>

      {/* ACTIVE */}

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
              Aktiv
            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              {
                activeListings
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

            <CheckCircle2
              size={30}
            />

          </div>

        </div>

      </div>

      {/* INACTIVE */}

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
              Inaktiv
            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              {
                inactiveListings
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

            <XCircle
              size={30}
            />

          </div>

        </div>

      </div>

      {/* VALUE */}

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
              Gesamtwert
            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              €
              {
                totalValue
              }
            </h2>

          </div>

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-yellow-500
              text-white
              flex
              items-center
              justify-center
            "
          >

            <BadgeEuro
              size={30}
            />

          </div>

        </div>

      </div>

    </div>

  );
}