"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import Navbar
from "@/components/Navbar";

import Footer
from "@/components/Footer";

import {

  ShieldAlert,

  AlertTriangle,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function DisputePage() {

  const searchParams =
    useSearchParams();

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

  /*
    AUTO LISTING
  */

  useEffect(() => {

    const listing =
      searchParams.get(
        "listing"
      );

    if (listing) {

      setListingId(
        listing
      );
    }

  }, [searchParams]);

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

      <div className="max-w-4xl mx-auto px-4 py-20">

        {/* HERO */}

        <div
          className="
            bg-black
            text-white
            rounded-[40px]
            p-10
            mb-10
          "
        >

          <div
            className="
              flex
              items-center
              gap-5
              mb-6
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-[28px]
                bg-red-500
                flex
                items-center
                justify-center
              "
            >

              <ShieldAlert
                size={42}
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

                Dispute Center

              </h1>

              <p
                className="
                  text-gray-400
                  mt-3
                  text-lg
                "
              >

                Probleme mit einer Buchung?
                Reiche hier einen Dispute ein.

              </p>

            </div>

          </div>

        </div>

        {/* FORM */}

        <div
          className="
            bg-white
            rounded-[40px]
            p-10
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-8
            "
          >

            <AlertTriangle
              className="
                text-red-500
              "
            />

            <h2
              className="
                text-3xl
                font-black
              "
            >

              Streitfall eröffnen

            </h2>

          </div>

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
                outline-none
                focus:border-black
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
                outline-none
                focus:border-black
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
                outline-none
                focus:border-black
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
                outline-none
                focus:border-black
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
                outline-none
                focus:border-black
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
              hover:scale-[1.01]
              transition-all
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