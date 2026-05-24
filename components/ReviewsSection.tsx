"use client";

import {
  useEffect,
  useState,
} from "react";

import {

  Star,

  Send,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

import ReviewCard
from "@/components/ReviewCard";

import RatingStars
from "@/components/RatingStars";

interface Props {

  listingId: string;

  ownerId: string;

  user: any;
}

export default function ReviewsSection({

  listingId,

  ownerId,

  user,

}: Props) {

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [averageRating, setAverageRating] =
    useState(0);

  useEffect(() => {

    let realtimeChannel: any;

    init().then(
      (channel) => {

        realtimeChannel =
          channel;
      }
    );

    return () => {

      if (realtimeChannel) {

        supabase.removeChannel(
          realtimeChannel
        );
      }
    };

  }, []);

  async function init() {

    await loadReviews();

    return listenReviews();
  }

  async function loadReviews() {

    try {

      const {
        data,
      } =
        await supabase
          .from("reviews")
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq(
            "listing_id",
            listingId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      const allReviews =
        data || [];

      setReviews(
        allReviews
      );

      if (
        allReviews.length > 0
      ) {

        const avg =

          allReviews.reduce(
            (
              acc,
              review
            ) =>

              acc +
              review.rating,

            0
          ) /
          allReviews.length;

        setAverageRating(
          Number(
            avg.toFixed(1)
          )
        );

      } else {

        setAverageRating(0);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  function listenReviews() {

    const channel =
      supabase.channel(
        `reviews-${listingId}`
      );

    channel.on(

      "postgres_changes",

      {

        event: "*",

        schema: "public",

        table: "reviews",

        filter:
          `listing_id=eq.${listingId}`,
      },

      () => {

        loadReviews();
      }

    );

    channel.subscribe();

    return channel;
  }

  async function submitReview() {

    if (!user) {

      alert(
        "Bitte einloggen"
      );

      return;
    }

    if (
      !comment.trim()
    ) {

      alert(
        "Bitte Bewertung schreiben"
      );

      return;
    }

    try {

      setSending(true);

      const { error } =
        await supabase
          .from("reviews")
          .insert({

            listing_id:
              listingId,

            reviewer_id:
              user.id,

            owner_id:
              ownerId,

            rating,

            comment:
              comment.trim(),
          });

      if (error) {

        alert(
          error.message
        );

        return;
      }

      /*
        UPDATE OWNER RATING
      */

      const {
        data: allOwnerReviews,
      } =
        await supabase
          .from("reviews")
          .select("rating")
          .eq(
            "owner_id",
            ownerId
          );

      if (allOwnerReviews) {

        const avg =

          allOwnerReviews.reduce(
            (
              acc,
              review
            ) =>

              acc +
              review.rating,

            0
          ) /
          allOwnerReviews.length;

        await supabase
          .from("profiles")
          .update({

            rating:
              avg.toFixed(1),

            reviews_count:
              allOwnerReviews.length,
          })
          .eq(
            "id",
            ownerId
          );
      }

      setComment("");

      setRating(5);

      await loadReviews();

    } catch (error) {

      console.log(error);

      alert(
        "Fehler beim Bewerten"
      );

    } finally {

      setSending(false);
    }
  }

  if (loading) {

    return (

      <div
        className="
          bg-white
          rounded-[40px]
          p-10
          shadow-sm
          text-center
          text-2xl
          font-black
        "
      >
        Bewertungen laden...
      </div>

    );
  }

  return (

    <div className="space-y-10">

      {/* HEADER */}

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
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-8
          "
        >

          <div>

            <h2
              className="
                text-5xl
                font-black
                mb-4
              "
            >
              Bewertungen
            </h2>

            <p
              className="
                text-gray-500
                text-xl
              "
            >
              {
                reviews.length
              } Bewertungen
            </p>

          </div>

          <div
            className="
              bg-[#f5f7fb]
              rounded-[36px]
              px-10
              py-8
              min-w-[260px]
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
                mb-4
              "
            >

              <Star
                size={32}
                className="
                  fill-yellow-400
                  text-yellow-400
                "
              />

              <h3
                className="
                  text-5xl
                  font-black
                "
              >
                {
                  averageRating
                }
              </h3>

            </div>

            <RatingStars
              rating={Math.round(
                averageRating
              )}
              size={28}
            />

          </div>

        </div>

      </div>

      {/* WRITE REVIEW */}

      <div
        className="
          bg-white
          rounded-[40px]
          p-10
          shadow-sm
        "
      >

        <h3
          className="
            text-3xl
            font-black
            mb-6
          "
        >
          Bewertung schreiben
        </h3>

        <div
          className="
            flex
            gap-3
            mb-8
          "
        >

          {[1, 2, 3, 4, 5].map(
            (star) => (

              <button
                key={star}
                type="button"
                onClick={() =>
                  setRating(star)
                }
                className="
                  transition
                  hover:scale-110
                "
              >

                <Star
                  size={36}
                  className={`
                    ${
                      star <= rating

                        ? "fill-yellow-400 text-yellow-400"

                        : "text-gray-300"
                    }
                  `}
                />

              </button>

            )
          )}

        </div>

        <textarea
          value={comment}
          disabled={sending}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Wie war deine Erfahrung?"
          className="
            w-full
            h-40
            rounded-[32px]
            border
            border-gray-200
            p-6
            text-lg
            outline-none
            disabled:opacity-50
          "
        />

        <button
          onClick={
            submitReview
          }
          disabled={
            sending
          }
          className="
            mt-6
            h-16
            px-8
            rounded-2xl
            bg-[#16d64d]
            text-white
            flex
            items-center
            justify-center
            gap-3
            text-lg
            font-black
            hover:scale-[1.01]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >

          <Send
            size={22}
          />

          {sending

            ? "Senden..."

            : "Bewertung senden"}

        </button>

      </div>

      {/* REVIEWS */}

      {reviews.length === 0 ? (

        <div
          className="
            bg-white
            rounded-[40px]
            p-20
            text-center
            shadow-sm
          "
        >

          <h3
            className="
              text-4xl
              font-black
              mb-4
            "
          >
            Keine Bewertungen
          </h3>

          <p
            className="
              text-gray-500
              text-xl
            "
          >
            Sei der Erste mit einer Bewertung.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {reviews.map(
            (review) => (

              <ReviewCard
                key={review.id}
                review={review}
              />

            )
          )}

        </div>

      )}

    </div>

  );
}