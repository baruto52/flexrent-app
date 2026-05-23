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
      supabase
        .channel(
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

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div className="mb-14">

          <div
            className="
              flex
              items-center
              gap-5
              mb-5
            "
          >

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
                shadow-lg
              "
            >

              <CalendarDays
                size={36}
              />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  md:text-6xl
                  font-black
                "
              >
                Meine Buchungen
              </h1>

              <p
                className="
                  text-gray-500
                  text-xl
                  mt-3
                "
              >
                {
                  bookings.length
                } aktive Buchungen
              </p>

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
              Keine Buchungen
            </h2>

            <p
              className="
                text-gray-500
                text-2xl
              "
            >
              Deine Buchungen erscheinen hier.
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