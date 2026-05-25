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

  ShieldCheck,

  Eye,

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

  const [favoritesCount, setFavoritesCount] =
    useState(0);

  const [verified, setVerified] =
    useState(false);

  const [rating, setRating] =
    useState(0);

  const [reviewsCount, setReviewsCount] =
    useState(0);

  useEffect(() => {

    init();

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (session) {

      setUser(
        session.user
      );

      checkFavorite(
        session.user.id
      );
    }

    await Promise.all([

      loadFavoritesCount(),

      loadOwnerData(),
    ]);
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
          listing.id
        );

    setFavoritesCount(
      count || 0
    );
  }

  async function loadOwnerData() {

    if (!listing.user_id)
      return;

    const {
      data,
    } =
      await supabase
        .from("profiles")
        .select(`
          verified,
          rating,
          reviews_count
        `)
        .eq(
          "id",
          listing.user_id
        )
        .maybeSingle();

    if (!data)
      return;

    setVerified(
      !!data.verified
    );

    setRating(
      Number(
        data.rating || 0
      )
    );

    setReviewsCount(
      data.reviews_count || 0
    );
  }

  async function checkFavorite(
    userId: string
  ) {

    const { data } =
      await supabase
        .from("favorites")
        .select("id")
        .eq(
          "user_id",
          userId
        )
        .eq(
          "listing_id",
          listing.id
        )
        .maybeSingle();

    setFavorite(
      !!data
    );
  }

  async function toggleFavorite(
    e: any
  ) {

    e.preventDefault();

    e.stopPropagation();

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

      setFavoritesCount(
        (prev) =>

          Math.max(
            prev - 1,
            0
          )
      );

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

      setFavoritesCount(
        (prev) =>

          prev + 1
      );
    }
  }

  /*
    IMAGE FIX
  */

  let image =
    "/placeholder.jpg";

  try {

    if (listing.image) {

      image =
        listing.image;

    } else if (
      listing.image_url
    ) {

      image =
        listing.image_url;

    } else if (
      Array.isArray(
        listing.images
      ) &&
      listing.images.length > 0
    ) {

      image =
        listing.images[0];

    } else if (
      typeof listing.images ===
      "string"
    ) {

      const parsed =
        JSON.parse(
          listing.images
        );

      if (
        Array.isArray(parsed) &&
        parsed.length > 0
      ) {

        image =
          parsed[0];
      }
    }

  } catch (error) {

    console.log(
      "IMAGE ERROR:",
      error
    );
  }

  return (

    <Link
      href={`/listing/${listing.id}`}
      className="
        group
        bg-white
        rounded-[36px]
        overflow-hidden
        border
        border-gray-100
        shadow-sm
        hover:shadow-2xl
        transition-all
        duration-500
        hover:-translate-y-2
      "
    >

      {/* IMAGE */}

      <div
        className="
          relative
          h-[300px]
          overflow-hidden
          bg-gray-100
        "
      >

        <Image
          src={image}
          alt={listing.title || "Listing"}
          fill
          unoptimized
          className="
            object-cover
            group-hover:scale-110
            transition-all
            duration-700
          "
        />

        {/* GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/50
            via-transparent
            to-transparent
          "
        />

        {/* CATEGORY */}

        <div
          className="
            absolute
            top-4
            left-4
            px-4
            py-2
            rounded-full
            bg-white/90
            backdrop-blur-xl
            text-black
            text-xs
            font-black
            shadow-xl
            z-10
          "
        >

          {
            listing.category ||
            "Listing"
          }

        </div>

        {/* FAVORITE */}

        <button
          onClick={
            toggleFavorite
          }
          className="
            absolute
            top-4
            right-4
            min-w-[52px]
            h-12
            px-3
            rounded-full
            bg-white/90
            backdrop-blur-xl
            flex
            items-center
            justify-center
            gap-2
            shadow-xl
            z-10
            hover:scale-110
            transition
          "
        >

          <Heart
            size={22}
            fill={
              favorite
                ? "#ff0000"
                : "transparent"
            }
            color={
              favorite
                ? "#ff0000"
                : "#111"
            }
          />

          {favoritesCount > 0 && (

            <span
              className="
                text-xs
                font-black
              "
            >

              {
                favoritesCount
              }

            </span>

          )}

        </button>

        {/* PRICE */}

        <div
          className="
            absolute
            bottom-5
            left-5
            bg-white
            rounded-3xl
            px-5
            py-4
            shadow-2xl
            z-10
          "
        >

          <p
            className="
              text-gray-400
              text-xs
              font-semibold
              mb-1
            "
          >

            Preis pro Tag

          </p>

          <div
            className="
              flex
              items-end
              gap-1
            "
          >

            <span
              className="
                text-3xl
                font-black
                leading-none
              "
            >

              €
              {listing.price}

            </span>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-6">

        {/* TITLE */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            mb-3
          "
        >

          <h2
            className="
              text-2xl
              font-black
              leading-tight
              line-clamp-2
            "
          >

            {listing.title}

          </h2>

          <div
            className="
              min-w-fit
              flex
              items-center
              gap-1
              bg-[#16d64d]/10
              text-[#16d64d]
              px-3
              py-2
              rounded-2xl
              font-black
              text-sm
            "
          >

            <Star
              size={15}
              fill="#16d64d"
            />

            {
              rating > 0

                ? rating.toFixed(1)

                : "Neu"
            }

          </div>

        </div>

        {/* AI VERIFIED */}

        {listing.ai_verified && (

          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-[#16d64d]/10
              text-[#16d64d]
              text-xs
              font-black
            "
          >

            ✓ AI Verified

          </div>

        )}

        {/* TRUST SCORE */}

        {!!listing.trust_score && (

          <div
            className="
              mb-4
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                px-3
                py-1
                rounded-full
                bg-black/5
                text-black
                text-xs
                font-black
              "
            >

              AI Trust {listing.trust_score}%

            </div>

          </div>

        )}

        {/* LOCATION */}

        <div
          className="
            flex
            items-center
            gap-2
            text-gray-500
            text-sm
            mb-4
          "
        >

          <MapPin size={16} />

          <span className="line-clamp-1">

            {listing.location}

          </span>

        </div>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-600
            text-sm
            leading-7
            line-clamp-2
            mb-5
          "
        >

          {listing.description}

        </p>

        {/* FOOTER */}

        <div
          className="
            flex
            items-center
            justify-between
            pt-5
            border-t
            border-gray-100
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-bold
              text-gray-700
            "
          >

            <ShieldCheck
              size={18}
              className={
                verified

                  ? "text-[#16d64d]"

                  : "text-gray-300"
              }
            />

            {verified

              ? "Verifiziert"

              : "Nicht verifiziert"}

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-bold
              text-gray-500
            "
          >

            <Eye size={16} />

            {reviewsCount}
            Reviews

          </div>

        </div>

      </div>

    </Link>

  );
}