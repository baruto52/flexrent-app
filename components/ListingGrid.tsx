"use client";

import {
  useEffect,
  useState,
} from "react";

import {

  Sparkles,

  ArrowUpDown,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

import ListingCard
from "@/components/ListingCard";

type Listing = {

  id: string;

  title: string;

  description: string;

  location: string;

  price: number;

  images: string[];

  category?: string;

  active?: boolean;

  created_at?: string;
};

interface Props {

  search?: string;

  maxPrice?: string;

  category?: string;

  location?: string;
}

export default function ListingGrid({

  search = "",

  maxPrice = "",

  category = "Alle",

  location = "",

}: Props) {

  const [listings, setListings] =
    useState<Listing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [debouncedSearch, setDebouncedSearch] =
    useState(search);

  const [sortBy, setSortBy] =
    useState("newest");

  useEffect(() => {

    const timeout =
      setTimeout(() => {

        setDebouncedSearch(
          search
        );

      }, 350);

    return () =>
      clearTimeout(timeout);

  }, [search]);

  useEffect(() => {

    loadListings();

  }, [

    debouncedSearch,

    maxPrice,

    category,

    location,

    sortBy,
  ]);

  async function loadListings() {

    try {

      setLoading(true);

      let query =
        supabase
          .from("listings")
          .select("*")
          .eq(
            "active",
            true
          );

      /*
        SEARCH
      */

      if (
        debouncedSearch.trim()
      ) {

        query =
          query.or(
            `
            title.ilike.%${debouncedSearch}%,
            description.ilike.%${debouncedSearch}%,
            location.ilike.%${debouncedSearch}%,
            category.ilike.%${debouncedSearch}%
            `
          );
      }

      /*
        CATEGORY
      */

      if (

        category &&

        category !== "Alle"
      ) {

        query =
          query.eq(
            "category",
            category
          );
      }

      /*
        LOCATION
      */

      if (
        location.trim()
      ) {

        query =
          query.ilike(
            "location",
            `%${location}%`
          );
      }

      /*
        PRICE
      */

      if (
        maxPrice &&
        !isNaN(
          Number(maxPrice)
        )
      ) {

        query =
          query.lte(
            "price",
            Number(maxPrice)
          );
      }

      /*
        SORT
      */

      if (
        sortBy === "price_asc"
      ) {

        query =
          query.order(
            "price",
            {
              ascending: true,
            }
          );

      } else if (
        sortBy === "price_desc"
      ) {

        query =
          query.order(
            "price",
            {
              ascending: false,
            }
          );

      } else {

        query =
          query.order(
            "created_at",
            {
              ascending: false,
            }
          );
      }

      const {

        data,

        error,

      } =
        await query;

      if (error) {

        console.log(error);

        setListings([]);

        return;
      }

      setListings(
        data || []
      );

    } catch (error) {

      console.log(error);

      setListings([]);

    } finally {

      setLoading(false);
    }
  }

  /*
    LOADING
  */

  if (loading) {

    return (

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        {[1,2,3,4,5,6].map(
          (item) => (

            <div
              key={item}
              className="
                bg-white
                rounded-[30px]
                overflow-hidden
                animate-pulse
              "
            >

              <div
                className="
                  h-60
                  bg-gray-200
                "
              />

              <div className="p-5">

                <div
                  className="
                    h-6
                    bg-gray-200
                    rounded-xl
                    mb-3
                  "
                />

                <div
                  className="
                    h-4
                    bg-gray-100
                    rounded-xl
                    mb-4
                  "
                />

                <div
                  className="
                    h-14
                    bg-gray-100
                    rounded-2xl
                  "
                />

              </div>

            </div>

          )
        )}

      </div>

    );
  }

  /*
    EMPTY
  */

  if (listings.length === 0) {

    return (

      <div
        className="
          bg-white
          rounded-[32px]
          p-10
          md:p-20
          text-center
          shadow-sm
        "
      >

        <div
          className="
            w-20
            h-20
            rounded-full
            bg-[#16d64d]
            text-white
            flex
            items-center
            justify-center
            mx-auto
            mb-6
          "
        >

          <Sparkles
            size={36}
          />

        </div>

        <h2
          className="
            text-3xl
            md:text-5xl
            font-black
            mb-4
          "
        >

          Keine Listings gefunden

        </h2>

        <p
          className="
            text-gray-500
            text-lg
            md:text-2xl
            max-w-2xl
            mx-auto
            leading-relaxed
          "
        >

          Versuche andere Suchbegriffe
          oder ändere deine Filter.

        </p>

      </div>

    );
  }

  return (

    <div>

      {/* TOP BAR */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-8
        "
      >

        <div
          className="
            text-gray-500
            font-bold
            text-lg
          "
        >

          {listings.length}
          {" "}
          Listings gefunden

        </div>

        {/* SORT */}

        <div
          className="
            flex
            items-center
            gap-3
            bg-white
            border
            border-gray-100
            rounded-2xl
            px-4
            h-14
            shadow-sm
          "
        >

          <ArrowUpDown
            size={18}
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="
              bg-transparent
              font-bold
              outline-none
            "
          >

            <option value="newest">

              Neueste

            </option>

            <option value="price_asc">

              Preis aufsteigend

            </option>

            <option value="price_desc">

              Preis absteigend

            </option>

          </select>

        </div>

      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-5
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

    </div>

  );
}