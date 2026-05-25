"use client";

import Link from "next/link";

import Image from "next/image";

import {
  MapPin,
  Star,
} from "lucide-react";

const listings = [
  {
    id: 1,
    title: "Bosch Schlagbohrer",
    category: "Werkzeuge",
    price: "20",
    type: "Tag",
    location: "Berlin",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    title: "BMW M4 Competition",
    category: "Fahrzeuge",
    price: "120",
    type: "Tag",
    location: "Hamburg",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    title: "DJI Kamera Set",
    category: "Elektronik",
    price: "45",
    type: "Tag",
    location: "Frankfurt",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 4,
    title: "Lagerraum Innenstadt",
    category: "Lager",
    price: "35",
    type: "Woche",
    location: "Köln",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function ListingSection() {

  return (
    <section className="px-4 lg:px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-10
          "
        >

          <div>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              Beliebte Anzeigen
            </h2>

            <p className="text-gray-500 text-xl mt-3">
              Die beliebtesten Angebote auf Loqaro.
            </p>

          </div>

          <Link
            href="/explore"
            className="
              hidden
              lg:flex
              items-center
              justify-center
              px-7
              h-14
              rounded-2xl
              bg-[#00e01a]
              font-bold
              hover:scale-105
              transition
            "
          >
            Alle ansehen
          </Link>

        </div>

        {/* GRID */}

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-4
            gap-8
          "
        >

          {listings.map((item) => (

            <Link
              key={item.id}
              href="/explore"
              className="
                bg-white
                rounded-[34px]
                overflow-hidden
                shadow-sm
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
              "
            >

              {/* IMAGE */}

              <div className="relative h-[240px]">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <div className="text-gray-400 mb-2">
                  {item.category}
                </div>

                <h3
                  className="
                    text-2xl
                    font-black
                    line-clamp-1
                  "
                >
                  {item.title}
                </h3>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-500
                    mt-4
                  "
                >

                  <MapPin size={18} />

                  {item.location}

                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mt-8
                  "
                >

                  <div
                    className="
                      text-3xl
                      font-black
                    "
                  >
                    €{item.price}

                    <span className="text-lg text-gray-400">
                      /{item.type}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      font-bold
                    "
                  >

                    <Star
                      size={18}
                      className="
                        fill-yellow-400
                        text-yellow-400
                      "
                    />

                    4.9

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}