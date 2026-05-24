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

  CalendarDays,

  Sparkles,

  CheckCircle2,

  XCircle,

  Clock3,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

import BookingCard
from "@/components/BookingCard";

export default function BookingsPage() {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let realtimeChannel: any;

    init().then(
      (channel) => {

        realtimeChannel =
          channel;
      }
    );

    return () => {

      if (realtimeChannel) {

        supabase.removeChannel(
          realtimeChannel
        );
      }
    };

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

    return listenBookings(
      session.user.id
    );
  }

  async function loadBookings(
    userId: string
  ) {

    try {

      const {
        data,
        error,
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
            "renter_id",
            userId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {

        console.log(error);

        setBookings([]);

        return;
      }

      setBookings(
        data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  function listenBookings(
    userId: string
  ) {

    const channel =
      supabase.channel(
        `bookings-${userId}`
      );

    channel.on(

      "postgres_changes",

      {

        event: "*",

        schema: "public",

        table:
          "bookings",

        filter:
          `renter_id=eq.${userId}`,
      },

      () => {

        loadBookings(
          userId
        );
      }

    );

    channel.subscribe();

    return channel;
  }

  async function cancelBooking(
    bookingId: string
  ) {

    const confirmed =
      confirm(
        "Buchung stornieren?"
      );

    if (!confirmed)
      return;

    try {

      await supabase
        .from("bookings")
        .update({

          payment_status:
            "Storniert",

          status:
            "cancelled",
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

                    payment_status:
                      "Storniert",

                    status:
                      "cancelled",
                  }

                : booking
          )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Fehler beim Stornieren"
      );
    }
  }

  /*
    STATS
  */

  const activeBookings =

    bookings.filter(
      (booking) =>

        booking.status ===
        "approved"
    ).length;

  const pendingBookings =

    bookings.filter(
      (booking) =>

        booking.status ===
        "pending"
    ).length;

  const cancelledBookings =

    bookings.filter(
      (booking) =>

        booking.status ===
        "cancelled"
    ).length;

  const totalSpent =

    bookings.reduce(

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

        Buchungen werden geladen...

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
          py-8
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

            <div
              className="
                inline-flex
                items-center
                gap-3
                px-5
                py-3
                rounded-full
                bg-[#16d64d]
                text-white
                font-black
                mb-6
              "
            >

              <CalendarDays
                size={20}
              />

              Meine Buchungen

            </div>

            <h1
              className="
                text-5xl
                md:text-7xl
                font-black
                leading-none
                tracking-tight
              "
            >

              Deine
              <br />

              Buchungen

            </h1>

            <p
              className="
                text-gray-500
                text-lg
                md:text-2xl
                mt-5
                max-w-3xl
              "
            >

              Verwalte deine aktiven,
              offenen und vergangenen
              Buchungen auf FlexRent.

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

            {/* ACTIVE */}

            <div
              className="
                bg-white
                rounded-3xl
                p-6
                shadow-sm
                border
                border-gray-100
                min-w-[170px]
              "
            >

              <CheckCircle2
                size={30}
                className="
                  text-[#16d64d]
                  mb-5
                "
              />

              <p
                className="
                  text-gray-400
                  mb-2
                "
              >

                Aktiv

              </p>

              <h2
                className="
                  text-4xl
                  font-black
                "
              >

                {
                  activeBookings
                }

              </h2>

            </div>

            {/* PENDING */}

            <div
              className="
                bg-white
                rounded-3xl
                p-6
                shadow-sm
                border
                border-gray-100
                min-w-[170px]
              "
            >

              <Clock3
                size={30}
                className="
                  text-yellow-500
                  mb-5
                "
              />

              <p
                className="
                  text-gray-400
                  mb-2
                "
              >

                Offen

              </p>

              <h2
                className="
                  text-4xl
                  font-black
                "
              >

                {
                  pendingBookings
                }

              </h2>

            </div>

            {/* CANCELLED */}

            <div
              className="
                bg-white
                rounded-3xl
                p-6
                shadow-sm
                border
                border-gray-100
                min-w-[170px]
              "
            >

              <XCircle
                size={30}
                className="
                  text-red-500
                  mb-5
                "
              />

              <p
                className="
                  text-gray-400
                  mb-2
                "
              >

                Storniert

              </p>

              <h2
                className="
                  text-4xl
                  font-black
                "
              >

                {
                  cancelledBookings
                }

              </h2>

            </div>

            {/* TOTAL */}

            <div
              className="
                bg-white
                rounded-3xl
                p-6
                shadow-sm
                border
                border-gray-100
                min-w-[170px]
              "
            >

              <Sparkles
                size={30}
                className="
                  text-yellow-500
                  mb-5
                "
              />

              <p
                className="
                  text-gray-400
                  mb-2
                "
              >

                Gesamt

              </p>

              <h2
                className="
                  text-4xl
                  font-black
                "
              >

                €
                {totalSpent}

              </h2>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {bookings.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[44px]
              p-12
              md:p-24
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-32
                h-32
                rounded-full
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
                mx-auto
                mb-10
                shadow-xl
              "
            >

              <CalendarDays
                size={56}
              />

            </div>

            <h2
              className="
                text-4xl
                md:text-6xl
                font-black
                mb-6
              "
            >

              Keine Buchungen

            </h2>

            <p
              className="
                text-gray-500
                text-lg
                md:text-2xl
                max-w-3xl
                mx-auto
                leading-relaxed
              "
            >

              Deine Buchungen erscheinen
              hier sobald du Listings
              erfolgreich buchst.

            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {bookings.map(
              (booking) => (

                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={
                    cancelBooking
                  }
                />

              )
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}