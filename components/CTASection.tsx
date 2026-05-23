"use client";

import Link from "next/link";

export default function CTASection() {

  return (
    <section className="px-4 lg:px-8 py-24">

      <div className="max-w-7xl mx-auto">

        <div
          className="
            relative
            overflow-hidden
            rounded-[50px]
            bg-black
            px-8
            lg:px-20
            py-20
          "
        >

          {/* BACKGROUND EFFECT */}

          <div
            className="
              absolute
              top-0
              right-0
              w-[500px]
              h-[500px]
              bg-[#00e01a]
              opacity-20
              blur-[140px]
            "
          />

          {/* CONTENT */}

          <div
            className="
              relative
              z-10
              grid
              lg:grid-cols-2
              gap-16
              items-center
            "
          >

            {/* LEFT */}

            <div>

              <div
                className="
                  inline-flex
                  items-center
                  px-5
                  py-3
                  rounded-full
                  bg-white/10
                  border
                  border-white/10
                  text-white
                  font-semibold
                  mb-8
                "
              >
                Starte jetzt mit FlexRent
              </div>

              <h2
                className="
                  text-white
                  text-5xl
                  lg:text-7xl
                  font-black
                  leading-[0.95]
                  tracking-[-4px]
                "
              >
                Vermiete
                <br />

                deine Dinge
                <br />

                in Minuten.
              </h2>

              <p
                className="
                  text-white/70
                  text-xl
                  leading-9
                  mt-10
                  max-w-[600px]
                "
              >
                Erstelle Anzeigen,
                erreiche tausende Nutzer
                und verdiene Geld
                mit Dingen,
                die du bereits besitzt.
              </p>

            </div>

            {/* RIGHT */}

            <div
              className="
                flex
                flex-col
                gap-5
                lg:items-end
              "
            >

              <Link
                href="/create"
                className="
                  h-16
                  px-10
                  rounded-2xl
                  bg-[#00e01a]
                  text-black
                  font-black
                  text-lg
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                "
              >
                Anzeige erstellen
              </Link>

              <Link
                href="/explore"
                className="
                  h-16
                  px-10
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/10
                  text-white
                  font-black
                  text-lg
                  flex
                  items-center
                  justify-center
                  hover:bg-white/20
                  transition
                "
              >
                Anzeigen entdecken
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}