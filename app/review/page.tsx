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

export default function ReviewPage() {

  const [
    bookingId,
    setBookingId,
  ] = useState("");

  const [
    listingId,
    setListingId,
  ] = useState("");

  const [
    reviewedUserId,
    setReviewedUserId,
  ] = useState("");

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function submitReview() {

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
          "/api/reviews",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              bookingId,

              listingId,

              reviewerId:
                session.user.id,

              reviewedUserId,

              rating,

              comment,
            }),
          }
        );

      const data =
        await res.json();

      if (!data.success) {

        alert(
          data.error ||
          "Review Fehler"
        );

        return;
      }

      setSuccess(true);

      setComment("");

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

            Bewertung schreiben

          </h1>

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
              value={reviewedUserId}
              onChange={(e) =>
                setReviewedUserId(
                  e.target.value
                )
              }
              placeholder="Bewerteter Nutzer"
              className="
                w-full
                h-16
                rounded-3xl
                border
                border-gray-200
                px-6
              "
            />

            <select
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                w-full
                h-16
                rounded-3xl
                border
                border-gray-200
                px-6
              "
            >

              <option value={5}>
                ⭐⭐⭐⭐⭐
              </option>

              <option value={4}>
                ⭐⭐⭐⭐
              </option>

              <option value={3}>
                ⭐⭐⭐
              </option>

              <option value={2}>
                ⭐⭐
              </option>

              <option value={1}>
                ⭐
              </option>

            </select>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="Beschreibe deine Erfahrung..."
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
              submitReview
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

              : "Bewertung senden"}

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

              Bewertung erfolgreich erstellt.

            </div>

          )}

        </div>

      </div>

      <Footer />

    </main>
  );
}