"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {

  Flag,

  Send,

  ShieldAlert,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function ReportsPage() {

  const [listingId, setListingId] =
    useState("");

  const [reason, setReason] =
    useState("Spam");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser =
    async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

        window.location.href =
          "/login";

        return;
      }

      setUser(
        session.user
      );
    };

  const submitReport =
    async () => {

      if (!listingId) {

        alert(
          "Listing ID fehlt"
        );

        return;
      }

      setLoading(true);

      const { error } =
        await supabase
          .from("reports")
          .insert({

            reporter_id:
              user.id,

            listing_id:
              listingId,

            reason,

            message,
          });

      setLoading(false);

      if (error) {

        alert(
          error.message
        );

        return;
      }

      setMessage("");

      alert(
        "Report gesendet"
      );
    };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div
          className="
            bg-white
            rounded-[40px]
            p-10
            shadow-sm
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
                text-white
                flex
                items-center
                justify-center
              "
            >

              <ShieldAlert
                size={38}
              />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                  mb-3
                "
              >
                Listing melden
              </h1>

              <p
                className="
                  text-gray-500
                  text-lg
                "
              >
                Melde Spam, Betrug oder
                unangemessene Inhalte.
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

          <div className="space-y-8">

            {/* LISTING ID */}

            <div>

              <label
                className="
                  block
                  font-black
                  mb-3
                  text-lg
                "
              >
                Listing ID
              </label>

              <input
                type="text"
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
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  text-lg
                  outline-none
                "
              />

            </div>

            {/* REASON */}

            <div>

              <label
                className="
                  block
                  font-black
                  mb-3
                  text-lg
                "
              >
                Grund
              </label>

              <select
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  text-lg
                  outline-none
                  bg-white
                "
              >

                <option>
                  Spam
                </option>

                <option>
                  Betrug
                </option>

                <option>
                  Fake Listing
                </option>

                <option>
                  Unangemessener Inhalt
                </option>

                <option>
                  Sonstiges
                </option>

              </select>

            </div>

            {/* MESSAGE */}

            <div>

              <label
                className="
                  block
                  font-black
                  mb-3
                  text-lg
                "
              >
                Nachricht
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Weitere Informationen..."
                className="
                  w-full
                  h-40
                  rounded-3xl
                  border
                  border-gray-200
                  p-5
                  text-lg
                  outline-none
                "
              />

            </div>

            {/* BUTTON */}

            <button
              onClick={
                submitReport
              }
              disabled={loading}
              className="
                w-full
                h-16
                rounded-2xl
                bg-red-500
                text-white
                text-xl
                font-black
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <Send
                size={22}
              />

              {loading

                ? "Wird gesendet..."

                : "Report senden"}

            </button>

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}