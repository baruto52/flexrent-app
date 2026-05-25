"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {

  CheckCircle2,

  Sparkles,

  ShieldCheck,

  CalendarDays,

  ArrowRight,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function SuccessPage() {

  const [loading, setLoading] =
    useState(true);

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {

    saveBooking();

  }, []);

  async function saveBooking() {

    try {

      const bookingData =
        localStorage.getItem(
          "pendingBooking"
        );

      if (!bookingData) {

        setLoading(false);

        return;
      }

      const parsed =
        JSON.parse(
          bookingData
        );

      const {

        listingId,

        renterId,

        ownerId,

        totalPrice,

        startDate,

        endDate,

        title,

      } = parsed;

      /*
        GET USER
      */

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      /*
        CHECK EXISTING
      */

      const {
        data: existing,
      } =
        await supabase
          .from("bookings")
          .select("id")
          .eq(
            "listing_id",
            listingId
          )
          .eq(
            "renter_id",
            renterId
          )
          .eq(
            "start_date",
            startDate
          )
          .eq(
            "end_date",
            endDate
          )
          .maybeSingle();

      /*
        INSERT BOOKING
      */

      if (!existing) {

        await supabase
          .from("bookings")
          .insert({

            listing_id:
              listingId,

            renter_id:
              renterId,

            owner_id:
              ownerId,

            total_price:
              totalPrice,

            start_date:
              startDate,

            end_date:
              endDate,

            payment_status:
              "Bezahlt",

            status:
              "confirmed",
          });
      }

      /*
        SEND EMAIL
      */

      if (user?.email) {

        await fetch(
          "/api/send-booking-email",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              email:
                user.email,

              title:
                title ||

                "Loqaro Buchung",

              startDate,

              endDate,

              totalPrice,
            }),
          }
        );
      }

      /*
        CLEANUP
      */

      localStorage.removeItem(
        "pendingBooking"
      );

      setSaved(true);

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

        Buchung wird gespeichert...

      </div>

    );
  }

  return (

    <main
      className="
        min-h-screen
        bg-[#f5f7fb]
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          bg-white
          rounded-[44px]
          shadow-2xl
          p-8
          md:p-16
          max-w-3xl
          w-full
          text-center
          border
          border-gray-100
        "
      >

        {/* ICON */}

        <div
          className="
            w-36
            h-36
            rounded-full
            bg-[#16d64d]
            text-white
            flex
            items-center
            justify-center
            mx-auto
            mb-10
            shadow-2xl
          "
        >

          <CheckCircle2
            size={80}
          />

        </div>

        {/* BADGE */}

        <div
          className="
            inline-flex
            items-center
            gap-3
            px-5
            py-3
            rounded-full
            bg-[#16d64d]/10
            text-[#16d64d]
            font-black
            mb-8
          "
        >

          <Sparkles
            size={20}
          />

          Zahlung erfolgreich

        </div>

        {/* TITLE */}

        <h1
          className="
            text-5xl
            md:text-7xl
            font-black
            leading-none
            tracking-tight
            mb-8
          "
        >

          Buchung
          <br />

          bestätigt

        </h1>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-500
            text-lg
            md:text-2xl
            leading-relaxed
            max-w-2xl
            mx-auto
            mb-12
          "
        >

          Deine Zahlung wurde erfolgreich
          verarbeitet. Der Vermieter wurde
          informiert und deine Buchung
          ist jetzt bestätigt.

        </p>

        {/* FEATURES */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-5
            mb-12
          "
        >

          <div
            className="
              bg-[#f5f7fb]
              rounded-3xl
              p-6
            "
          >

            <ShieldCheck
              size={34}
              className="
                text-[#16d64d]
                mx-auto
                mb-4
              "
            />

            <h3
              className="
                font-black
                text-lg
                mb-2
              "
            >

              Sicher bezahlt

            </h3>

            <p
              className="
                text-gray-500
                text-sm
              "
            >

              Geschützte Stripe Zahlung

            </p>

          </div>

          <div
            className="
              bg-[#f5f7fb]
              rounded-3xl
              p-6
            "
          >

            <CalendarDays
              size={34}
              className="
                text-[#16d64d]
                mx-auto
                mb-4
              "
            />

            <h3
              className="
                font-black
                text-lg
                mb-2
              "
            >

              Buchung aktiv

            </h3>

            <p
              className="
                text-gray-500
                text-sm
              "
            >

              Zeitraum gespeichert

            </p>

          </div>

          <div
            className="
              bg-[#f5f7fb]
              rounded-3xl
              p-6
            "
          >

            <Sparkles
              size={34}
              className="
                text-[#16d64d]
                mx-auto
                mb-4
              "
            />

            <h3
              className="
                font-black
                text-lg
                mb-2
              "
            >

              Email versendet

            </h3>

            <p
              className="
                text-gray-500
                text-sm
              "
            >

              Buchungsbestätigung gesendet

            </p>

          </div>

        </div>

        {/* BUTTONS */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-5
            justify-center
          "
        >

          <Link
            href="/bookings"
            className="
              h-16
              px-10
              rounded-2xl
              bg-[#16d64d]
              text-white
              font-black
              text-lg
              flex
              items-center
              justify-center
              gap-3
              shadow-lg
            "
          >

            Meine Buchungen

            <ArrowRight
              size={20}
            />

          </Link>

          <Link
            href="/"
            className="
              h-16
              px-10
              rounded-2xl
              border
              border-gray-200
              bg-white
              font-black
              text-lg
              flex
              items-center
              justify-center
            "
          >

            Zur Startseite

          </Link>

        </div>

        {/* STATUS */}

        {saved && (

          <div
            className="
              mt-10
              inline-flex
              items-center
              gap-3
              px-5
              py-3
              rounded-full
              bg-green-100
              text-green-700
              font-black
            "
          >

            <CheckCircle2
              size={20}
            />

            Buchung erfolgreich gespeichert

          </div>

        )}

      </div>

    </main>

  );
}