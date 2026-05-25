"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import {

  Search,

  MapPin,

  SlidersHorizontal,

  Sparkles,

} from "lucide-react";

import Navbar
from "@/components/Navbar";

import Footer
from "@/components/Footer";

import FavoriteButton
from "@/components/FavoriteButton";

import ListingSkeleton
from "@/components/ListingSkeleton";

import { supabase }
from "@/lib/supabase";

import useUserLocation
from "@/hooks/useUserLocation";

import {
  sortByDistance,
} from "@/lib/distance";

type Listing = {

  id: string;

  title: string;

  description: string;

  price: number;

  location: string;

  rental_type: string;

  category?: string;

  images: string[];

  created_at: string;

  latitude?: number;

  longitude?: number;

  distance?: number;

  ai_verified?: boolean;

  trust_score?: number;
};

export default function ExplorePage() {

  const [loading, setLoading] =
    useState(true);

  const [listings, setListings] =
    useState<Listing[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    aiLoading,
    setAiLoading,
  ] = useState(false);

  const [location, setLocation] =
    useState("");

  const [rentalType, setRentalType] =
    useState("Alle");

  const [sortBy, setSortBy] =
    useState("Neueste");

  const [maxPrice, setMaxPrice] =
    useState(10000);

  const [mobileFilters, setMobileFilters] =
    useState(false);

  /*
    INFINITE SCROLL
  */

  const [page, setPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  /*
    USER LOCATION
  */

  const {
    location: userLocation,
  } =
    useUserLocation();

  /*
    INITIAL LOAD
  */

  useEffect(() => {

    loadListings(true);

  }, []);

  /*
    INFINITE SCROLL
  */

  useEffect(() => {

    const handleScroll =
      () => {

        if (

          window.innerHeight +
          window.scrollY >=

          document.body.offsetHeight - 1000 &&

          !loading &&
          hasMore
        ) {

          setPage(
            (prev) =>
              prev + 1
          );
        }
      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>

      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, [loading, hasMore]);

  /*
    LOAD NEXT PAGE
  */

  useEffect(() => {

    if (page > 1) {

      loadListings();
    }

  }, [page]);

  /*
    AI SEARCH
  */

  async function handleAISearch() {

    if (!search)
      return;

    try {

      setAiLoading(true);

      const res =
        await fetch(
          "/api/ai/search",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              query: search,
            }),
          }
        );

      const data =
        await res.json();

      if (
        data?.listings
      ) {

        setListings(
          data.listings
        );

        setHasMore(false);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setAiLoading(false);

    }
  }

  /*
    LOAD LISTINGS
  */

  async function loadListings(
    reset = false
  ) {

    try {

      setLoading(true);

      const from =
        reset
          ? 0
          : (page - 1) * 20;

      const to =
        from + 19;

      const {
        data,
        error,
      } =
        await supabase
          .from("listings")
          .select(`

            id,

            title,

            description,

            price,

            location,

            rental_type,

            category,

            images,

            created_at,

            latitude,

            longitude,

            ai_verified,

            trust_score

          `)
          .eq(
            "active",
            true
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
          .range(
            from,
            to
          );

      if (error) {

        console.log(error);

        return;
      }

      if (
        !data ||
        data.length < 20
      ) {

        setHasMore(false);
      }

      if (reset) {

        setListings(
          data || []
        );

      } else {

        setListings(
          (prev) => [

            ...prev,

            ...(data || []),
          ]
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  /*
    FILTERS
  */

  const filteredListings =
    useMemo(() => {

      let filtered: any =
        [...listings];

      /*
        DISTANCE SORT
      */

      if (userLocation) {

        filtered =
          sortByDistance(

            filtered,

            userLocation.lat,

            userLocation.lng
          );
      }

      /*
        SEARCH
      */

      if (search) {

        filtered =
          filtered.filter(
            (listing: any) =>

              listing.title
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||

              listing.description
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||

              listing.location
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      /*
        LOCATION
      */

      if (location) {

        filtered =
          filtered.filter(
            (listing: any) =>

              listing.location
                ?.toLowerCase()
                .includes(
                  location.toLowerCase()
                )
          );
      }

      /*
        RENTAL TYPE
      */

      if (
        rentalType !==
        "Alle"
      ) {

        filtered =
          filtered.filter(
            (listing: any) =>

              listing.rental_type ===
              rentalType
          );
      }

      /*
        PRICE
      */

      filtered =
        filtered.filter(
          (listing: any) =>

            Number(
              listing.price
            ) <= maxPrice
        );

      /*
        SORT
      */

      switch (sortBy) {

        case "Preis niedrig":

          filtered.sort(
            (a: any, b: any) =>

              a.price -
              b.price
          );

          break;

        case "Preis hoch":

          filtered.sort(
            (a: any, b: any) =>

              b.price -
              a.price
          );

          break;

        default:

          filtered.sort(
            (
              a: any,
              b: any
            ) =>

              new Date(
                b.created_at
              ).getTime() -

              new Date(
                a.created_at
              ).getTime()
          );
      }

      return filtered;

    }, [

      listings,

      search,

      location,

      rentalType,

      sortBy,

      maxPrice,

      userLocation,
    ]);

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      {/* HERO */}

      <section className="px-4 pt-10">

        <div className="max-w-7xl mx-auto">

          <div
            className="
              relative
              overflow-hidden
              rounded-[50px]
              bg-gradient-to-br
              from-[#16d64d]
              to-[#0ca336]
              p-10
              md:p-16
              text-white
            "
          >

            <div
              className="
                absolute
                top-0
                right-0
                opacity-10
                text-[240px]
                font-black
                leading-none
              "
            >

              LOQARO

            </div>

            <div className="relative z-10">

              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  px-5
                  py-3
                  rounded-full
                  bg-white/15
                  backdrop-blur
                  mb-7
                  font-black
                "
              >

                <Sparkles size={20} />

                AI Smart Explore

              </div>

              <h1
                className="
                  text-5xl
                  md:text-7xl
                  font-black
                  tracking-[-4px]
                  leading-[0.95]
                  max-w-4xl
                "
              >

                Entdecke einzigartige Listings

              </h1>

            </div>

          </div>

        </div>

      </section>

      {/* SEARCH */}

      <section className="px-4 mt-8">

        <div className="max-w-7xl mx-auto">

          <div
            className="
              bg-white
              rounded-[40px]
              p-5
              shadow-sm
            "
          >

            <div
              className="
                flex
                flex-col
                xl:flex-row
                gap-5
              "
            >

              <div
                className="
                  flex-1
                  h-16
                  rounded-2xl
                  bg-[#f5f7fb]
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
                  placeholder="AI Suche..."
                  className="
                    bg-transparent
                    w-full
                    text-lg
                  "
                />

              </div>

              <div
                className="
                  flex-1
                  h-16
                  rounded-2xl
                  bg-[#f5f7fb]
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
                    text-lg
                  "
                />

              </div>

              <button
                onClick={
                  handleAISearch
                }
                disabled={
                  aiLoading
                }
                className="
                  h-16
                  px-8
                  rounded-2xl
                  bg-[#16d64d]
                  text-white
                  font-black
                  whitespace-nowrap
                "
              >

                {aiLoading

                  ? "AI sucht..."

                  : "AI Suche"}

              </button>

              <button
                onClick={() =>
                  setMobileFilters(
                    true
                  )
                }
                className="
                  xl:hidden
                  h-16
                  px-6
                  rounded-2xl
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-3
                  font-black
                "
              >

                <SlidersHorizontal
                  size={22}
                />

                Filter

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* LISTINGS */}

      <section className="px-4 py-12">

        <div className="max-w-7xl mx-auto">

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {filteredListings.map(
              (listing: any) => (

                <Link
                  href={`/listing/${listing.id}`}
                  key={listing.id}
                  className="
                    group
                    bg-white
                    rounded-[36px]
                    overflow-hidden
                    shadow-sm
                    hover:shadow-2xl
                    hover:-translate-y-2
                    transition-all
                    duration-300
                  "
                >

                  <div
                    className="
                      relative
                      h-[300px]
                      overflow-hidden
                    "
                  >

                    <Image
                      src={
                        listing.images?.[0] ||

                        "https://placehold.co/1200x900/png"
                      }
                      alt={
                        listing.title
                      }
                      fill
                      loading="lazy"
                      quality={75}
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1280px) 50vw,
                        33vw
                      "
                      className="
                        object-cover
                        group-hover:scale-110
                        transition-transform
                        duration-700
                      "
                    />

                    <FavoriteButton
                      listingId={
                        listing.id
                      }
                    />

                  </div>

                  <div className="p-7">

                    <h2 className="text-3xl font-black line-clamp-1 mb-4">

                      {listing.title}

                    </h2>

                    {listing.ai_verified && (

                      <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16d64d]/10 text-[#16d64d] text-xs font-black">

                        ✓ AI Verified

                      </div>

                    )}

                    {!!listing.trust_score && (

                      <div className="mb-4">

                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/5 text-black text-xs font-black">

                          AI Trust {listing.trust_score}%

                        </div>

                      </div>

                    )}

                    <div className="flex items-center gap-2 text-gray-500 mb-2">

                      <MapPin size={18} />

                      {listing.location}

                    </div>

                    {listing.distance && (

                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#16d64d]/10 text-[#16d64d] text-sm font-black">

                        📍
                        {listing.distance.toFixed(1)}
                        km entfernt

                      </div>

                    )}

                    <p className="text-gray-500 leading-8 line-clamp-2 min-h-[64px] mt-5">

                      {listing.description}

                    </p>

                    <div className="flex items-end justify-between mt-8">

                      <div>

                        <span className="text-5xl font-black">

                          €
                          {listing.price}

                        </span>

                      </div>

                    </div>

                  </div>

                </Link>

              )
            )}

          </div>

          {loading && (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">

              {Array.from({
                length: 6,
              }).map((_, index) => (

                <ListingSkeleton
                  key={index}
                />

              ))}

            </div>

          )}

          {!hasMore && (

            <div className="text-center py-10 text-gray-400 font-bold">

              Keine weiteren Listings

            </div>

          )}

        </div>

      </section>

      <Footer />

    </main>
  );
}