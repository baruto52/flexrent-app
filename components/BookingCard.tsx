"use client";

import Link from "next/link";

import Image from "next/image";

import {

  MapPin,

  Clock3,

  CheckCircle2,

  XCircle,

} from "lucide-react";

interface Props {

  booking: any;

  onCancel: (
    bookingId: string
  ) => void;
}

export default function BookingCard({

  booking,

  onCancel,

}: Props) {

  const listing =
    booking.listings;

  function getStatusColor(
    status: string
  ) {

    switch (status) {

      case "Bezahlt":

        return "bg-green-500";

      case "Pending":

        return "bg-yellow-500";

      case "Storniert":

        return "bg-red-500";

      default:

        return "bg-gray-500";
    }
  }

  return (

    <div
      className="
        bg-white
        rounded-[40px]
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        transition
      "
    >

      <div
        className="
          grid
          lg:grid-cols-3
        "
      >

        {/* IMAGE */}

        <div
          className="
            relative
            h-[340px]
          "
        >

          <Image
            src={
              listing?.images?.[0] ||

              "https://placehold.co/1200x900/png"
            }
            alt={
              listing?.title ||

              "Listing"
            }
            fill
            className="
              object-cover
            "
          />

          {/* STATUS */}

          <div
            className={`
              absolute
              top-5
              left-5
              px-5
              py-3
              rounded-full
              text-white
              font-black
              flex
              items-center
              gap-2
              ${getStatusColor(
                booking.payment_status
              )}
            `}
          >

            <CheckCircle2
              size={18}
            />

            {
              booking.payment_status ||

              "Bezahlt"
            }

          </div>

        </div>

        {/* CONTENT */}

        <div
          className="
            lg:col-span-2
            p-10
            flex
            flex-col
            justify-between
          "
        >

          <div>

            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-start
                lg:justify-between
                gap-6
                mb-6
              "
            >

              <div>

                <h2
                  className="
                    text-5xl
                    font-black
                    mb-4
                  "
                >

                  {
                    listing?.title
                  }

                </h2>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-gray-500
                    text-lg
                    mb-5
                  "
                >

                  <MapPin
                    size={20}
                  />

                  {
                    listing?.location ||

                    "Unbekannt"
                  }

                </div>

              </div>

              <div
                className="
                  bg-[#f5f7fb]
                  rounded-3xl
                  px-7
                  py-5
                  min-w-[180px]
                "
              >

                <p
                  className="
                    text-gray-500
                    mb-2
                  "
                >
                  Bezahlt
                </p>

                <h3
                  className="
                    text-5xl
                    font-black
                  "
                >

                  €
                  {
                    booking.total_price ||

                    listing?.price
                  }

                </h3>

              </div>

            </div>

            <p
              className="
                text-gray-600
                text-lg
                leading-9
                line-clamp-3
              "
            >

              {
                listing?.description ||

                "Keine Beschreibung"
              }

            </p>

          </div>

          <div
            className="
              mt-10
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#16d64d]/10
                  text-[#16d64d]
                  flex
                  items-center
                  justify-center
                "
              >

                <Clock3
                  size={24}
                />

              </div>

              <div>

                <p className="text-gray-500">
                  Gebucht am
                </p>

                <h4
                  className="
                    font-black
                    text-lg
                  "
                >

                  {new Date(
                    booking.created_at
                  ).toLocaleDateString(
                    "de-DE"
                  )}

                </h4>

              </div>

            </div>

            <div
              className="
                flex
                gap-4
              "
            >

              <Link
                href={`/listing/${listing?.id}`}
                className="
                  h-14
                  px-7
                  rounded-2xl
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                Listing öffnen
              </Link>

              {booking.payment_status !==
                "Storniert" && (

                <button
                  onClick={() =>
                    onCancel(
                      booking.id
                    )
                  }
                  className="
                    h-14
                    px-7
                    rounded-2xl
                    bg-red-500
                    text-white
                    flex
                    items-center
                    justify-center
                    gap-3
                    font-bold
                  "
                >

                  <XCircle
                    size={20}
                  />

                  Stornieren

                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}