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
import ImageGallery from "@/components/ImageGallery";
import BookingCalendar from "@/components/BookingCalendar";

import {
  MessageCircle,
  MapPin,
  Star,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

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

  const [averageRating, setAverageRating] =
    useState("0.0");

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const [startDate, setStartDate] =
    useState<Date | null>(null);

  const [endDate, setEndDate] =
    useState<Date | null>(null);

  const totalDays =
    startDate && endDate

      ? Math.ceil(
          (
            endDate.getTime() -
            startDate.getTime()
          ) /
            (1000 * 60 * 60 * 24)
        ) + 1

      : 0;

  const totalPrice =
    totalDays *
    (listing?.price || 0);

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

        setUser(session.user);
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
        .eq("id", listingId)
        .maybeSingle();

    if (error || !data) {

      setListing(null);

      return;
    }

    let fixedImages: string[] = [];

    if (Array.isArray(data.images)) {

      fixedImages =
        data.images.filter(Boolean);

    } else if (
      typeof data.images === "string"
    ) {

      fixedImages = [data.images];
    }

    if (fixedImages.length === 0) {

      fixedImages = [
        "https://placehold.co/1200x900/png",
      ];
    }

    data.images = fixedImages;

    setListing(data);

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

      setAverageRating("0.0");
    }
  }

  async function handleCheckout() {

    if (!user) {

      router.push("/login");

      return;
    }

    if (
      !startDate ||
      !endDate
    ) {

      alert(
        "Bitte Zeitraum auswählen."
      );

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

      localStorage.setItem(
        "pendingBooking",

        JSON.stringify({

          listingId:
            listing.id,

          renterId:
            user.id,

          ownerId:
            listing.user_id,

          totalPrice,

          startDate,

          endDate,
        })
      );

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

              totalPrice,

              listingId:
                listing.id,

              renterId:
                user.id,

              ownerId:
                listing.user_id,

              startDate,

              endDate,
            }),
          }
        );

      const data =
        await response.json();

      if (data.url) {

        window.location.href =
          data.url;
      }

    } catch (error) {

      console.log(error);

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

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-black">

        Listing wird geladen...

      </div>

    );
  }

  if (!listing) {

    return (

      <div className="min-h-screen flex items-center justify-center text-4xl font-black">

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

            <ImageGallery
              images={listing.images}
            />

          </div>

          {/* RIGHT */}

          <div className="bg-white rounded-[40px] p-10 shadow-sm h-fit lg:sticky lg:top-28">

            <div className="flex items-start justify-between gap-5 mb-6">

              <div>

                <h1 className="text-5xl font-black mb-5">

                  {listing.title}

                </h1>

                <div className="flex items-center gap-3 text-gray-500 text-lg mb-5">

                  <MapPin size={20} />

                  {
                    listing.location ||
                    "Standort unbekannt"
                  }

                </div>

              </div>

            </div>

            <div className="flex items-center gap-3 mb-8">

              <Star
                size={22}
                className="text-yellow-400 fill-yellow-400"
              />

              <span className="font-black text-xl">

                {averageRating} Bewertung

              </span>

            </div>

            <div className="mb-10">

              <p className="text-gray-500 mb-2">

                Preis pro Tag

              </p>

              <h2 className="text-6xl font-black">

                €{listing.price}

              </h2>

            </div>

            <p className="text-gray-700 leading-9 text-lg mb-10">

              {
                listing.description ||
                "Keine Beschreibung vorhanden."
              }

            </p>

            {owner && (

              <Link
                href={`/user/${owner.id}`}
                className="flex items-center gap-5 bg-[#f5f7fb] rounded-[32px] p-6 mb-8"
              >

                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">

                  <Image
                    src={
                      owner.avatar_url ||
                      "https://placehold.co/300x300/png"
                    }
                    alt="Host"
                    fill
                    className="object-cover"
                    unoptimized
                  />

                </div>

                <div>

                  <h3 className="text-2xl font-black mb-2">

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

            {/* CALENDAR */}

            <div className="mb-8">

              <BookingCalendar
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />

            </div>

            {/* TOTAL */}

            {totalDays > 0 && (

              <div className="bg-[#f5f7fb] rounded-3xl p-6 mb-8">

                <div className="flex items-center justify-between mb-3">

                  <span className="text-gray-500">

                    Tage

                  </span>

                  <span className="font-bold">

                    {totalDays}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-gray-500">

                    Gesamtpreis

                  </span>

                  <span className="text-3xl font-black">

                    €{totalPrice}

                  </span>

                </div>

              </div>

            )}

            {/* ACTIONS */}

            <div className="space-y-4">

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full h-16 rounded-2xl bg-[#16d64d] text-white text-xl font-black"
              >

                Jetzt buchen

              </button>

              <button
                onClick={handleMessage}
                className="w-full h-16 rounded-2xl border border-gray-200 flex items-center justify-center gap-3 text-lg font-bold"
              >

                <MessageCircle size={22} />

                Nachricht senden

              </button>

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