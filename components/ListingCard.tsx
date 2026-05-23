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

  Star,

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

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session)
      return;

    setUser(
      session.user
    );

    checkFavorite(
      session.user.id
    );
  }

  async function checkFavorite(
    userId: string
  ) {

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
  }

  async function toggleFavorite(
    e: any
  ) {

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

      setFavorite(true);
    }
  }

  return (

    <Link
      href={`/listing/${listing.id}`}
      className="
        bg-white
        rounded-[30px]
        overflow-hidden
        shadow-sm
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-1
        group
      "
    >

      {/* IMAGE */}

      <div
        className="
          relative
          h-60
          overflow-hidden
        "
      >

        <Image
          src={
            Array.isArray(
              listing.images
            )
              ? listing.images[0]
              : typeof listing.images === "string"
              ? JSON.parse(
                  listing.images || "[]"
                )[0]
              : "/placeholder.jpg"
          }
          alt={listing.title}
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
            top-4
            right-4
            w-11
            h-11
            rounded-full
            bg-white/90
            backdrop-blur
            flex
            items-center
            justify-center
            shadow-lg
            z-10
          "
        >

          <Heart
            size={20}
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
            top-4
            left-4
            px-4
            py-2
            rounded-full
            bg-black/70
            text-white
            text-xs
            font-bold
            backdrop-blur
            z-10
          "
        >

          {
            listing.category ||

            "Listing"
          }

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-5">

        {/* TITLE */}

        <h2
          className="
            text-2xl
            font-black
            line-clamp-1
            mb-2
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
            text-sm
            mb-3
          "
        >

          <MapPin size={15} />

          <span className="line-clamp-1">

            {listing.location}

          </span>

        </div>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-600
            text-sm
            leading-6
            line-clamp-2
            mb-5
          "
        >

          {listing.description}

        </p>

        {/* BOTTOM */}

        <div
          className="
            flex
            items-end
            justify-between
          "
        >

          {/* PRICE */}

          <div>

            <p
              className="
                text-gray-400
                text-sm
                mb-1
              "
            >

              Preis pro Tag

            </p>

            <h3
              className="
                text-3xl
                font-black
              "
            >

              €

              {listing.price}

            </h3>

          </div>

          {/* RATING */}

          <div
            className="
              flex
              items-center
              gap-1
              bg-[#16d64d]/10
              text-[#16d64d]
              px-3
              py-2
              rounded-2xl
              font-bold
              text-sm
            "
          >

            <Star
              size={15}
              fill="#16d64d"
            />

            4.9

          </div>

        </div>

      </div>

    </Link>
  );
}