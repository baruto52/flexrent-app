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

export default function VerifyPage() {

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [phone, setPhone] =
    useState("");

  const [
    documentUrl,
    setDocumentUrl,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function submitVerification() {

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
          "/api/verification",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              userId:
                session.user.id,

              fullName,

              phone,

              documentUrl,
            }),
          }
        );

      const data =
        await res.json();

      if (!data.success) {

        alert(
          data.error ||
          "Verification Fehler"
        );

        return;
      }

      setSuccess(true);

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

            Identität verifizieren

          </h1>

          <p className="text-gray-500 leading-8 mb-10">

            Verifiziere deine Identität,
            um Vertrauen aufzubauen
            und Premium Features freizuschalten.

          </p>

          <div className="space-y-5">

            <input
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              placeholder="Vollständiger Name"
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
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder="Telefonnummer"
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
              value={documentUrl}
              onChange={(e) =>
                setDocumentUrl(
                  e.target.value
                )
              }
              placeholder="Dokument URL"
              className="
                w-full
                h-16
                rounded-3xl
                border
                border-gray-200
                px-6
              "
            />

          </div>

          <button
            onClick={
              submitVerification
            }
            disabled={
              loading
            }
            className="
              mt-8
              w-full
              h-16
              rounded-3xl
              bg-[#16d64d]
              text-white
              text-lg
              font-black
            "
          >

            {loading

              ? "Wird gesendet..."

              : "Verifizierung starten"}

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

              Verifizierung eingereicht.

            </div>

          )}

        </div>

      </div>

      <Footer />

    </main>
  );
}