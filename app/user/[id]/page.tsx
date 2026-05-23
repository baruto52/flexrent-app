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

      /* PROFILE */

      const {
        data: profileData,
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .maybeSingle();

      /* LISTINGS */

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

      /* BOOKINGS */

      const {
        count,
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
            "owner_id",
            id
          );

      setProfile(
        profileData
      );

      setListings(
        listingsData || []
      );

      setBookingsCount(
        count || 0
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

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* PROFILE */}

        <div
          className="
            bg-white
            rounded-[40px]
            p-10
            shadow-sm
            mb-10
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-10
              items-center
            "
          >

            {/* AVATAR */}

            <div className="relative">

              <div
                className="
                  w-44
                  h-44
                  rounded-full
                  overflow-hidden
                  border-4
                  border-[#16d64d]
                  bg-gray-100
                "
              >

                <Image
                  src={
                    profile.avatar_url ||
                    "https://placehold.co/400x400/png"
                  }
                  alt="Avatar"
                  width={400}
                  height={400}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>

              {/* VERIFIED */}

              <div
                className="
                  absolute
                  bottom-2
                  right-2
                  w-14
                  h-14
                  rounded-full
                  bg-[#16d64d]
                  text-white
                  flex
                  items-center
                  justify-center
                  border-4
                  border-white
                "
              >

                <ShieldCheck
                  size={26}
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
                  mb-5
                "
              >

                <h1
                  className="
                    text-5xl
                    font-black
                  "
                >
                  {
                    profile.full_name ||
                    "Unbekannter Nutzer"
                  }
                </h1>

                <div
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-[#16d64d]/10
                    text-[#16d64d]
                    font-bold
                  "
                >
                  Verifiziert
                </div>

              </div>

              {/* META */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-6
                  text-gray-500
                  text-lg
                  mb-6
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
                      fill-yellow-400
                      text-yellow-400
                    "
                  />

                  4.9 Bewertung

                </div>

              </div>

              {/* BIO */}

              <p
                className="
                  text-lg
                  text-gray-700
                  leading-9
                  max-w-3xl
                "
              >

                {
                  profile.bio ||
                  "Noch keine Beschreibung vorhanden."
                }

              </p>

              {/* BUTTON */}

              <div className="mt-8">

                <Link
                  href={`/messages/${userId}`}
                  className="
                    inline-flex
                    h-14
                    px-7
                    rounded-2xl
                    bg-black
                    text-white
                    items-center
                    justify-center
                    gap-3
                    font-bold
                  "
                >

                  <MessageCircle
                    size={20}
                  />

                  Nachricht senden

                </Link>

              </div>

              {/* STATS */}

              <div
                className="
                  grid
                  md:grid-cols-3
                  gap-5
                  mt-10
                "
              >

                {/* LISTINGS */}

                <div
                  className="
                    bg-[#f5f7fb]
                    rounded-3xl
                    px-6
                    py-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-2
                    "
                  >

                    <Package
                      size={22}
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
                      text-4xl
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
                    bg-[#f5f7fb]
                    rounded-3xl
                    px-6
                    py-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-2
                    "
                  >

                    <CalendarDays
                      size={22}
                      className="
                        text-black
                      "
                    />

                    <p className="text-gray-500">
                      Buchungen
                    </p>

                  </div>

                  <h3
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    {
                      bookingsCount
                    }
                  </h3>

                </div>

                {/* RATING */}

                <div
                  className="
                    bg-[#f5f7fb]
                    rounded-3xl
                    px-6
                    py-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-2
                    "
                  >

                    <Star
                      size={22}
                      className="
                        text-yellow-500
                      "
                    />

                    <p className="text-gray-500">
                      Bewertung
                    </p>

                  </div>

                  <h3
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    4.9
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* LISTINGS */}

        <div className="mb-10">

          <h2
            className="
              text-4xl
              font-black
              mb-8
            "
          >

            Anzeigen von {
              profile.full_name
            }

          </h2>

          {listings.length === 0 ? (

            <div
              className="
                bg-white
                rounded-[32px]
                p-20
                text-center
                shadow-sm
              "
            >

              <h3
                className="
                  text-3xl
                  font-black
                  mb-4
                "
              >
                Keine Anzeigen
              </h3>

              <p className="text-gray-500">
                Dieser Nutzer hat noch
                keine aktiven Anzeigen erstellt.
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