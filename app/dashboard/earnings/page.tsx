"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar
from "@/components/Navbar";

import Footer
from "@/components/Footer";

import {

  Euro,

  TrendingUp,

  Wallet,

  CalendarDays,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function EarningsPage() {

  const [earnings, setEarnings] =
    useState(0);

  const [monthly, setMonthly] =
    useState(0);

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    init();

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {

      window.location.href =
        "/login";

      return;
    }

    await loadData(
      session.user.id
    );
  }

  async function loadData(
    ownerId: string
  ) {

    try {

      const {
        data,
      } =
        await supabase
          .from("bookings")
          .select(`
            *,
            listings (
              *
            )
          `)
          .eq(
            "reviewed_user_id",
            ownerId
          )
          .eq(
            "status",
            "approved"
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      const all =
        data || [];

      setBookings(all);

      /*
        TOTAL
      */

      const total =

        all.reduce(

          (
            acc,
            booking
          ) =>

            acc +
            (
              Number(
                booking.total_price
              ) || 0
            ),

          0
        );

      setEarnings(
        total
      );

      /*
        MONTHLY
      */

      const currentMonth =
        new Date().getMonth();

      const currentYear =
        new Date().getFullYear();

      const monthlyTotal =

        all
          .filter(
            (booking) => {

              const date =
                new Date(
                  booking.created_at
                );

              return (

                date.getMonth() ===
                  currentMonth &&

                date.getFullYear() ===
                  currentYear
              );
            }
          )
          .reduce(

            (
              acc,
              booking
            ) =>

              acc +
              (
                Number(
                  booking.total_price
                ) || 0
              ),

            0
          );

      setMonthly(
        monthlyTotal
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

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

        Lade Einnahmen...

      </div>

    );
  }

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-10
        "
      >

        {/* HEADER */}

        <div className="mb-12">

          <h1
            className="
              text-5xl
              md:text-7xl
              font-black
              leading-none
              mb-5
            "
          >

            Earnings
            <br />
            Dashboard

          </h1>

          <p
            className="
              text-gray-500
              text-xl
            "
          >

            Verfolge deine Einnahmen
            und Auszahlungen.

          </p>

        </div>

        {/* STATS */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            mb-12
          "
        >

          {/* TOTAL */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-8
              shadow-sm
            "
          >

            <Euro
              size={38}
              className="
                text-[#16d64d]
                mb-6
              "
            />

            <p
              className="
                text-gray-400
                mb-3
              "
            >

              Gesamte Einnahmen

            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >

              €
              {earnings}

            </h2>

          </div>

          {/* MONTH */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-8
              shadow-sm
            "
          >

            <TrendingUp
              size={38}
              className="
                text-blue-500
                mb-6
              "
            />

            <p
              className="
                text-gray-400
                mb-3
              "
            >

              Diesen Monat

            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >

              €
              {monthly}

            </h2>

          </div>

          {/* BOOKINGS */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-8
              shadow-sm
            "
          >

            <Wallet
              size={38}
              className="
                text-yellow-500
                mb-6
              "
            />

            <p
              className="
                text-gray-400
                mb-3
              "
            >

              Erfolgreiche Buchungen

            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >

              {
                bookings.length
              }

            </h2>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="space-y-6">

          {bookings.map(
            (booking) => (

              <div
                key={booking.id}
                className="
                  bg-white
                  rounded-[36px]
                  p-8
                  shadow-sm
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-8
                  "
                >

                  {/* LEFT */}

                  <div
                    className="
                      flex
                      items-center
                      gap-5
                    "
                  >

                    <img
                      src={
                        booking
                          .listings
                          ?.image_url ||

                        "/placeholder.jpg"
                      }
                      className="
                        w-32
                        h-32
                        rounded-3xl
                        object-cover
                      "
                    />

                    <div>

                      <h2
                        className="
                          text-3xl
                          font-black
                          mb-3
                        "
                      >

                        {
                          booking
                            .listings
                            ?.title
                        }

                      </h2>

                      <div
                        className="
                          space-y-2
                          text-gray-500
                        "
                      >

                        <p>

                          {
                            booking.start_date
                          }

                          {" "}
                          -
                          {" "}

                          {
                            booking.end_date
                          }

                        </p>

                        <p
                          className="
                            font-black
                            text-black
                            text-xl
                          "
                        >

                          €
                          {
                            booking.total_price
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      px-5
                      py-3
                      rounded-2xl
                      bg-[#16d64d]/10
                      text-[#16d64d]
                      font-black
                    "
                  >

                    Ausgezahlt

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

      <Footer />

    </main>
  );
}