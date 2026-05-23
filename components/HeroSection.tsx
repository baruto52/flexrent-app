"use client";

import Link from "next/link";

export default function HeroSection() {

  return (

    <section className="px-4 md:px-6 pt-4 md:pt-6 pb-8 md:pb-10 overflow-hidden">

      <div
        className="
          max-w-7xl
          mx-auto
          rounded-[32px]
          md:rounded-[40px]
          overflow-hidden
          bg-[#00c81c]
          relative
          px-6
          md:px-14
          py-10
          md:py-16
          flex
          flex-col
          lg:flex-row
          items-center
          min-h-[520px]
          md:min-h-[620px]
        "
      >

        {/* LEFT */}

        <div className="w-full lg:w-1/2 z-10">

          {/* BADGE */}

          <div
            className="
              inline-flex
              items-center
              px-4
              md:px-5
              py-2
              rounded-full
              bg-white/10
              text-white
              font-bold
              mb-6
              text-sm
              md:text-base
            "
          >

            ⚡ Flexibel mieten statt kaufen

          </div>

          {/* TITLE */}

          <h1
            className="
              text-[52px]
              sm:text-[64px]
              md:text-7xl
              lg:text-8xl
              leading-[0.95]
              font-black
              text-white
              tracking-[-2px]
              md:tracking-[-4px]
              break-words
            "
          >

            Miete
            <br />

            Werkzeuge,
            <br />

            Parkplätze,
            <br />

            Keller &
            <br />

            mehr.

          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              text-white/90
              text-lg
              md:text-2xl
              mt-6
              md:mt-8
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

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-4
              mt-8
              md:mt-10
              w-full
            "
          >

            <Link
              href="/explore"
              className="
                h-14
                md:h-16
                px-8
                rounded-2xl
                bg-white
                text-black
                font-black
                flex
                items-center
                justify-center
                text-base
                md:text-lg
                w-full
                sm:w-auto
              "
            >

              Jetzt entdecken

            </Link>

            <Link
              href="/create"
              className="
                h-14
                md:h-16
                px-8
                rounded-2xl
                border-2
                border-white/40
                text-white
                font-black
                flex
                items-center
                justify-center
                text-base
                md:text-lg
                w-full
                sm:w-auto
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