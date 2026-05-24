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
import ListingMap from "@/components/ListingMap";

import {

  MessageCircle,

  MapPin,

  ShieldCheck,

  Star,

  Clock3,

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

  const [excludedDates, setExcludedDates] =
    useState<Date[]>([]);

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

      await loadBlockedDates();

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

  async function loadBlockedDates() {

    const { data } =
      await supabase
        .from("bookings")
        .select("*")
        .eq(
          "listing_id",
          listingId
        )
        .neq(
          "status",
          "cancelled"
        );

    if (!data) return;

    const dates: Date[] = [];

    data.forEach((booking) => {

      const start =
        new Date(
          booking.start_date
        );

      const end =
        new Date(
          booking.end_date
        );

      const current =
        new Date(start);

      while (
        current <= end
      ) {

        dates.push(
          new Date(current)
        );

        current.setDate(
          current.getDate() + 1
        );
      }
    });

    setExcludedDates(dates);
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

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-6
          md:py-10
        "
      >

        {/* HEADER */}

        <div className="mb-8">

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-4
              mb-5
            "
          >

            <div
              className="
                px-4
                py-2
                rounded-full
                bg-[#16d64d]
                text-white
                text-sm
                font-black
              "
            >

              {
                listing.category ||
                "Listing"
              }

            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-gray-600
              "
            >

              <Star
                size={16}
                className="
                  text-yellow-400
                  fill-yellow-400
                "
              />

              {averageRating}

            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-gray-600
              "
            >

              <ShieldCheck
                size={16}
                className="
                  text-[#16d64d]
                "
              />

              Verifiziert

            </div>

          </div>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-black
              leading-tight
              mb-5
            "
          >

            {listing.title}

          </h1>

          <div
            className="
              flex
              items-center
              gap-3
              text-gray-500
              text-lg
            "
          >

            <MapPin size={20} />

            {
              listing.location ||
              "Standort unbekannt"
            }

          </div>

        </div>

        {/* MAIN GRID */}

        <div
          className="
            grid
            lg:grid-cols-[1.2fr_0.8fr]
            gap-10
          "
        >

          {/* LEFT */}

          <div className="space-y-10">

            {/* GALLERY */}

            <div
              className="
                bg-white
                rounded-[40px]
                p-3
                shadow-sm
              "
            >

              <ImageGallery
                images={listing.images}
              />

            </div>

            {/* DESCRIPTION */}

            <div
              className="
                bg-white
                rounded-[40px]
                p-7
                md:p-10
                shadow-sm
              "
            >

              <h2
                className="
                  text-3xl
                  md:text-4xl
                  font-black
                  mb-8
                "
              >

                Beschreibung

              </h2>

              <p
                className="
                  text-gray-700
                  leading-9
                  text-lg
                "
              >

                {
                  listing.description ||
                  "Keine Beschreibung vorhanden."
                }

              </p>

            </div>

            {/* HOST */}

            {owner && (

              <div
                className="
                  bg-white
                  rounded-[40px]
                  p-7
                  md:p-10
                  shadow-sm
                "
              >

                <h2
                  className="
                    text-3xl
                    md:text-4xl
                    font-black
                    mb-8
                  "
                >

                  Vermieter

                </h2>

                <Link
                  href={`/user/${owner.id}`}
                  className="
                    flex
                    items-center
                    gap-5
                  "
                >

                  <div
                    className="
                      relative
                      w-24
                      h-24
                      rounded-full
                      overflow-hidden
                      bg-gray-100
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
                      unoptimized
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

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-gray-500
                      "
                    >

                      <Clock3 size={16} />

                      Antwortet schnell

                    </div>

                  </div>

                </Link>

              </div>

            )}

            {/* MAP */}

            <div
              className="
                bg-white
                rounded-[40px]
                p-5
                md:p-8
                shadow-sm
              "
            >

              <h2
                className="
                  text-3xl
                  md:text-4xl
                  font-black
                  mb-8
                "
              >

                Standort

              </h2>

              <ListingMap
                lat={
                  listing.latitude ||
                  52.52
                }
                lng={
                  listing.longitude ||
                  13.405
                }
              />

            </div>

            {/* REVIEWS */}

            <ReviewsSection
              listingId={listing.id}
            />

          </div>

          {/* RIGHT */}

          <div>

            <div
              className="
                sticky
                top-28
                bg-white
                rounded-[40px]
                p-6
                md:p-8
                shadow-xl
                border
                border-gray-100
              "
            >

              {/* PRICE */}

              <div className="mb-8">

                <p
                  className="
                    text-gray-400
                    mb-2
                  "
                >

                  Preis pro Tag

                </p>

                <div
                  className="
                    flex
                    items-end
                    gap-2
                  "
                >

                  <h2
                    className="
                      text-5xl
                      md:text-6xl
                      font-black
                      leading-none
                    "
                  >

                    €

                    {listing.price}

                  </h2>

                  <span
                    className="
                      text-gray-500
                      text-lg
                      mb-1
                    "
                  >

                    / Tag

                  </span>

                </div>

              </div>

              {/* CALENDAR */}

              <div className="mb-8">

                <BookingCalendar
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  excludedDates={excludedDates}
                />

              </div>

              {/* TOTAL */}

              {totalDays > 0 && (

                <div
                  className="
                    bg-[#f5f7fb]
                    rounded-3xl
                    p-6
                    mb-8
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-4
                    "
                  >

                    <span
                      className="
                        text-gray-500
                      "
                    >

                      Tage

                    </span>

                    <span
                      className="
                        font-black
                      "
                    >

                      {totalDays}

                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-gray-500
                      "
                    >

                      Gesamtpreis

                    </span>

                    <span
                      className="
                        text-3xl
                        font-black
                      "
                    >

                      €{totalPrice}

                    </span>

                  </div>

                </div>

              )}

              {/* BUTTONS */}

              <div className="space-y-4">

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    bg-[#16d64d]
                    text-white
                    text-lg
                    md:text-xl
                    font-black
                    hover:scale-[1.01]
                    transition
                  "
                >

                  Jetzt buchen

                </button>

                <button
                  onClick={handleMessage}
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
                    hover:bg-gray-50
                    transition
                  "
                >

                  <MessageCircle
                    size={22}
                  />

                  Nachricht senden

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}