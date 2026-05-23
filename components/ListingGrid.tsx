"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {

  MapPin,

  Sparkles,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

import FavoriteButton
from "@/components/FavoriteButton";

type Listing = {

  id: string;

  title: string;

  description: string;

  location: string;

  price: number;

  images: string[];

  category?: string;

  active?: boolean;
};

interface Props {

  search?: string;

  maxPrice?: string;

  category?: string;
}

export default function ListingGrid({

  search = "",

  maxPrice = "",

  category = "Alle",

}: Props) {

  const [listings, setListings] =
    useState<Listing[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [debouncedSearch, setDebouncedSearch] =
    useState(search);

  /* DEBOUNCE */

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

  /* LOAD */

  useEffect(() => {

    loadListings();

  }, [

    debouncedSearch,

    maxPrice,

    category,
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
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      /* SEARCH */

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

      /* CATEGORY */

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

      /* PRICE */

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

  /* LOADING */

  if (loading) {

    return (

      <div
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
        "
      >

        {[1,2,3,4,5,6].map(
          (item) => (

            <div
              key={item}
              className="
                bg-white
                rounded-[36px]
                overflow-hidden
                animate-pulse
              "
            >

              <div
                className="
                  h-72
                  bg-gray-200
                "
              />

              <div className="p-6">

                <div
                  className="
                    h-8
                    bg-gray-200
                    rounded-xl
                    mb-4
                  "
                />

                <div
                  className="
                    h-5
                    bg-gray-100
                    rounded-xl
                    mb-6
                  "
                />

                <div
                  className="
                    h-20
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

  /* EMPTY */

  if (listings.length === 0) {

    return (

      <div
        className="
          bg-white
          rounded-[40px]
          p-20
          text-center
          shadow-sm
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
            text-5xl
            font-black
            mb-5
          "
        >
          Keine Listings gefunden
        </h2>

        <p
          className="
            text-gray-500
            text-2xl
            max-w-2xl
            mx-auto
            leading-10
          "
        >
          Versuche andere Suchbegriffe
          oder ändere deinen Preisfilter.
        </p>

      </div>

    );
  }

  return (

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

          <Link
            key={listing.id}
            href={`/listing/${listing.id}`}
            className="
              bg-white
              rounded-[36px]
              overflow-hidden
              shadow-sm
              hover:shadow-2xl
              transition-all
              duration-300
              hover:-translate-y-2
              group
              relative
            "
          >

            {/* IMAGE */}

            <div
              className="
                relative
                h-72
                overflow-hidden
              "
            >

              <img
  src={
    Array.isArray(listing.images)
      ? listing.images[0]
      : typeof listing.images === "string"
      ? JSON.parse(listing.images || "[]")[0]
      : "https://placehold.co/1200x900/png"
  }
  alt={listing.title}
  className="
    w-full
    h-full
    object-cover
    group-hover:scale-105
    transition
    duration-500
  "
/>

              {/* CATEGORY */}

              <div
                className="
                  absolute
                  top-5
                  left-5
                  px-4
                  py-2
                  rounded-full
                  bg-black/70
                  text-white
                  text-sm
                  font-bold
                  backdrop-blur
                  z-10
                "
              >

                {
                  listing.category ||

                  "Listing"
                }

              </div>

              {/* FAVORITE */}

              <FavoriteButton
                listingId={listing.id}
              />

            </div>

            {/* CONTENT */}

            <div className="p-7">

              <h2
                className="
                  text-3xl
                  font-black
                  mb-4
                  line-clamp-1
                "
              >
                {
                  listing.title
                }
              </h2>

              {/* LOCATION */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-gray-500
                  mb-5
                "
              >

                <MapPin
                  size={18}
                />

                <span className="line-clamp-1">

                  {
                    listing.location
                  }

                </span>

              </div>

              {/* DESCRIPTION */}

              <p
                className="
                  text-gray-600
                  leading-8
                  line-clamp-2
                  mb-8
                "
              >

                {
                  listing.description
                }

              </p>

              {/* BOTTOM */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p className="text-gray-500 mb-1">
                    Preis
                  </p>

                  <h3
                    className="
                      text-5xl
                      font-black
                    "
                  >

                    €
                    {
                      listing.price
                    }

                  </h3>

                </div>

                <div
                  className="
                    h-14
                    px-6
                    rounded-2xl
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                    gap-3
                    font-bold
                  "
                >

                  <Sparkles
                    size={18}
                  />

                  Öffnen

                </div>

              </div>

            </div>

          </Link>

        )
      )}

    </div>
  );
}