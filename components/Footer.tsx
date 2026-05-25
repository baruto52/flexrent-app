"use client";

import Link from "next/link";

import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Footer() {

  return (
    <footer className="px-4 lg:px-8 pt-24 pb-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP */}

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-14
            pb-16
            border-b
            border-gray-200
          "
        >

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-[#00e01a]
                  flex
                  items-center
                  justify-center
                  text-black
                  font-black
                  text-xl
                "
              >
                F
              </div>

              <div>

                <h2 className="text-2xl font-black">
                  Loqaro
                </h2>

                <p className="text-gray-500 text-sm">
                  Premium Marketplace
                </p>

              </div>

            </div>

            <p
              className="
                text-gray-500
                mt-8
                leading-8
              "
            >
              Die moderne Plattform
              zum Vermieten und Mieten
              von Werkzeugen,
              Fahrzeugen,
              Immobilien
              und vielem mehr.
            </p>

            {/* SOCIALS */}

            <div className="flex items-center gap-4 mt-8">

              <button
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  hover:shadow-xl
                  transition
                "
              >
                <Instagram size={20} />
              </button>

              <button
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  hover:shadow-xl
                  transition
                "
              >
                <Facebook size={20} />
              </button>

              <button
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  hover:shadow-xl
                  transition
                "
              >
                <Twitter size={20} />
              </button>

              <button
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  hover:shadow-xl
                  transition
                "
              >
                <Youtube size={20} />
              </button>

            </div>

          </div>

          {/* COMPANY */}

          <div>

            <h3 className="text-2xl font-black mb-8">
              Unternehmen
            </h3>

            <div className="flex flex-col gap-5 text-gray-500">

              <Link href="/">
                Startseite
              </Link>

              <Link href="/explore">
                Entdecken
              </Link>

              <Link href="/categories">
                Kategorien
              </Link>

              <Link href="/create">
                Anzeige erstellen
              </Link>

            </div>

          </div>

          {/* SUPPORT */}

          <div>

            <h3 className="text-2xl font-black mb-8">
              Support
            </h3>

            <div className="flex flex-col gap-5 text-gray-500">

              <Link href="/">
                Hilfe
              </Link>

              <Link href="/">
                Datenschutz
              </Link>

              <Link href="/">
                AGB
              </Link>

              <Link href="/">
                Kontakt
              </Link>

            </div>

          </div>

          {/* NEWSLETTER */}

          <div>

            <h3 className="text-2xl font-black mb-8">
              Newsletter
            </h3>

            <p className="text-gray-500 leading-8 mb-6">
              Erhalte neue Angebote,
              Updates und Features
              direkt per Mail.
            </p>

            <div className="flex flex-col gap-4">

              <input
                type="email"
                placeholder="E-Mail Adresse"
                className="
                  h-14
                  px-5
                  rounded-2xl
                  bg-white
                  border
                  border-gray-200
                "
              />

              <button
                className="
                  h-14
                  rounded-2xl
                  bg-[#00e01a]
                  font-black
                  hover:scale-[1.02]
                  transition
                "
              >
                Abonnieren
              </button>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-5
            pt-10
          "
        >

          <p className="text-gray-500">
            © 2025 Loqaro. Alle Rechte vorbehalten.
          </p>

          <div className="flex items-center gap-8 text-gray-500">

            <Link href="/">
              Datenschutz
            </Link>

            <Link href="/">
              AGB
            </Link>

            <Link href="/">
              Impressum
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}