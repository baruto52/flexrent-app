"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { supabase }
from "@/lib/supabase";

export default function HostBookingsPage() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  useEffect(() => {

    loadBookings();

  }, []);

  async function loadBookings() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) return;

    const userId =
      session.user.id;

    const {
      data,
    } =
      await supabase
        .from("bookings")
        .select(`
          *,
          listings (*),
          renter:profiles!bookings_renter_id_fkey (*)
        `)
        .eq(
          "owner_id",
          userId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setBookings(
      data || []
    );

    const revenue =
      (data || []).reduce(
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

    setTotalRevenue(
      revenue
    );

    setLoading(false);
  }

  async function updateStatus(
    bookingId: string,
    status: string
  ) {

    await supabase
      .from("bookings")
      .update({
        status,
      })
      .eq(
        "id",
        bookingId
      );

    loadBookings();
  }

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-black">

        Buchungen laden...

      </div>

    );
  }

  return (

    <main className="min-h-screen bg-[#f7f7f7] p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-black mb-3">

              Vermieter Dashboard

            </h1>

            <p className="text-gray-500 text-xl">

              Deine Buchungen & Einnahmen

            </p>

          </div>

          <div className="bg-white rounded-3xl px-8 py-6 shadow-sm">

            <p className="text-gray-500 mb-2">

              Gesamte Einnahmen

            </p>

            <h2 className="text-5xl font-black text-[#16d64d]">

              €{totalRevenue}

            </h2>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="space-y-6">

          {bookings.map(
            (booking) => (

            <div
              key={booking.id}
              className="bg-white rounded-[32px] p-6 shadow-sm flex flex-col xl:flex-row gap-6"
            >

              {/* IMAGE */}

              <img
                src={
                  booking
                    .listings
                    ?.images?.[0] ||

                  "https://placehold.co/600x400/png"
                }
                className="w-full xl:w-[320px] h-[220px] object-cover rounded-3xl"
              />

              {/* CONTENT */}

              <div className="flex-1">

                <h2 className="text-3xl font-black mb-4">

                  {
                    booking
                      .listings
                      ?.title
                  }

                </h2>

                <div className="space-y-2 text-gray-500 text-lg mb-6">

                  <p>

                    Gast:
                    {" "}
                    {
                      booking
                        .renter
                        ?.full_name ||
                      "User"
                    }

                  </p>

                  <p>

                    Start:
                    {" "}
                    {
                      booking.start_date
                    }

                  </p>

                  <p>

                    Ende:
                    {" "}
                    {
                      booking.end_date
                    }

                  </p>

                  <p>

                    Status:
                    {" "}

                    <span
                      className={`
                        font-bold
                        ${
                          booking.status ===
                          "confirmed"

                            ? "text-green-500"

                            : booking.status ===
                              "cancelled"

                            ? "text-red-500"

                            : "text-yellow-500"
                        }
                      `}
                    >

                      {
                        booking.status
                      }

                    </span>

                  </p>

                  <p>

                    Einnahmen:
                    {" "}

                    <span className="font-black text-black">

                      €
                      {
                        booking.total_price
                      }

                    </span>

                  </p>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-4">

                  <Link
                    href={`/listing/${booking.listing_id}`}
                    className="bg-[#16d64d] text-white px-6 py-3 rounded-2xl font-bold"
                  >

                    Listing ansehen

                  </Link>

                  <button
                    onClick={() =>
                      updateStatus(
                        booking.id,
                        "confirmed"
                      )
                    }
                    className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold"
                  >

                    Bestätigen

                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        booking.id,
                        "cancelled"
                      )
                    }
                    className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold"
                  >

                    Stornieren

                  </button>

                </div>

              </div>

            </div>

          ))}

          {bookings.length === 0 && (

            <div className="bg-white rounded-[32px] p-20 text-center text-gray-500 text-xl">

              Keine Vermietungen vorhanden

            </div>

          )}

        </div>

      </div>

    </main>
  );
}