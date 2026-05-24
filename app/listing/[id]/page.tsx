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

  Flag,

  X,

} from "lucide-react";

import toast
from "react-hot-toast";

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

  /*
    REPORT SYSTEM
  */

  const [reportOpen, setReportOpen] =
    useState(false);

  const [reportReason, setReportReason] =
    useState("Spam");

  const [reportMessage, setReportMessage] =
    useState("");

  const [reportLoading, setReportLoading] =
    useState(false);

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

    if (data.image) {

      fixedImages.unshift(
        data.image
      );
    }

    if (
      fixedImages.length === 0
    ) {

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

      toast.error(
        "Bitte Zeitraum auswählen"
      );

      return;
    }

    if (
      user.id ===
      listing.user_id
    ) {

      toast.error(
        "Eigenes Listing kann nicht gebucht werden"
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

      } else {

        toast.error(
          data.error ||
          "Checkout Fehler"
        );
      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Checkout Fehler"
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

  /*
    REPORT LISTING
  */

  async function submitReport() {

    if (!user) {

      router.push("/login");

      return;
    }

    try {

      setReportLoading(true);

      await supabase
        .from("reports")
        .insert({

          listing_id:
            listing.id,

          reporter_id:
            user.id,

          reason:
            reportReason,

          message:
            reportMessage,
        });

      toast.success(
        "Listing gemeldet"
      );

      setReportOpen(false);

      setReportMessage("");

      setReportReason(
        "Spam"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Fehler beim Melden"
      );

    } finally {

      setReportLoading(false);
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

    <>

      <main className="min-h-screen bg-[#f5f7fb]">

        <Navbar />

        {/* REPORT MODAL */}

        {reportOpen && (

          <div
            className="
              fixed
              inset-0
              z-[100]
              bg-black/50
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
          >

            <div
              className="
                bg-white
                rounded-[40px]
                p-8
                max-w-2xl
                w-full
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-8
                "
              >

                <h2
                  className="
                    text-4xl
                    font-black
                  "
                >

                  Listing melden

                </h2>

                <button
                  onClick={() =>
                    setReportOpen(false)
                  }
                >

                  <X size={30} />

                </button>

              </div>

              <div className="space-y-6">

                <select
                  value={reportReason}
                  onChange={(e) =>
                    setReportReason(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    border
                    border-gray-200
                    px-5
                    text-lg
                    outline-none
                  "
                >

                  <option>
                    Spam
                  </option>

                  <option>
                    Betrug
                  </option>

                  <option>
                    Falsche Bilder
                  </option>

                  <option>
                    Verbotener Inhalt
                  </option>

                  <option>
                    Sonstiges
                  </option>

                </select>

                <textarea
                  value={reportMessage}
                  onChange={(e) =>
                    setReportMessage(
                      e.target.value
                    )
                  }
                  placeholder="Beschreibe das Problem..."
                  className="
                    w-full
                    h-40
                    rounded-2xl
                    border
                    border-gray-200
                    p-5
                    outline-none
                    resize-none
                    text-lg
                  "
                />

                <button
                  onClick={
                    submitReport
                  }
                  disabled={
                    reportLoading
                  }
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    bg-red-500
                    text-white
                    text-lg
                    font-black
                  "
                >

                  {reportLoading

                    ? "Wird gesendet..."

                    : "Listing melden"}

                </button>

              </div>

            </div>

          </div>

        )}

        {/* REST DEINER PAGE */}

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

            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-start
                lg:justify-between
                gap-6
              "
            >

              <div>

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

              {/* REPORT BUTTON */}

              <button
                onClick={() =>
                  setReportOpen(true)
                }
                className="
                  h-14
                  px-6
                  rounded-2xl
                  bg-red-500
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-3
                  font-black
                  min-w-fit
                "
              >

                <Flag size={20} />

                Melden

              </button>

            </div>

          </div>

        </div>

 {listing && (

  <ReviewsSection
    listingId={listing.id}
    ownerId={listing.user_id}
    user={user}
  />

)}
        <Footer />

      </main>

    </>

  );
}