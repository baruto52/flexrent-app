"use client";

import React, {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

type Props = {

  user: any;

  onClose: () => void;
};

export default function BookingsManagementModal({

  user,

  onClose,
}: Props) {

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadBookings();

  }, []);

  async function loadBookings() {

    setLoading(true);

    const { data } =
      await supabase
        .from("bookings")
        .select("*")
        .or(
          `reviewed_user_id.eq.${user?.id},renter_id.eq.${user?.id}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {

      setBookings(data);
    }

    setLoading(false);
  }

  async function updateBooking(
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

    toast.success(
      "Buchung aktualisiert"
    );

    loadBookings();
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-5xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">

          <h2 className="text-4xl font-black">

            Buchungen

          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >

            ×

          </button>

        </div>

        {/* CONTENT */}

        <div className="p-8">

          {loading ? (

            <div className="text-center py-20">

              Lädt...

            </div>

          ) : bookings.length === 0 ? (

            <div className="text-center py-20">

              <h3 className="text-3xl font-black mb-4">

                Keine Buchungen

              </h3>

              <p className="text-gray-500">

                Neue Buchungen erscheinen hier.

              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {bookings.map(
                (booking) => (

                <div
                  key={booking.id}
                  className="border rounded-3xl p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>

                      <h3 className="text-2xl font-black mb-3">

                        Buchung #{booking.id}

                      </h3>

                      <div className="space-y-2 text-gray-600">

                        <p>

                          Status:
                          {" "}
                          <span className="font-bold">

                            {booking.status}

                          </span>

                        </p>

                        <p>

                          Zeitraum:
                          {" "}
                          {booking.start_date}
                          {" - "}
                          {booking.end_date}

                        </p>

                        <p>

                          Gesamtpreis:
                          {" "}
                          € {booking.total_price}

                        </p>

                      </div>

                    </div>

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          updateBooking(
                            booking.id,
                            "accepted"
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-bold"
                      >

                        Akzeptieren

                      </button>

                      <button
                        onClick={() =>
                          updateBooking(
                            booking.id,
                            "declined"
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-bold"
                      >

                        Ablehnen

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}