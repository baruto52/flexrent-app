"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExploreMap from "@/components/ExploreMap";
import ListingCard from "@/components/ListingCard";

import {

  MapPin,

  Sparkles,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function MapPage() {

  const [listings, setListings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadListings();

  }, []);

  async function loadListings() {

    const {
      data,
    } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "active",
          true
        );

    setListings(
      data || []
    );

    setLoading(false);
  }

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div
        className="
          max-w-[1800px]
          mx-auto
          px-4
          md:px-6
          py-6
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-6
            mb-8
          "
        >

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-3
                px-5
                py-3
                rounded-full
                bg-[#16d64d]
                text-white
                font-black
                mb-6
              "
            >

              <MapPin
                size={20}
              />

              Live Karte

            </div>

            <h1
              className="
                text-5xl
                md:text-7xl
                font-black
                leading-none
                tracking-tight
              "
            >

              Entdecken
              <br />

              auf der Karte

            </h1>

            <p
              className="
                text-gray-500
                text-lg
                md:text-2xl
                mt-5
                max-w-3xl
              "
            >

              Finde Werkzeuge,
              Parkplätze, Garagen,
              Keller und vieles mehr
              direkt in deiner Umgebung.

            </p>

          </div>

          <div
            className="
              bg-white
              border
              border-gray-100
              rounded-3xl
              px-8
              py-6
              shadow-sm
              min-w-fit
            "
          >

            <p
              className="
                text-gray-400
                mb-2
              "
            >

              Aktive Listings

            </p>

            <h2
              className="
                text-5xl
                font-black
                leading-none
              "
            >

              {listings.length}

            </h2>

          </div>

        </div>

        {/* MAIN */}

        {loading ? (

          <div
            className="
              h-[800px]
              rounded-[40px]
              bg-gray-200
              animate-pulse
            "
          />

        ) : (

          <div
            className="
              grid
              xl:grid-cols-[520px_1fr]
              gap-8
            "
          >

            {/* LEFT */}

            <div
              className="
                space-y-6
                h-[calc(100vh-180px)]
                overflow-y-auto
                pr-2
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

            {/* RIGHT */}

            <div
              className="
                sticky
                top-24
                h-[calc(100vh-120px)]
              "
            >

              <div
                className="
                  bg-white
                  rounded-[40px]
                  p-3
                  shadow-sm
                  h-full
                "
              >

                <ExploreMap
                  listings={listings}
                />

              </div>

            </div>

          </div>

        )}

        {/* CTA */}

        <div
          className="
            mt-20
            bg-white
            rounded-[40px]
            p-10
            md:p-16
            shadow-sm
            border
            border-gray-100
            text-center
          "
        >

          <div
            className="
              w-24
              h-24
              rounded-full
              bg-[#16d64d]
              text-white
              flex
              items-center
              justify-center
              mx-auto
              mb-8
            "
          >

            <Sparkles
              size={42}
            />

          </div>

          <h2
            className="
              text-4xl
              md:text-6xl
              font-black
              mb-6
            "
          >

            Flexibel mieten
            statt kaufen

          </h2>

          <p
            className="
              text-gray-500
              text-lg
              md:text-2xl
              max-w-4xl
              mx-auto
              leading-relaxed
            "
          >

            Entdecke moderne
            Vermietungen in deiner
            Umgebung — schnell,
            flexibel und sicher.

          </p>

        </div>

      </div>

      <Footer />

    </main>
  );
}