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

export default function AppealPage() {

  const [reason, setReason] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function submitAppeal() {

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
          "/api/appeals",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              userId:
                session.user.id,

              reason,
            }),
          }
        );

      const data =
        await res.json();

      if (!data.success) {

        alert(
          data.error ||
          "Appeal Fehler"
        );

        return;
      }

      setSuccess(true);

      setReason("");

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

            Appeal System

          </h1>

          <p className="text-gray-500 leading-8 mb-10">

            Wenn dein Account eingeschränkt oder gebannt wurde,
            kannst du hier Einspruch einreichen.

          </p>

          <textarea
            value={reason}
            onChange={(e) =>
              setReason(
                e.target.value
              )
            }
            placeholder="Beschreibe deinen Einspruch..."
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

          <button
            onClick={
              submitAppeal
            }
            disabled={
              loading
            }
            className="
              mt-8
              w-full
              h-16
              rounded-3xl
              bg-black
              text-white
              text-lg
              font-black
            "
          >

            {loading

              ? "Wird gesendet..."

              : "Appeal senden"}

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

              Appeal erfolgreich eingereicht.

            </div>

          )}

        </div>

      </div>

      <Footer />

    </main>
  );
}