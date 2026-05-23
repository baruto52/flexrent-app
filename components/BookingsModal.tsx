"use client";

import React, {
  useState,
} from "react";

import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

type Props = {

  listing: any;

  user: any;

  onClose: () => void;

  onBooked: () => void;
};

export default function BookingsModal({

  listing,

  user,

  onClose,

  onBooked,
}: Props) {

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function createBooking() {

    if (
      !startDate ||
      !endDate
    ) {

      toast.error(
        "Bitte Zeitraum wählen"
      );

      return;
    }

    setLoading(true);

    const totalPrice =
      Number(
        listing.price || 0
      );

    const { error } =
      await supabase
        .from("bookings")
        .insert({

          listing_id:
            listing.id,

          renter_id:
            user?.id,

          owner_id:
            listing.user_id,

          start_date:
            startDate,

          end_date:
            endDate,

          total_price:
            totalPrice,

          status:
            "pending",
        });

    setLoading(false);

    if (error) {

      toast.error(
        "Buchung fehlgeschlagen"
      );

      return;
    }

    toast.success(
      "Buchung erstellt"
    );

    onBooked();
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-xl w-full p-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-4xl font-black">

              Buchung

            </h2>

            <p className="text-gray-500">

              {listing.title}

            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >

            ×

          </button>

        </div>

        {/* PRICE */}

        <div className="bg-green-50 rounded-3xl p-6 mb-8">

          <p className="text-gray-500 mb-2">

            Preis

          </p>

          <h3 className="text-5xl font-black text-green-600">

            € {listing.price}

          </h3>

        </div>

        {/* START */}

        <div className="mb-5">

          <label className="block font-semibold mb-2">

            Startdatum

          </label>

          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-5 py-4"
          />

        </div>

        {/* END */}

        <div className="mb-8">

          <label className="block font-semibold mb-2">

            Enddatum

          </label>

          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-5 py-4"
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={createBooking}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-bold text-lg"
        >

          {loading
            ? "Wird erstellt..."
            : "Jetzt buchen"}

        </button>

      </div>

    </div>

  );
}