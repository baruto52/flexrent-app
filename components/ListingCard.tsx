"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import {
  Heart,
  MapPin,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

interface Props {

  listing: any;
}

export default function ListingCard({

  listing,

}: Props) {

  const [user, setUser] =
    useState<any>(null);

  const [favorite, setFavorite] =
    useState(false);

  useEffect(() => {

    init();

  }, []);

  const init =
    async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) return;

      setUser(
        session.user
      );

      checkFavorite(
        session.user.id
      );
    };

  const checkFavorite =
    async (
      userId: string
    ) => {

      const { data } =
        await supabase
          .from("favorites")
          .select("*")
          .eq(
            "user_id",
            userId
          )
          .eq(
            "listing_id",
            listing.id
          )
          .single();

      if (data) {

        setFavorite(true);
      }
    };

  const toggleFavorite =
    async (
      e: any
    ) => {

      e.preventDefault();

      if (!user) {

        window.location.href =
          "/login";

        return;
      }

      if (favorite) {

        await supabase
          .from("favorites")
          .delete()
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "listing_id",
            listing.id
          );

        setFavorite(false);

      } else {

        await supabase
          .from("favorites")
          .insert({

            user_id:
              user.id,

            listing_id:
              listing.id,
          });

        /* NOTIFICATION */

        await supabase
          .from("notifications")
          .insert({

            user_id:
              listing.user_id,

            title:
              "Neuer Favorit",

            description:
              `${listing.title} wurde gespeichert.`,
          });

        setFavorite(true);
      }
    };

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="
        bg-white
        rounded-[36px]
        overflow-hidden
        shadow-sm
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-2
        group
      "
    >

      {/* IMAGE */}

      <div
        className="
          relative
          h-72
          overflow-hidden
        "
      >

        <Image
          src={
            listing.images?.[0] ||
            "/placeholder.jpg"
          }
          alt={
            listing.title
          }
          fill
          className="
            object-cover
            group-hover:scale-105
            transition
            duration-500
          "
        />

        {/* FAVORITE */}

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
          "
        >

          <Heart
            size={22}
            fill={
              favorite
                ? "red"
                : "transparent"
            }
            color={
              favorite
                ? "red"
                : "black"
            }
          />

        </button>

        {/* CATEGORY */}

        <div
          className="
            absolute
            top-5
            left-5
            px-4
            py-2
            rounded-full
            bg-black/70
            text-white
            text-sm
            font-bold
            backdrop-blur
          "
        >

          {
            listing.category ||
            "Listing"
          }

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-7">

        <h2
          className="
            text-3xl
            font-black
            mb-4
            line-clamp-1
          "
        >
          {listing.title}
        </h2>

        {/* LOCATION */}

        <div
          className="
            flex
            items-center
            gap-2
            text-gray-500
            mb-5
          "
        >

          <MapPin
            size={18}
          />

          <span className="line-clamp-1">

            {listing.location}

          </span>

        </div>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-600
            leading-8
            line-clamp-2
            mb-8
          "
        >

          {listing.description}

        </p>

        {/* BOTTOM */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p className="text-gray-500 mb-1">
              Preis
            </p>

            <h3
              className="
                text-5xl
                font-black
              "
            >

              €
              {listing.price}

            </h3>

          </div>

          <div
            className="
              h-14
              px-6
              rounded-2xl
              bg-black
              text-white
              flex
              items-center
              justify-center
              font-bold
            "
          >
            Öffnen
          </div>

        </div>

      </div>

    </Link>
  );
}