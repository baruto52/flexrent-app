"use client";

import Link from "next/link";

export default function HeroSection() {

  return (
    <section className="px-6 pt-6 pb-10">

      <div
        className="
          max-w-7xl
          mx-auto
          rounded-[40px]
          overflow-hidden
          bg-[#00c81c]
          min-h-[620px]
          relative
          px-14
          py-16
          flex
          items-center
        "
      >

        {/* LEFT */}

        <div className="w-full lg:w-1/2 z-10">

          <div
            className="
              inline-flex
              items-center
              px-5
              py-2
              rounded-full
              bg-white/10
              text-white
              font-bold
              mb-8
            "
          >
            ⚡ Flexibel mieten statt kaufen
          </div>

          <h1
            className="
              text-7xl
              leading-[0.95]
              font-black
              text-white
              tracking-[-4px]
            "
          >
            Miete Werkzeuge,
            Parkplätze,
            Keller &
            mehr.
          </h1>

          <p
            className="
              text-white/90
              text-2xl
              mt-8
              max-w-2xl
              leading-relaxed
            "
          >
            Die moderne Plattform
            zum Vermieten und Mieten
            von Werkzeugen,
            Lagerräumen,
            Fahrzeugen,
            Parkplätzen und vielen
            weiteren Dingen
            in deiner Nähe.
          </p>

          {/* BUTTONS */}

          <div className="flex gap-5 mt-10">

            <Link
              href="/explore"
              className="
                h-16
                px-8
                rounded-2xl
                bg-white
                text-black
                font-black
                flex
                items-center
                justify-center
                text-lg
              "
            >
              Jetzt entdecken
            </Link>

            <Link
              href="/create"
              className="
                h-16
                px-8
                rounded-2xl
                border-2
                border-white/40
                text-white
                font-black
                flex
                items-center
                justify-center
                text-lg
              "
            >
              Anzeige erstellen
            </Link>

          </div>

        </div>

        {/* RIGHT IMAGE */}

        <div
          className="
            hidden
            lg:flex
            absolute
            right-0
            top-0
            w-1/2
            h-full
            items-center
            justify-center
          "
        >

          <img
            src="/hero-product.png"
            alt=""
            className="
              w-[90%]
              object-contain
              drop-shadow-2xl
            "
          />

        </div>

      </div>

    </section>
  );
}