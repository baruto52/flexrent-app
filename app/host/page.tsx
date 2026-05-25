"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {
  Wallet,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function HostPage() {

  const [loading, setLoading] =
    useState(true);

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [earnings, setEarnings] =
    useState(0);

  const [listingsCount, setListingsCount] =
    useState(0);

  useEffect(() => {

    loadHostDashboard();

  }, []);

  const loadHostDashboard =
    async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

        window.location.href =
          "/login";

        return;
      }

      const [
        bookingsRes,
        listingsRes,
      ] =
        await Promise.all([

          supabase
            .from("bookings")
            .select(`
              *,
              listings (
                *
              )
            `)
            .eq(
              "reviewed_user_id",
              session.user.id
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            ),

          supabase
            .from("listings")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "user_id",
              session.user.id
            ),
        ]);

      const bookingsData =
        bookingsRes.data || [];

      setBookings(
        bookingsData
      );

      setListingsCount(
        listingsRes.count || 0
      );

      const total =
        bookingsData.reduce(

          (
            acc,
            booking
          ) =>

            acc +
            (
              booking.total_price ||
              0
            ),

          0
        );

      setEarnings(total);

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
        Host Dashboard wird geladen...
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div className="mb-14">

          <h1
            className="
              text-6xl
              font-black
              mb-4
            "
          >
            Host Dashboard
          </h1>

          <p
            className="
              text-gray-500
              text-2xl
            "
          >
            Verwalte deine Vermietungen
          </p>

        </div>

        {/* STATS */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-8
            mb-14
          "
        >

          {/* EARNINGS */}

          <div
            className="
              bg-white
              rounded-[40px]
              p-10
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-gray-500
                    text-lg
                    mb-3
                  "
                >
                  Einnahmen
                </p>

                <h2
                  className="
                    text-6xl
                    font-black
                  "
                >
                  €
                  {earnings}
                </h2>

              </div>

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

                <Wallet
                  size={38}
                />

              </div>

            </div>

          </div>

          {/* BOOKINGS */}

          <div
            className="
              bg-white
              rounded-[40px]
              p-10
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-gray-500
                    text-lg
                    mb-3
                  "
                >
                  Buchungen
                </p>

                <h2
                  className="
                    text-6xl
                    font-black
                  "
                >
                  {
                    bookings.length
                  }
                </h2>

              </div>

              <div
                className="
                  w-20
                  h-20
                  rounded-[28px]
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <CalendarDays
                  size={38}
                />

              </div>

            </div>

          </div>

          {/* LISTINGS */}

          <div
            className="
              bg-white
              rounded-[40px]
              p-10
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-gray-500
                    text-lg
                    mb-3
                  "
                >
                  Listings
                </p>

                <h2
                  className="
                    text-6xl
                    font-black
                  "
                >
                  {
                    listingsCount
                  }
                </h2>

              </div>

              <div
                className="
                  w-20
                  h-20
                  rounded-[28px]
                  bg-blue-500
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <LayoutDashboard
                  size={38}
                />

              </div>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {bookings.length === 0 ? (

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
                w-28
                h-28
                rounded-full
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
                mx-auto
                mb-10
              "
            >

              <CalendarDays
                size={50}
              />

            </div>

            <h2
              className="
                text-5xl
                font-black
                mb-5
              "
            >
              Noch keine Buchungen
            </h2>

            <p
              className="
                text-gray-500
                text-2xl
              "
            >
              Deine Host Buchungen erscheinen hier.
            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {bookings.map(
              (booking) => {

                const listing =
                  booking.listings;

                return (

                  <div
                    key={booking.id}
                    className="
                      bg-white
                      rounded-[40px]
                      overflow-hidden
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        grid
                        lg:grid-cols-3
                      "
                    >

                      {/* IMAGE */}

                      <div
                        className="
                          relative
                          h-[320px]
                        "
                      >

                        <Image
                          src={
                            listing
                              ?.images?.[0] ||
                            "https://placehold.co/1200x900/png"
                          }
                          alt={
                            listing?.title ||
                            "Listing"
                          }
                          fill
                          className="
                            object-cover
                          "
                        />

                      </div>

                      {/* CONTENT */}

                      <div
                        className="
                          lg:col-span-2
                          p-10
                          flex
                          flex-col
                          justify-between
                        "
                      >

                        <div>

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-5
                              mb-5
                            "
                          >

                            <h2
                              className="
                                text-5xl
                                font-black
                              "
                            >
                              {
                                listing?.title
                              }
                            </h2>

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                                px-5
                                py-3
                                rounded-full
                                bg-green-100
                                text-green-600
                                font-bold
                              "
                            >

                              <CheckCircle2
                                size={20}
                              />

                              {
                                booking.payment_status ||
                                "Bezahlt"
                              }

                            </div>

                          </div>

                          <p
                            className="
                              text-gray-500
                              text-lg
                              mb-6
                            "
                          >
                            {
                              listing?.location
                            }
                          </p>

                          <p
                            className="
                              text-gray-700
                              leading-8
                              line-clamp-3
                            "
                          >
                            {
                              listing?.description
                            }
                          </p>

                        </div>

                        {/* BOTTOM */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            mt-10
                          "
                        >

                          <div>

                            <p
                              className="
                                text-gray-500
                                mb-2
                              "
                            >
                              Einnahme
                            </p>

                            <h3
                              className="
                                text-5xl
                                font-black
                              "
                            >
                              €
                              {
                                booking.total_price
                              }
                            </h3>

                          </div>

                          <div
                            className="
                              text-gray-500
                            "
                          >

                            {new Date(
                              booking.created_at
                            ).toLocaleDateString(
                              "de-DE"
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}