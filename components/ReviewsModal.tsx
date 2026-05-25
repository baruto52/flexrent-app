"use client";

import React, {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  FaStar,
} from "react-icons/fa";

import { supabase } from "@/lib/supabase";

type Props = {

  listing: any;

  user: any;

  onClose: () => void;
};

export default function ReviewsModal({

  listing,

  user,

  onClose,
}: Props) {

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  useEffect(() => {

    loadReviews();

  }, []);

  async function loadReviews() {

    const { data } =
      await supabase
        .from("reviews")
        .select("*")
        .eq(
          "listing_id",
          listing.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {

      setReviews(data);
    }
  }

  async function submitReview() {

    if (!comment) {

      toast.error(
        "Kommentar fehlt"
      );

      return;
    }

    await supabase
      .from("reviews")
      .insert({

        listing_id:
          listing.id,

        reviewer_id:
          user?.id,

        reviewed_user_id:
          listing.user_id,

        rating,

        comment,
      });

    toast.success(
      "Bewertung gespeichert"
    );

    setComment("");

    setRating(5);

    loadReviews();
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">

          <h2 className="text-3xl font-black">

            Bewertungen

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

          {/* ADD */}

          <div className="border rounded-3xl p-6 mb-10">

            <h3 className="text-2xl font-bold mb-5">

              Bewertung schreiben

            </h3>

            {/* STARS */}

            <div className="flex gap-2 mb-5">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                <button
                  key={star}
                  onClick={() =>
                    setRating(star)
                  }
                  className="text-3xl"
                >

                  <FaStar
                    className={
                      star <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />

                </button>

              ))}

            </div>

            {/* COMMENT */}

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="Deine Bewertung..."
              className="w-full border rounded-2xl px-5 py-4 h-40 mb-5"
            />

            {/* BUTTON */}

            <button
              onClick={submitReview}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold"
            >

              Bewertung senden

            </button>

          </div>

          {/* REVIEWS */}

          <div className="space-y-5">

            {reviews.map(
              (review) => (

              <div
                key={review.id}
                className="border rounded-3xl p-6"
              >

                <div className="flex gap-1 mb-4">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                    <FaStar
                      key={star}
                      className={
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />

                  ))}

                </div>

                <p className="text-gray-700 leading-8">

                  {review.comment}

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );
}