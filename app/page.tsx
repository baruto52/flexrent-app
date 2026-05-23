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

import SearchBar
from "@/components/SearchBar";

function HomeContent() {

  const searchParams =
    useSearchParams();

  const [search, setSearch] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [category, setCategory] =
    useState("Alle");

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

  }, [searchParams]);

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HERO */}

        <HeroSection />

        {/* SEARCH */}

        <div className="mt-10">

          <SearchBar
            onSearch={
              setSearch
            }
          />

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

        {/* FILTERS */}

        <div
          className="
            mt-10
            bg-white
            rounded-[36px]
            p-6
            shadow-sm
          "
        >

          <div
            className="
              grid
              md:grid-cols-2
              gap-5
            "
          >

            {/* PRICE */}

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
                h-16
                rounded-2xl
                border
                border-gray-200
                px-5
                outline-none
                text-lg
              "
            />

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="
                h-16
                rounded-2xl
                border
                border-gray-200
                px-5
                outline-none
                text-lg
                bg-white
              "
            >

              <option>
                Alle
              </option>

              <option>
                Fahrzeuge
              </option>

              <option>
                Werkzeuge
              </option>

              <option>
                Elektronik
              </option>

              <option>
                Immobilien
              </option>

              <option>
                Business
              </option>

              <option>
                Gaming
              </option>

              <option>
                Sport
              </option>

            </select>

          </div>

        </div>

        {/* LISTINGS */}

        <div className="mt-10">

          <ListingGrid

            search={search}

            maxPrice={maxPrice}

            category={category}

          />

        </div>

        {/* FEATURES */}

        <div className="mt-16">

          <FeaturesSection />

        </div>

        {/* CTA */}

        <div className="mt-16">

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