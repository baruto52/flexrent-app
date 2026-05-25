"use client";

import {
  useState,
} from "react";

import Navbar
from "@/components/Navbar";

import Footer
from "@/components/Footer";

import { supabase }
from "@/lib/supabase";

export default function DisputePage() {

  const [
    bookingId,
    setBookingId,
  ] = useState("");

  const [
    listingId,
    setListingId,
  ] = useState("");

  const [
    againstUser,
    setAgainstUser,
  ] = useState("");

  const [reason, setReason] =
    useState("");

  const [details, setDetails] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function submitDispute() {

    try {

      setLoading(true);

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session?.user) {

        alert(
          "Bitte einloggen"
        );

        return;
      }

      const res =
        await fetch(
          "/api/disputes",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              bookingId,

              listingId,

              openedBy:
                session.user.id,

              againstUser,

              reason,

              details,
            }),
          }
        );

      const data =
        await res.json();

      if (!data.success) {

        alert(
          data.error ||
          "Dispute Fehler"
        );

        return;
      }

      setSuccess(true);

      setReason("");

      setDetails("");

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-20">

        <div className="bg-white rounded-[40px] p-10 shadow-sm">

          <h1 className="text-5xl font-black mb-6">

            Dispute Center

          </h1>

          <p className="text-gray-500 leading-8 mb-10">

            Probleme mit einer Buchung?
            Reiche hier einen Dispute ein.

          </p>

          <div className="space-y-5">

            <input
              value={bookingId}
              onChange={(e) =>
                setBookingId(
                  e.target.value
                )
              }
              placeholder="Booking ID"
              className="
                w-full
                h-16
                rounded-3xl
                border
                border-gray-200
                px-6
              "
            />

            <input
              value={listingId}
              onChange={(e) =>
                setListingId(
                  e.target.value
                )
              }
              placeholder="Listing ID"
              className="
                w-full
                h-16
                rounded-3xl
                border
                border-gray-200
                px-6
              "
            />

            <input
              value={againstUser}
              onChange={(e) =>
                setAgainstUser(
                  e.target.value
                )
              }
              placeholder="Gegen Nutzer ID"
              className="
                w-full
                h-16
                rounded-3xl
                border
                border-gray-200
                px-6
              "
            />

            <input
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              placeholder="Grund"
              className="
                w-full
                h-16
                rounded-3xl
                border
                border-gray-200
                px-6
              "
            />

            <textarea
              value={details}
              onChange={(e) =>
                setDetails(
                  e.target.value
                )
              }
              placeholder="Beschreibe das Problem..."
              className="
                w-full
                h-64
                rounded-3xl
                border
                border-gray-200
                p-6
                resize-none
              "
            />

          </div>

          <button
            onClick={
              submitDispute
            }
            disabled={
              loading
            }
            className="
              mt-8
              w-full
              h-16
              rounded-3xl
              bg-red-500
              text-white
              text-lg
              font-black
            "
          >

            {loading

              ? "Wird gesendet..."

              : "Dispute eröffnen"}

          </button>

          {success && (

            <div
              className="
                mt-6
                p-5
                rounded-3xl
                bg-[#16d64d]/10
                text-[#16d64d]
                font-bold
              "
            >

              Dispute erfolgreich erstellt.

            </div>

          )}

        </div>

      </div>

      <Footer />

    </main>

  );
}