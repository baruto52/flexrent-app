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

  useEffect(() => {

    checkFavorite();

  }, [listingId]);

  async function checkFavorite() {

    try {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        setLoading(false);

        return;
      }

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

    } finally {

      setLoading(false);
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

        return;
      }

      await supabase
        .from("favorites")
        .insert({

          user_id:
            user.id,

          listing_id:
            listingId,
        });

      setFavorited(true);

    } catch (error) {

      console.log(error);
    }
  }

  if (loading) {

    return (

      <div
        className="
          w-12
          h-12
          rounded-full
          bg-white/90
          backdrop-blur
        "
      />

    );
  }

  return (

    <button
      onClick={
        toggleFavorite
      }
      className="
        absolute
        top-5
        right-5
        w-12
        h-12
        rounded-full
        bg-white/90
        backdrop-blur
        flex
        items-center
        justify-center
        hover:scale-110
        transition
        z-20
      "
    >

      <Heart
        size={22}
        className={`
          transition
          ${
            favorited

              ? "fill-red-500 text-red-500"

              : "text-black"
          }
        `}
      />

    </button>

  );
}