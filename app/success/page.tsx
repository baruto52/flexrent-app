"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  CheckCircle2,
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
      } = parsed;

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

      <div className="min-h-screen flex items-center justify-center text-3xl font-black">

        Buchung wird gespeichert...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">

      <div className="bg-white rounded-[40px] shadow-xl p-12 max-w-2xl w-full text-center">

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
          "
        >

          <CheckCircle2
            size={70}
          />

        </div>

        <h1 className="text-6xl font-black mb-6 text-[#16d64d]">

          Zahlung erfolgreich

        </h1>

        <p className="text-gray-500 text-2xl leading-10 mb-12">

          Deine Buchung wurde erfolgreich gespeichert.
          Der Vermieter wurde informiert.

        </p>

        <div className="flex flex-col md:flex-row gap-5 justify-center">

          <Link
            href="/bookings"
            className="bg-[#16d64d] hover:opacity-90 text-white px-10 py-5 rounded-2xl font-black text-lg"
          >

            Meine Buchungen

          </Link>

          <Link
            href="/"
            className="border border-gray-200 hover:bg-gray-100 px-10 py-5 rounded-2xl font-black text-lg"
          >

            Startseite

          </Link>

        </div>

        {saved && (

          <p className="text-green-500 mt-8 font-bold">

            Buchung erfolgreich gespeichert

          </p>

        )}

      </div>

    </div>

  );
}