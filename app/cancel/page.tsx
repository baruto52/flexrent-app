"use client";

import Link from "next/link";

import {

  XCircle,

  ArrowLeft,

  CreditCard,

  ShieldAlert,

  RefreshCcw,

} from "lucide-react";

export default function CancelPage() {

  return (

    <main
      className="
        min-h-screen
        bg-[#f5f7fb]
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          bg-white
          rounded-[44px]
          shadow-2xl
          p-8
          md:p-16
          max-w-3xl
          w-full
          text-center
          border
          border-gray-100
        "
      >

        {/* ICON */}

        <div
          className="
            w-36
            h-36
            rounded-full
            bg-red-500
            text-white
            flex
            items-center
            justify-center
            mx-auto
            mb-10
            shadow-2xl
          "
        >

          <XCircle
            size={80}
          />

        </div>

        {/* BADGE */}

        <div
          className="
            inline-flex
            items-center
            gap-3
            px-5
            py-3
            rounded-full
            bg-red-100
            text-red-600
            font-black
            mb-8
          "
        >

          <ShieldAlert
            size={20}
          />

          Zahlung abgebrochen

        </div>

        {/* TITLE */}

        <h1
          className="
            text-5xl
            md:text-7xl
            font-black
            leading-none
            tracking-tight
            mb-8
          "
        >

          Zahlung
          <br />

          nicht abgeschlossen

        </h1>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-500
            text-lg
            md:text-2xl
            leading-relaxed
            max-w-2xl
            mx-auto
            mb-12
          "
        >

          Deine Zahlung wurde abgebrochen
          oder konnte nicht verarbeitet werden.
          Es wurde keine Buchung bestätigt.

        </p>

        {/* FEATURES */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-5
            mb-12
          "
        >

          <div
            className="
              bg-[#f5f7fb]
              rounded-3xl
              p-6
            "
          >

            <CreditCard
              size={34}
              className="
                text-red-500
                mx-auto
                mb-4
              "
            />

            <h3
              className="
                font-black
                text-lg
                mb-2
              "
            >

              Keine Belastung

            </h3>

            <p
              className="
                text-gray-500
                text-sm
              "
            >

              Es wurde nichts bezahlt

            </p>

          </div>

          <div
            className="
              bg-[#f5f7fb]
              rounded-3xl
              p-6
            "
          >

            <RefreshCcw
              size={34}
              className="
                text-red-500
                mx-auto
                mb-4
              "
            />

            <h3
              className="
                font-black
                text-lg
                mb-2
              "
            >

              Jederzeit erneut

            </h3>

            <p
              className="
                text-gray-500
                text-sm
              "
            >

              Du kannst erneut buchen

            </p>

          </div>

          <div
            className="
              bg-[#f5f7fb]
              rounded-3xl
              p-6
            "
          >

            <ShieldAlert
              size={34}
              className="
                text-red-500
                mx-auto
                mb-4
              "
            />

            <h3
              className="
                font-black
                text-lg
                mb-2
              "
            >

              Sicher geschützt

            </h3>

            <p
              className="
                text-gray-500
                text-sm
              "
            >

              Stripe Sicherheitsstandard

            </p>

          </div>

        </div>

        {/* BUTTONS */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-5
            justify-center
          "
        >

          <Link
            href="/"
            className="
              h-16
              px-10
              rounded-2xl
              bg-black
              text-white
              font-black
              text-lg
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <ArrowLeft
              size={20}
            />

            Zurück zur Startseite

          </Link>

          <Link
            href="/map"
            className="
              h-16
              px-10
              rounded-2xl
              border
              border-gray-200
              bg-white
              font-black
              text-lg
              flex
              items-center
              justify-center
            "
          >

            Listings entdecken

          </Link>

        </div>

      </div>

    </main>
  );
}