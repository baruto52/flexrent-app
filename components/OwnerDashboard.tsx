"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {

  FaEuroSign,

  FaBox,

  FaCalendarCheck,

  FaChartLine,

} from "react-icons/fa";

import { supabase } from "@/lib/supabase";

type Props = {

  user: any;

  onClose: () => void;
};

export default function OwnerDashboard({

  user,

  onClose,
}: Props) {

  const [stats, setStats] =
    useState({

      listings: 0,

      bookings: 0,

      revenue: 0,
    });

  useEffect(() => {

    loadStats();

  }, []);

  async function loadStats() {

    // LISTINGS

    const {
      data: listings,
    } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "user_id",
          user?.id
        );

    // BOOKINGS

    const {
      data: bookings,
    } =
      await supabase
        .from("bookings")
        .select("*")
        .eq(
          "owner_id",
          user?.id
        );

    const revenue =
      bookings?.reduce(
        (
          total,
          booking
        ) =>
          total +
          Number(
            booking.total_price || 0
          ),
        0
      ) || 0;

    setStats({

      listings:
        listings?.length || 0,

      bookings:
        bookings?.length || 0,

      revenue,
    });
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-6xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">

          <div>

            <h2 className="text-4xl font-black">

              Dashboard

            </h2>

            <p className="text-gray-500">

              Deine Vermieter Statistiken

            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >

            ×

          </button>

        </div>

        {/* CONTENT */}

        <div className="p-8">

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            {/* REVENUE */}

            <div className="bg-green-500 text-white rounded-3xl p-8">

              <div className="flex items-center justify-between mb-5">

                <FaEuroSign className="text-4xl" />

                <FaChartLine className="text-3xl opacity-70" />

              </div>

              <p className="text-lg opacity-80 mb-2">

                Einnahmen

              </p>

              <h3 className="text-5xl font-black">

                € {stats.revenue}

              </h3>

            </div>

            {/* LISTINGS */}

            <div className="bg-black text-white rounded-3xl p-8">

              <div className="flex items-center justify-between mb-5">

                <FaBox className="text-4xl" />

              </div>

              <p className="text-lg opacity-80 mb-2">

                Anzeigen

              </p>

              <h3 className="text-5xl font-black">

                {stats.listings}

              </h3>

            </div>

            {/* BOOKINGS */}

            <div className="bg-yellow-400 rounded-3xl p-8">

              <div className="flex items-center justify-between mb-5">

                <FaCalendarCheck className="text-4xl" />

              </div>

              <p className="text-lg opacity-80 mb-2">

                Buchungen

              </p>

              <h3 className="text-5xl font-black">

                {stats.bookings}

              </h3>

            </div>

          </div>

          {/* INFO */}

          <div className="border rounded-3xl p-8">

            <h3 className="text-3xl font-black mb-5">

              Loqaro Insights

            </h3>

            <div className="space-y-4 text-gray-600 leading-8">

              <p>

                • Verwalte deine Anzeigen und Buchungen zentral.

              </p>

              <p>

                • Analysiere deine Einnahmen und Aktivitäten.

              </p>

              <p>

                • Reagiere schnell auf neue Anfragen.

              </p>

              <p>

                • Steigere deine Sichtbarkeit durch aktive Listings.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}