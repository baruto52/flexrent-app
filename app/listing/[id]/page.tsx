"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import ReviewsSection from "@/components/ReviewsSection";

import {

  MessageCircle,

  MapPin,

  Shield,

  Share2,

  Star,

  Flag,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

import FavoriteButton
from "@/components/FavoriteButton";

export default function ListingPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const listingId =
    params?.id as string;

  const [listing, setListing] =
    useState<any>(null);

  const [owner, setOwner] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  const [currentImage, setCurrentImage] =
    useState(0);

  const [averageRating, setAverageRating] =
    useState("0.0");

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  useEffect(() => {

    if (listingId) {

      init();
    }

  }, [listingId]);

  async function init() {

    try {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (session?.user) {

        setUser(
          session.user
        );
      }

      await fetchListing();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  async function fetchListing() {

    const {
      data,
      error,
    } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "id",
          listingId
        )
        .maybeSingle();

    if (error || !data) {

      setListing(null);

      return;
    }

    setListing(data);

    /* OWNER */

    const {
      data: ownerData,
    } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          data.user_id
        )
        .maybeSingle();

    setOwner(ownerData);

    /* REVIEWS */

    const {
      data: reviews,
    } =
      await supabase
        .from("reviews")
        .select("rating")
        .eq(
          "listing_id",
          data.id
        );

    if (
      reviews &&
      reviews.length > 0
    ) {

      const avg =
        (
          reviews.reduce(
            (
              acc,
              review
            ) =>

              acc +
              review.rating,

            0
          ) /
          reviews.length
        ).toFixed(1);

      setAverageRating(avg);

    } else {

      setAverageRating(
        "0.0"
      );
    }
  }

  async function handleCheckout() {

    if (!user) {

      router.push("/login");

      return;
    }

    if (
      user.id ===
      listing.user_id
    ) {

      alert(
        "Eigenes Listing kann nicht gebucht werden."
      );

      return;
    }

    try {

      setCheckoutLoading(true);

      const response =
        await fetch(
          "/api/checkout",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              title:
                listing.title,

              price:
                listing.price,

              listingId:
                listing.id,

              renterId:
                user.id,

              ownerId:
                listing.user_id,
            }),
          }
        );

      const data =
        await response.json();

      if (data.url) {

        window.location.href =
          data.url;

      } else {

        alert(
          "Stripe Fehler"
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Stripe Fehler"
      );

    } finally {

      setCheckoutLoading(false);
    }
  }

  function handleMessage() {

    if (!user) {

      router.push("/login");

      return;
    }

    router.push(
      `/messages/${listing.user_id}`
    );
  }

  async function shareListing() {

    try {

      if (navigator.share) {

        await navigator.share({

          title:
            listing.title,

          text:
            listing.description,

          url:
            window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      alert(
        "Link kopiert"
      );

    } catch {

      alert(
        "Teilen fehlgeschlagen"
      );
    }
  }

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-3xl
          font-black
        "
      >
        Listing wird geladen...
      </div>

    );
  }

  if (!listing) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-4xl
          font-black
        "
      >
        Listing nicht gefunden
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}

          <div>

            <div
              className="
                relative
                w-full
                h-[550px]
                rounded-[40px]
                overflow-hidden
                bg-white
                shadow-sm
                mb-5
              "
            >

              <Image
                src={
                  listing.images?.[
                    currentImage
                  ] ||
                  "https://placehold.co/1200x900/png"
                }
                alt={
                  listing.title ||
                  "Listing"
                }
                fill
                priority
                className="
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  top-5
                  left-5
                  px-5
                  py-3
                  rounded-full
                  bg-black/70
                  text-white
                  backdrop-blur
                  font-bold
                  z-10
                "
              >

                {
                  listing.category ||
                  "Listing"
                }

              </div>

              <FavoriteButton
                listingId={listing.id}
              />

            </div>

            {listing.images?.length > 1 && (

              <div
                className="
                  flex
                  gap-4
                  overflow-x-auto
                  pb-2
                "
              >

                {listing.images.map(
                  (
                    image: string,
                    index: number
                  ) => (

                    <button
                      key={index}
                      onClick={() =>
                        setCurrentImage(
                          index
                        )
                      }
                      className={`
                        relative
                        min-w-[120px]
                        h-[100px]
                        rounded-2xl
                        overflow-hidden
                        border-4
                        transition
                        ${
                          currentImage === index

                            ? "border-[#16d64d] scale-105"

                            : "border-transparent"
                        }
                      `}
                    >

                      <Image
                        src={image}
                        alt=""
                        fill
                        className="
                          object-cover
                        "
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>

          {/* RIGHT */}

          <div
            className="
              bg-white
              rounded-[40px]
              p-10
              shadow-sm
              h-fit
              lg:sticky
              lg:top-28
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-5
                mb-6
              "
            >

              <div>

                <h1
                  className="
                    text-5xl
                    font-black
                    mb-5
                  "
                >
                  {
                    listing.title
                  }
                </h1>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-gray-500
                    text-lg
                    mb-5
                  "
                >

                  <MapPin
                    size={20}
                  />

                  {
                    listing.location ||
                    "Standort unbekannt"
                  }

                </div>

              </div>

            </div>

            <div
              className="
                flex
                items-center
                gap-3
                mb-8
              "
            >

              <Star
                size={22}
                className="
                  text-yellow-400
                  fill-yellow-400
                "
              />

              <span
                className="
                  font-black
                  text-xl
                "
              >
                {
                  averageRating
                } Bewertung
              </span>

            </div>

            <div className="mb-10">

              <p
                className="
                  text-gray-500
                  mb-2
                "
              >
                Preis
              </p>

              <h2
                className="
                  text-6xl
                  font-black
                "
              >
                €
                {
                  listing.price
                }
              </h2>

            </div>

            <p
              className="
                text-gray-700
                leading-9
                text-lg
                mb-10
              "
            >
              {
                listing.description ||
                "Keine Beschreibung vorhanden."
              }
            </p>

            {owner && (

              <Link
                href={`/user/${owner.id}`}
                className="
                  flex
                  items-center
                  gap-5
                  bg-[#f5f7fb]
                  rounded-[32px]
                  p-6
                  mb-8
                  hover:scale-[1.01]
                  transition
                "
              >

                <div
                  className="
                    relative
                    w-20
                    h-20
                    rounded-full
                    overflow-hidden
                    bg-gray-100
                    flex-shrink-0
                  "
                >

                  <Image
                    src={
                      owner.avatar_url ||
                      "https://placehold.co/300x300/png"
                    }
                    alt="Host"
                    fill
                    className="
                      object-cover
                    "
                  />

                </div>

                <div>

                  <h3
                    className="
                      text-2xl
                      font-black
                      mb-2
                    "
                  >

                    {
                      owner.full_name ||
                      "Host"
                    }

                  </h3>

                  <p className="text-gray-500">
                    Profil ansehen
                  </p>

                </div>

              </Link>

            )}

            {listing.latitude &&
             listing.longitude && (

              <div
                className="
                  mb-8
                  border
                  border-gray-100
                  rounded-[32px]
                  overflow-hidden
                "
              >

                <iframe
                  src={`https://maps.google.com/maps?q=${listing.latitude},${listing.longitude}&z=15&output=embed`}
                  width="100%"
                  height="320"
                  loading="lazy"
                  className="border-0"
                />

              </div>

            )}

            <div className="space-y-4">

              {user?.id !==
                listing.user_id && (

                <button
                  onClick={
                    handleCheckout
                  }
                  disabled={
                    checkoutLoading
                  }
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    bg-[#16d64d]
                    text-white
                    text-xl
                    font-black
                    disabled:opacity-50
                  "
                >

                  {
                    checkoutLoading

                      ? "Weiterleitung..."

                      : "Jetzt buchen"
                  }

                </button>

              )}

              {user?.id !==
                listing.user_id && (

                <button
                  onClick={
                    handleMessage
                  }
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    border
                    border-gray-200
                    flex
                    items-center
                    justify-center
                    gap-3
                    text-lg
                    font-bold
                  "
                >

                  <MessageCircle
                    size={22}
                  />

                  Nachricht senden

                </button>

              )}

              <button
                onClick={
                  shareListing
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-lg
                  font-bold
                "
              >

                <Share2
                  size={22}
                />

                Teilen

              </button>

              <button
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-red-200
                  text-red-500
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-lg
                  font-bold
                "
              >

                <Flag
                  size={22}
                />

                Listing melden

              </button>

            </div>

            <div
              className="
                mt-8
                bg-green-50
                border
                border-green-100
                rounded-3xl
                p-6
                flex
                gap-4
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#16d64d]
                  text-white
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >

                <Shield
                  size={26}
                />

              </div>

              <div>

                <h3
                  className="
                    font-black
                    text-lg
                    mb-1
                  "
                >
                  Sicher bezahlen
                </h3>

                <p className="text-gray-600">
                  Stripe sichere Zahlung &
                  verifizierte Anbieter.
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-16">

          <ReviewsSection
            listingId={listing.id}
          />

        </div>

      </div>

      <Footer />

    </main>
  );
}