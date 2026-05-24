"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import Navbar
from "@/components/Navbar";

import HeroSection
from "@/components/HeroSection";

import CategoriesBar
from "@/components/CategoriesBar";

import ListingGrid
from "@/components/ListingGrid";

import FeaturesSection
from "@/components/FeaturesSection";

import CTASection
from "@/components/CTASection";

import Footer
from "@/components/Footer";

import {

  SlidersHorizontal,

  MapPin,

  Search,

} from "lucide-react";

function HomeContent() {

  const searchParams =
    useSearchParams();

  const [search, setSearch] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [category, setCategory] =
    useState("Alle");

  const [location, setLocation] =
    useState("");

  useEffect(() => {

    setSearch(

      searchParams.get(
        "search"
      ) || ""
    );

    setMaxPrice(

      searchParams.get(
        "maxPrice"
      ) || ""
    );

    setCategory(

      searchParams.get(
        "category"
      ) || "Alle"
    );

    setLocation(

      searchParams.get(
        "location"
      ) || ""
    );

  }, [searchParams]);

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-6
        "
      >

        {/* HERO */}

        <HeroSection />

        {/* STICKY SEARCH */}

        <div
          className="
            sticky
            top-24
            z-30
            mt-10
          "
        >

          <div
            className="
              bg-white/90
              backdrop-blur-xl
              border
              border-gray-100
              rounded-[36px]
              p-4
              shadow-xl
            "
          >

            <div
              className="
                grid
                lg:grid-cols-4
                gap-4
              "
            >

              {/* SEARCH */}

              <div
                className="
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  flex
                  items-center
                  px-5
                  gap-3
                  bg-white
                "
              >

                <Search
                  size={20}
                  className="
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Was möchtest du mieten?"
                  className="
                    flex-1
                    h-full
                    outline-none
                    text-lg
                    bg-transparent
                  "
                />

              </div>

              {/* LOCATION */}

              <div
                className="
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  flex
                  items-center
                  px-5
                  gap-3
                  bg-white
                "
              >

                <MapPin
                  size={20}
                  className="
                    text-gray-400
                  "
                />

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
                    flex-1
                    h-full
                    outline-none
                    text-lg
                    bg-transparent
                  "
                />

              </div>

              {/* PRICE */}

              <div
                className="
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  flex
                  items-center
                  px-5
                  gap-3
                  bg-white
                "
              >

                <SlidersHorizontal
                  size={20}
                  className="
                    text-gray-400
                  "
                />

                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value
                    )
                  }
                  placeholder="Max Preis"
                  className="
                    flex-1
                    h-full
                    outline-none
                    text-lg
                    bg-transparent
                  "
                />

              </div>

              {/* BUTTON */}

              <button
                className="
                  h-16
                  rounded-2xl
                  bg-[#16d64d]
                  text-white
                  text-lg
                  font-black
                  hover:scale-[1.01]
                  transition
                  shadow-lg
                "
              >

                Jetzt entdecken

              </button>

            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="mt-10">

          <CategoriesBar

            selectedCategory={
              category
            }

            setSelectedCategory={
              setCategory
            }

          />

        </div>

        {/* EXPLORE HEADER */}

        <div
          className="
            mt-14
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-5
          "
        >

          <div>

            <h2
              className="
                text-4xl
                md:text-6xl
                font-black
                leading-none
              "
            >

              Entdecken

            </h2>

            <p
              className="
                text-gray-500
                text-lg
                md:text-xl
                mt-4
              "
            >

              Werkzeuge, Garagen,
              Parkplätze, Keller &
              vieles mehr in deiner Nähe.

            </p>

          </div>

          <div
            className="
              bg-white
              rounded-2xl
              px-5
              py-4
              shadow-sm
              border
              border-gray-100
              text-sm
              font-bold
              text-gray-500
            "
          >

            Premium Marketplace

          </div>

        </div>

        {/* LISTINGS */}

        <div className="mt-10">

          <ListingGrid

            search={search}

            maxPrice={maxPrice}

            category={category}

            location={location}

          />

        </div>

        {/* FEATURES */}

        <div className="mt-24">

          <FeaturesSection />

        </div>

        {/* CTA */}

        <div className="mt-24">

          <CTASection />

        </div>

      </div>

      <Footer />

    </main>

  );
}

export default function HomePage() {

  return (

    <Suspense
      fallback={

        <div
          className="
            min-h-screen
            flex
            items-center
            justify-center
            text-3xl
            font-black
          "
        >

          Loading...

        </div>
      }
    >

      <HomeContent />

    </Suspense>

  );
}