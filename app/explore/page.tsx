"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Search,
  MapPin,
  Star,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  rental_type: string;
  images: string[];
};

export default function ExplorePage() {

  const [listings, setListings] =
    useState<Listing[]>([]);

  const [filteredListings, setFilteredListings] =
    useState<Listing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [rentalType, setRentalType] =
    useState("Alle");

  useEffect(() => {

    loadListings();

  }, []);

  useEffect(() => {

    filterListings();

  }, [
    search,
    location,
    rentalType,
    listings,
  ]);

  const loadListings = async () => {

    const { data, error } =
      await supabase
        .from("listings")
        .select("*")
        .eq("active", true)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {

      console.log(error);

      setLoading(false);

      return;
    }

    setListings(data || []);

    setFilteredListings(
      data || []
    );

    setLoading(false);
  };

  /* FILTER */

  const filterListings =
    () => {

      let filtered =
        [...listings];

      /* SEARCH */

      if (search) {

        filtered =
          filtered.filter(
            (listing) =>
              listing.title
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||
              listing.description
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      /* LOCATION */

      if (location) {

        filtered =
          filtered.filter(
            (listing) =>
              listing.location
                .toLowerCase()
                .includes(
                  location.toLowerCase()
                )
          );
      }

      /* RENTAL TYPE */

      if (
        rentalType !==
        "Alle"
      ) {

        filtered =
          filtered.filter(
            (listing) =>
              listing.rental_type ===
              rentalType
          );
      }

      setFilteredListings(
        filtered
      );
    };

  return (
    <main className="min-h-screen bg-[#f4f7fb]">

      {/* HERO */}

      <section className="px-6 pt-10">

        <div className="max-w-7xl mx-auto">

          <div
            className="
              bg-white
              rounded-[50px]
              p-10
              shadow-sm
            "
          >

            <h1
              className="
                text-6xl
                font-black
                tracking-[-3px]
              "
            >
              Entdecken
            </h1>

            <p
              className="
                text-gray-500
                text-xl
                mt-5
              "
            >
              Finde Werkzeuge,
              Fahrzeuge,
              Immobilien und mehr.
            </p>

            {/* FILTERS */}

            <div
              className="
                grid
                lg:grid-cols-4
                gap-5
                mt-10
              "
            >

              {/* SEARCH */}

              <div
                className="
                  h-16
                  rounded-2xl
                  bg-gray-100
                  px-5
                  flex
                  items-center
                  gap-4
                "
              >

                <Search size={22} />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Suchen..."
                  className="
                    bg-transparent
                    w-full
                  "
                />

              </div>

              {/* LOCATION */}

              <div
                className="
                  h-16
                  rounded-2xl
                  bg-gray-100
                  px-5
                  flex
                  items-center
                  gap-4
                "
              >

                <MapPin size={22} />

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  placeholder="Standort"
                  className="
                    bg-transparent
                    w-full
                  "
                />

              </div>

              {/* RENTAL TYPE */}

              <select
                value={rentalType}
                onChange={(e) =>
                  setRentalType(
                    e.target.value
                  )
                }
                className="
                  h-16
                  px-5
                  rounded-2xl
                  bg-gray-100
                "
              >

                <option>
                  Alle
                </option>

                <option>
                  Stunde
                </option>

                <option>
                  Tag
                </option>

                <option>
                  Woche
                </option>

                <option>
                  Monat
                </option>

              </select>

              {/* RESULT COUNT */}

              <div
                className="
                  h-16
                  rounded-2xl
                  bg-[#00e01a]
                  flex
                  items-center
                  justify-center
                  font-black
                  text-lg
                "
              >
                {filteredListings.length}
                Ergebnisse
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* LISTINGS */}

      <section className="px-6 py-14">

        <div className="max-w-7xl mx-auto">

          {loading ? (

            <div className="text-2xl">
              Lade Anzeigen...
            </div>

          ) : filteredListings.length ===
            0 ? (

            <div
              className="
                bg-white
                rounded-[40px]
                p-16
                text-center
              "
            >

              <h2
                className="
                  text-5xl
                  font-black
                  mb-5
                "
              >
                Keine Anzeigen gefunden
              </h2>

              <p className="text-gray-500 text-lg">
                Versuche andere Filter.
              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-8
              "
            >

              {filteredListings.map(
                (listing) => (

                  <Link
                    href={`/listing/${listing.id}`}
                    key={listing.id}
                    className="
                      bg-white
                      rounded-[36px]
                      overflow-hidden
                      shadow-sm
                      hover:shadow-2xl
                      hover:-translate-y-2
                      transition-all
                    "
                  >

                    {/* IMAGE */}

                    <div className="h-[260px]">

                      <img
                        src={
                          listing.images?.[0] ||
                          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop"
                        }
                        alt=""
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    </div>

                    {/* CONTENT */}

                    <div className="p-7">

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-5
                        "
                      >

                        <div
                          className="
                            bg-[#00e01a]/10
                            text-[#00b718]
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-bold
                          "
                        >
                          {listing.rental_type}
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <Star
                            size={18}
                            fill="black"
                          />

                          <span className="font-bold">
                            4.9
                          </span>

                        </div>

                      </div>

                      <h3
                        className="
                          text-3xl
                          font-black
                          line-clamp-1
                        "
                      >
                        {listing.title}
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

                        {listing.location}

                      </div>

                      <p
                        className="
                          text-gray-500
                          mt-5
                          line-clamp-2
                          min-h-[52px]
                        "
                      >
                        {
                          listing.description
                        }
                      </p>

                      <div
                        className="
                          mt-8
                          text-5xl
                          font-black
                        "
                      >
                        €{listing.price}
                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}