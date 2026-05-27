"use client";

import Link from "next/link";

import Image from "next/image";

import {

  MapPin,

  Clock3,

  CheckCircle2,

  XCircle,

  CalendarDays,

  Receipt,

  ShieldCheck,

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

  /*
    DATES
  */

  const startDate =
    booking.start_date

      ? new Date(
          booking.start_date
        )

      : null;

  const endDate =
    booking.end_date

      ? new Date(
          booking.end_date
        )

      : null;

  /*
    RENTAL TYPE
  */

  const rentalType =
    listing?.rental_type ||
    "day";

  /*
    TOTAL TIME
  */

  let totalUnits = 1;

  if (
    startDate &&
    endDate
  ) {

    const diffMs =
      endDate.getTime() -
      startDate.getTime();

    if (
      rentalType === "hour"
    ) {

      totalUnits =
        Math.max(

          1,

          Math.ceil(

            diffMs /

            (
              1000 *
              60 *
              60
            )
          )
        );

    } else if (
      rentalType === "week"
    ) {

      totalUnits =
        Math.max(

          1,

          Math.ceil(

            diffMs /

            (
              1000 *
              60 *
              60 *
              24 *
              7
            )
          )
        );

    } else {

      totalUnits =
        Math.max(

          1,

          Math.ceil(

            diffMs /

            (
              1000 *
              60 *
              60 *
              24
            )
          )
        );
    }
  }

  /*
    PRICES
  */

  const basePrice =
    Number(
      listing?.price || 0
    );

  const subtotal =
    basePrice *
    totalUnits;

  const serviceFee =
    Math.round(
      subtotal * 0.1
    );

  const total =
    subtotal +
    serviceFee;

  /*
    LABEL
  */

  function getRentalLabel() {

    switch (
      rentalType
    ) {

      case "hour":

        return "Stunden";

      case "week":

        return "Wochen";

      default:

        return "Tage";
    }
  }

  /*
    STATUS
  */

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

    <>

      <div
        className="
          bg-white
          rounded-[40px]
          overflow-hidden
          shadow-sm
          hover:shadow-2xl
          transition-all
          duration-300
        "
      >

        <div
          className="
            grid
            xl:grid-cols-3
          "
        >

          {/* IMAGE */}

          <div
            className="
              relative
              h-[360px]
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
                backdrop-blur-xl
                shadow-xl

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

            {/* VERIFIED */}

            <div
              className="
                absolute
                bottom-5
                left-5
                bg-white/90
                backdrop-blur-xl
                rounded-2xl
                px-4
                py-3
                shadow-xl
                flex
                items-center
                gap-2
                font-black
              "
            >

              <ShieldCheck
                size={18}
                className="
                  text-[#16d64d]
                "
              />

              Verifiziert

            </div>

          </div>

          {/* CONTENT */}

          <div
            className="
              xl:col-span-2
              p-8
              md:p-10
              flex
              flex-col
              justify-between
            "
          >

            {/* TOP */}

            <div>

              <div
                className="
                  flex
                  flex-col
                  xl:flex-row
                  xl:items-start
                  xl:justify-between
                  gap-8
                  mb-8
                "
              >

                {/* LEFT */}

                <div>

                  <h2
                    className="
                      text-4xl
                      md:text-5xl
                      font-black
                      mb-5
                      leading-tight
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
                      mb-6
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

                  <p
                    className="
                      text-gray-600
                      text-lg
                      leading-9
                      line-clamp-3
                      max-w-3xl
                    "
                  >

                    {
                      listing?.description ||

                      "Keine Beschreibung"
                    }

                  </p>

                </div>

                {/* PRICE CARD */}

                <div
                  className="
                    bg-[#f5f7fb]
                    rounded-[32px]
                    p-7
                    min-w-[280px]
                    border
                    border-gray-100
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-6
                    "
                  >

                    <Receipt
                      size={24}
                      className="
                        text-[#16d64d]
                      "
                    />

                    <h3
                      className="
                        text-2xl
                        font-black
                      "
                    >

                      Preisübersicht

                    </h3>

                  </div>

                  <div className="space-y-4">

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        text-gray-600
                      "
                    >

                      <span>

                        €
                        {basePrice}
                        {" "}
                        ×
                        {" "}
                        {totalUnits}
                        {" "}
                        {getRentalLabel()}

                      </span>

                      <span
                        className="
                          font-bold
                        "
                      >

                        €
                        {subtotal}

                      </span>

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        text-gray-600
                      "
                    >

                      <span>

                        Servicegebühr

                      </span>

                      <span
                        className="
                          font-bold
                        "
                      >

                        €
                        {serviceFee}

                      </span>

                    </div>

                    {/* TOTAL */}

                    <div
                      className="
                        border-t
                        pt-5
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-gray-500
                            text-sm
                            mb-1
                          "
                        >
                          Gesamtpreis
                        </p>

                        <span
                          className="
                            text-xl
                            font-black
                          "
                        >
                          Gesamt
                        </span>

                      </div>

                      <div className="text-right">

                        <div
                          className="
                            text-3xl
                            font-black
                            text-[#16d64d]
                            drop-shadow-[0_0_12px_rgba(22,214,77,0.35)]
                          "
                        >

                          €
                          {total}

                        </div>

                        <p
                          className="
                            text-xs
                            text-gray-400
                            mt-1
                          "
                        >
                          inkl. Gebühren
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* DATES */}

              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-5
                "
              >

                {/* START */}

                <div
                  className="
                    bg-[#f5f7fb]
                    rounded-[28px]
                    p-6
                    border
                    border-gray-100
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

                      <CalendarDays
                        size={24}
                      />

                    </div>

                    <div>

                      <p
                        className="
                          text-gray-500
                          mb-1
                        "
                      >

                        Start

                      </p>

                      <h4
                        className="
                          font-black
                          text-lg
                        "
                      >

                        {startDate
                          ?.toLocaleDateString(
                            "de-DE"
                          ) || "-"}

                      </h4>

                    </div>

                  </div>

                </div>

                {/* END */}

                <div
                  className="
                    bg-[#f5f7fb]
                    rounded-[28px]
                    p-6
                    border
                    border-gray-100
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
                        bg-black/10
                        text-black
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <CalendarDays
                        size={24}
                      />

                    </div>

                    <div>

                      <p
                        className="
                          text-gray-500
                          mb-1
                        "
                      >

                        Ende

                      </p>

                      <h4
                        className="
                          font-black
                          text-lg
                        "
                      >

                        {endDate
                          ?.toLocaleDateString(
                            "de-DE"
                          ) || "-"}

                      </h4>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div
              className="
                mt-10
                flex
                flex-col
                xl:flex-row
                xl:items-center
                xl:justify-between
                gap-6
              "
            >

              {/* BOOKED */}

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

              {/* ACTIONS */}

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
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

      {/* MOBILE STICKY CTA */}

      <div
        className="
          xl:hidden
          fixed
          bottom-[110px]
          pb-safe
          left-4
          right-4
          z-40
        "
      >

        <div
          className="
            bg-white/95
            backdrop-blur-2xl
            border
            border-white/40
            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            rounded-[32px]
            p-5
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-gray-500
                text-sm
              "
            >
              Gesamtpreis
            </p>

            <h3
              className="
                text-3xl
                font-black
                text-[#16d64d]
              "
            >

              €
              {total}

            </h3>

          </div>

          <Link
            href={`/listing/${listing?.id}`}
            className="
              h-14
              px-7
              rounded-2xl
              bg-[#16d64d]
              text-white
              flex
              items-center
              justify-center
              font-black
              shadow-[0_10px_30px_rgba(22,214,77,0.35)]
            "
          >

            Anzeigen

          </Link>

        </div>

      </div>

    </>

  );
}