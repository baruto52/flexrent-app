"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import ListingCard
from "@/components/ListingCard";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

const categories = [

  "Alle",

  "Fahrzeuge",

  "Werkzeuge",

  "Elektronik",

  "Immobilien",

  "Business",

  "Sport",

  "Camping",

  "Gaming",
];

export default function SearchClient() {

  const searchParams =
    useSearchParams();

  const query =
    searchParams.get("q") ?? "";

  const [loading, setLoading] =
    useState(true);

  const [listings, setListings] =
    useState<any[]>([]);

  const [category, setCategory] =
    useState("Alle");

  const [maxPrice, setMaxPrice] =
    useState("");

  useEffect(() => {

    searchListings();

  }, [query, category, maxPrice]);

  const searchListings =
    async () => {

      setLoading(true);

      let request =
        supabase
          .from("listings")
          .select("*")
          .eq(
            "active",
            true
          )
          .or(
            `
            title.ilike.%${query}%,
            description.ilike.%${query}%,
            location.ilike.%${query}%,
            category.ilike.%${query}%
            `
          );

      /* CATEGORY */

      if (
        category !== "Alle"
      ) {

        request =
          request.eq(
            "category",
            category
          );
      }

      /* PRICE */

      if (maxPrice) {

        request =
          request.lte(
            "price",
            Number(maxPrice)
          );
      }

      const { data } =
        await request.order(
          "created_at",
          {
            ascending: false,
          }
        );

      setListings(
        data || []
      );

      setLoading(false);
    };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div className="mb-10">

          <div
            className="
              flex
              items-center
              gap-5
              mb-5
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-[28px]
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Search
                size={38}
              />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  md:text-6xl
                  font-black
                "
              >
                Suche
              </h1>

              <p
                className="
                  text-gray-500
                  text-xl
                  mt-3
                "
              >
                Ergebnisse für:
                <span className="ml-2 text-black font-black">
                  {query}
                </span>
              </p>

            </div>

          </div>

        </div>

        {/* FILTERS */}

        <div
          className="
            bg-white
            rounded-[36px]
            p-6
            shadow-sm
            mb-10
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

            <SlidersHorizontal
              size={24}
            />

            <h2
              className="
                text-2xl
                font-black
              "
            >
              Filter
            </h2>

          </div>

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >

            {/* CATEGORY */}

            <div>

              <p
                className="
                  font-black
                  mb-3
                "
              >
                Kategorie
              </p>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  outline-none
                "
              >

                {categories.map(
                  (item) => (

                    <option
                      key={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* PRICE */}

            <div>

              <p
                className="
                  font-black
                  mb-3
                "
              >
                Max Preis
              </p>

              <input
                type="number"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value
                  )
                }
                placeholder="500"
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  outline-none
                "
              />

            </div>

          </div>

        </div>

        {/* RESULTS */}

        {loading ? (

          <div
            className="
              text-2xl
              font-black
            "
          >
            Suche läuft...
          </div>

        ) : listings.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[40px]
              p-20
              text-center
              shadow-sm
            "
          >

            <h2
              className="
                text-5xl
                font-black
                mb-5
              "
            >
              Keine Ergebnisse
            </h2>

            <p
              className="
                text-gray-500
                text-2xl
              "
            >
              Versuche andere Filter.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-8
            "
          >

            {listings.map(
              (listing) => (

                <ListingCard
                  key={listing.id}
                  listing={listing}
                />

              )
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}