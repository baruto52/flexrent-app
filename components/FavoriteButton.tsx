"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Heart,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

interface Props {

  listingId: string;
}

export default function FavoriteButton({

  listingId,

}: Props) {

  const [favorited, setFavorited] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [favoritesCount, setFavoritesCount] =
    useState(0);

  const [animating, setAnimating] =
    useState(false);

  useEffect(() => {

    init();

    listenFavorites();

  }, [listingId]);

  async function init() {

    await Promise.all([

      checkFavorite(),

      loadFavoritesCount(),
    ]);

    setLoading(false);
  }

  async function loadFavoritesCount() {

    const {
      count,
    } =
      await supabase
        .from("favorites")
        .select(
          "*",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "listing_id",
          listingId
        );

    setFavoritesCount(
      count || 0
    );
  }

  function listenFavorites() {

    const channel =
      supabase.channel(
        `favorites-${listingId}`
      );

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "favorites",
          filter:
            `listing_id=eq.${listingId}`,
        },
        () => {

          loadFavoritesCount();
        }
      )
      .subscribe();
  }

  async function checkFavorite() {

    try {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user)
        return;

      const {
        data,
      } =
        await supabase
          .from("favorites")
          .select("id")
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "listing_id",
            listingId
          )
          .maybeSingle();

      setFavorited(
        !!data
      );

    } catch (error) {

      console.log(error);
    }
  }

  async function toggleFavorite(
    e: React.MouseEvent
  ) {

    e.preventDefault();

    e.stopPropagation();

    try {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        window.location.href =
          "/login";

        return;
      }

      /*
        HEART ANIMATION
      */

      setAnimating(true);

      setTimeout(() => {

        setAnimating(false);

      }, 400);

      /*
        REMOVE
      */

      if (favorited) {

        await supabase
          .from("favorites")
          .delete()
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "listing_id",
            listingId
          );

        setFavorited(false);

        setFavoritesCount(
          (prev) =>

            Math.max(
              prev - 1,
              0
            )
        );

        return;
      }

      /*
        ADD
      */

      await supabase
        .from("favorites")
        .insert({

          user_id:
            user.id,

          listing_id:
            listingId,
        });

      setFavorited(true);

      setFavoritesCount(
        (prev) =>

          prev + 1
      );

    } catch (error) {

      console.log(error);
    }
  }

  if (loading) {

    return (

      <div
        className="
          absolute
          top-5
          right-5
          w-14
          h-14
          rounded-full
          bg-white/90
          backdrop-blur
          z-20
        "
      />

    );
  }

  return (

    <div
      className="
        absolute
        top-5
        right-5
        z-20
      "
    >

      <button
        onClick={
          toggleFavorite
        }
        className={`
          relative
          w-14
          h-14
          rounded-full
          bg-white/90
          backdrop-blur-xl
          border
          border-white/50
          shadow-xl
          flex
          items-center
          justify-center
          transition-all
          duration-300
          hover:scale-110
          active:scale-95

          ${
            animating

              ? "scale-125"

              : ""
          }
        `}
      >

        <Heart
          size={24}
          className={`
            transition-all
            duration-300

            ${
              favorited

                ? `
                  fill-red-500
                  text-red-500
                  scale-110
                `

                : `
                  text-gray-700
                `
            }
          `}
        />

        {/* PULSE */}

        {favorited && animating && (

          <div
            className="
              absolute
              inset-0
              rounded-full
              border-4
              border-red-400
              animate-ping
            "
          />

        )}

      </button>

      {/* COUNTER */}

      {favoritesCount > 0 && (

        <div
          className="
            absolute
            -bottom-2
            left-1/2
            -translate-x-1/2
            min-w-[28px]
            h-7
            px-2
            rounded-full
            bg-black
            text-white
            text-xs
            font-black
            flex
            items-center
            justify-center
            shadow-lg
          "
        >

          {favoritesCount}

        </div>

      )}

    </div>

  );
}