"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import ListingCard from "@/components/ListingCard";

import {

  MapPin,

  Star,

  ShieldCheck,

  Package,

  CalendarDays,

  MessageCircle,

  Clock3,

  BadgeCheck,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function UserProfilePage() {

  const params =
    useParams();

  const userId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const [profile, setProfile] =
    useState<any>(null);

  const [listings, setListings] =
    useState<any[]>([]);

  const [bookingsCount, setBookingsCount] =
    useState(0);

  const [reviewsCount, setReviewsCount] =
    useState(0);

  const [averageRating, setAverageRating] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (userId) {

      loadProfile(
        userId
      );
    }

  }, [userId]);

  const loadProfile =
    async (
      id: string
    ) => {

      /*
        PROFILE
      */

      const {
        data: profileData,
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .maybeSingle();

      /*
        LISTINGS
      */

      const {
        data: listingsData,
      } =
        await supabase
          .from("listings")
          .select("*")
          .eq(
            "user_id",
            id
          )
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

      /*
        BOOKINGS
      */

      const {
        count: bookings,
      } =
        await supabase
          .from("bookings")
          .select(
            "*",
            {
              count: "exact",
              head: true,
            }
          )
          .eq(
            "reviewed_user_id",
            id
          );

      /*
        REVIEWS
      */

      const {
        data: reviews,
      } =
        await supabase
          .from("reviews")
          .select("rating")
          .eq(
            "reviewed_user_id",
            id
          );

      let avg = 0;

      if (
        reviews &&
        reviews.length > 0
      ) {

        avg =
          reviews.reduce(
            (
              acc,
              review
            ) =>

              acc +
              review.rating,

            0
          ) /
          reviews.length;
      }

      setProfile(
        profileData
      );

      setListings(
        listingsData || []
      );

      setBookingsCount(
        bookings || 0
      );

      setReviewsCount(
        reviews?.length || 0
      );

      setAverageRating(
        Number(
          avg.toFixed(1)
        )
      );

      setLoading(false);
    };

  if (loading) {

    return (

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
        Profil wird geladen...
      </div>

    );
  }

  if (!profile) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-4xl
          font-black
        "
      >
        Profil nicht gefunden
      </div>

    );
  }

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      {/* HERO */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#16d64d]
          to-[#0ca336]
          text-white
        "
      >

        <div
          className="
            absolute
            inset-0
            opacity-10
            bg-[url('/noise.png')]
          "
        />

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-20
            relative
            z-10
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-12
              items-center
            "
          >

            {/* AVATAR */}

            <div className="relative">

              <div
                className="
                  w-52
                  h-52
                  rounded-full
                  overflow-hidden
                  border-[6px]
                  border-white
                  shadow-2xl
                  bg-white
                "
              >

                <Image
                  src={
                    profile.avatar_url ||
                    "https://placehold.co/400x400/png"
                  }
                  alt="Avatar"
                  width={500}
                  height={500}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>

              <div
                className="
                  absolute
                  bottom-3
                  right-3
                  w-16
                  h-16
                  rounded-full
                  bg-black
                  border-4
                  border-white
                  flex
                  items-center
                  justify-center
                "
              >

                <ShieldCheck
                  size={30}
                />

              </div>

            </div>

            {/* INFO */}

            <div className="flex-1">

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-4
                  mb-6
                "
              >

                <h1
                  className="
                    text-6xl
                    font-black
                  "
                >

                  {
                    profile.full_name ||
                    "Gastgeber"
                  }

                </h1>

                <div
                  className="
                    px-5
                    py-3
                    rounded-full
                    bg-white/15
                    backdrop-blur
                    border
                    border-white/20
                    flex
                    items-center
                    gap-2
                    font-bold
                  "
                >

                  <BadgeCheck
                    size={18}
                  />

                  Verifizierter Host

                </div>

              </div>

              {/* META */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-6
                  text-lg
                  text-white/90
                  mb-8
                "
              >

                {profile.location && (

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <MapPin
                      size={20}
                    />

                    {
                      profile.location
                    }

                  </div>

                )}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Star
                    size={20}
                    className="
                      fill-yellow-300
                      text-yellow-300
                    "
                  />

                  {
                    averageRating || 0
                  } Bewertung

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Clock3
                    size={20}
                  />

                  Antwortet meist innerhalb 1 Stunde

                </div>

              </div>

              {/* BIO */}

              <p
                className="
                  text-xl
                  leading-10
                  max-w-4xl
                  text-white/90
                "
              >

                {
                  profile.bio ||

                  "Dieser Gastgeber hat noch keine Beschreibung hinzugefügt."
                }

              </p>

              {/* BUTTONS */}

              <div
                className="
                  flex
                  flex-wrap
                  gap-5
                  mt-10
                "
              >

                <Link
                  href={`/messages/${userId}`}
                  className="
                    h-16
                    px-8
                    rounded-2xl
                    bg-black
                    text-white
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    text-lg
                    font-black
                    hover:scale-[1.03]
                    transition
                  "
                >

                  <MessageCircle
                    size={22}
                  />

                  Nachricht senden

                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* STATS */}

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-6
            mb-14
          "
        >

          {/* LISTINGS */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-3
              "
            >

              <Package
                size={24}
                className="
                  text-[#16d64d]
                "
              />

              <p className="text-gray-500">
                Listings
              </p>

            </div>

            <h3
              className="
                text-5xl
                font-black
              "
            >

              {
                listings.length
              }

            </h3>

          </div>

          {/* BOOKINGS */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-3
              "
            >

              <CalendarDays
                size={24}
              />

              <p className="text-gray-500">
                Buchungen
              </p>

            </div>

            <h3
              className="
                text-5xl
                font-black
              "
            >

              {
                bookingsCount
              }

            </h3>

          </div>

          {/* REVIEWS */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-3
              "
            >

                <Star
                size={24}
                className="
                  text-yellow-500
                "
              />

              <p className="text-gray-500">
                Reviews
              </p>

            </div>

            <h3
              className="
                text-5xl
                font-black
              "
            >

              {
                reviewsCount
              }

            </h3>

          </div>

          {/* RATING */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-3
              "
            >

              <ShieldCheck
                size={24}
                className="
                  text-[#16d64d]
                "
              />

              <p className="text-gray-500">
                Bewertung
              </p>

            </div>

            <h3
              className="
                text-5xl
                font-black
              "
            >

              {
                averageRating || 0
              }

            </h3>

          </div>

        </div>

        {/* LISTINGS */}

        <div>

          <div
            className="
              flex
              items-center
              justify-between
              mb-8
            "
          >

            <h2
              className="
                text-5xl
                font-black
              "
            >

              Anzeigen von {
                profile.full_name
              }

            </h2>

          </div>

          {listings.length === 0 ? (

            <div
              className="
                bg-white
                rounded-[32px]
                p-24
                text-center
                shadow-sm
              "
            >

              <h3
                className="
                  text-4xl
                  font-black
                  mb-4
                "
              >

                Keine aktiven Listings

              </h3>

              <p className="text-gray-500">

                Dieser Nutzer hat aktuell
                keine aktiven Anzeigen.

              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-4
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

      </div>

      <Footer />

    </main>

  );
}