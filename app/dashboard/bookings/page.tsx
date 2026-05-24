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

  CheckCircle2,

  XCircle,

  Clock3,

  Euro,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function OwnerBookingsPage() {

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

    await loadBookings(
      session.user.id
    );
  }

  async function loadBookings(
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
            "owner_id",
            ownerId
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

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  async function updateBooking(
    bookingId: string,
    status: string
  ) {

    try {

      await supabase
        .from("bookings")
        .update({

          status,
        })
        .eq(
          "id",
          bookingId
        );

      setBookings(
        (prev) =>

          prev.map(
            (booking) =>

              booking.id ===
              bookingId

                ? {
                    ...booking,
                    status,
                  }

                : booking
          )
      );

    } catch (error) {

      console.log(error);
    }
  }

  const earnings =

    bookings
      .filter(
        (booking) =>

          booking.status ===
          "approved"
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

  const pending =

    bookings.filter(
      (booking) =>

        booking.status ===
        "pending"
    ).length;

  const approved =

    bookings.filter(
      (booking) =>

        booking.status ===
        "approved"
    ).length;

  const rejected =

    bookings.filter(
      (booking) =>

        booking.status ===
        "rejected"
    ).length;

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

        Lade Buchungen...

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

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-8
            mb-12
          "
        >

          <div>

            <h1
              className="
                text-5xl
                md:text-7xl
                font-black
                leading-none
              "
            >

              Booking
              <br />
              Dashboard

            </h1>

            <p
              className="
                text-gray-500
                text-xl
                mt-5
              "
            >

              Verwalte deine
              Buchungsanfragen.

            </p>

          </div>

          {/* STATS */}

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-5
            "
          >

            <StatCard
              title="Offen"
              value={pending}
              icon={
                <Clock3
                  className="
                    text-yellow-500
                  "
                />
              }
            />

            <StatCard
              title="Bestätigt"
              value={approved}
              icon={
                <CheckCircle2
                  className="
                    text-[#16d64d]
                  "
                />
              }
            />

            <StatCard
              title="Abgelehnt"
              value={rejected}
              icon={
                <XCircle
                  className="
                    text-red-500
                  "
                />
              }
            />

            <StatCard
              title="Einnahmen"
              value={`€${earnings}`}
              icon={
                <Euro
                  className="
                    text-blue-500
                  "
                />
              }
            />

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

                          Von:
                          {" "}
                          {
                            booking.start_date
                          }

                        </p>

                        <p>

                          Bis:
                          {" "}
                          {
                            booking.end_date
                          }

                        </p>

                        <p
                          className="
                            font-black
                            text-black
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
                      flex
                      flex-col
                      items-start
                      lg:items-end
                      gap-4
                    "
                  >

                    {/* STATUS */}

                    <div
                      className={`
                        px-5
                        py-3
                        rounded-2xl
                        text-sm
                        font-black

                        ${
                          booking.status ===
                          "approved"

                            ? `
                              bg-[#16d64d]/10
                              text-[#16d64d]
                            `

                            : booking.status ===
                              "rejected"

                            ? `
                              bg-red-100
                              text-red-500
                            `

                            : `
                              bg-yellow-100
                              text-yellow-600
                            `
                        }
                      `}
                    >

                      {
                        booking.status ===
                        "approved"

                          ? "Bestätigt"

                          : booking.status ===
                            "rejected"

                          ? "Abgelehnt"

                          : "Offen"
                      }

                    </div>

                    {/* ACTIONS */}

                    {booking.status ===
                      "pending" && (

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <button
                          onClick={() =>
                            updateBooking(
                              booking.id,
                              "approved"
                            )
                          }
                          className="
                            h-14
                            px-6
                            rounded-2xl
                            bg-[#16d64d]
                            text-white
                            font-black
                          "
                        >

                          Akzeptieren

                        </button>

                        <button
                          onClick={() =>
                            updateBooking(
                              booking.id,
                              "rejected"
                            )
                          }
                          className="
                            h-14
                            px-6
                            rounded-2xl
                            bg-red-500
                            text-white
                            font-black
                          "
                        >

                          Ablehnen

                        </button>

                      </div>

                    )}

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

function StatCard({

  title,

  value,

  icon,

}: any) {

  return (

    <div
      className="
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border
        border-gray-100
      "
    >

      <div className="mb-5">

        {icon}

      </div>

      <p
        className="
          text-gray-400
          mb-2
        "
      >

        {title}

      </p>

      <h2
        className="
          text-4xl
          font-black
        "
      >

        {value}

      </h2>

    </div>

  );
}