"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewsSection";
import ImageGallery from "@/components/ImageGallery";
import BookingCalendar from "@/components/BookingCalendar";
import ListingMap from "@/components/ListingMap";
import ListingCard from "@/components/ListingCard";

import {

  MessageCircle,

  MapPin,

  ShieldCheck,

  Star,

  Clock3,

  Flag,

  X,

  BadgeCheck,

  CalendarDays,

  Sparkles,

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

  const [
    recommendations,
    setRecommendations,
  ] = useState<any[]>([]);

  const [owner, setOwner] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  const [averageRating, setAverageRating] =
    useState("0.0");

  const [reviewsCount, setReviewsCount] =
    useState(0);

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

      const loadedListing =
        await fetchListing();

      if (loadedListing) {

        await loadRecommendations(
          loadedListing
        );
      }

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

      return null;
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

    /*
      OWNER
    */

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

    /*
      REVIEWS
    */

    const {
      data: reviews,
    } =
      await supabase
        .from("reviews")
        .select("*")
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

      setReviewsCount(
        reviews.length
      );

    } else {

      setAverageRating("0.0");

      setReviewsCount(0);
    }

    return data;
  }

  async function loadRecommendations(
    item: any
  ) {

    try {

      const res =
        await fetch(
          "/api/ai/recommendations",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              title:
                item.title,

              category:
                item.category,

              listingId:
                item.id,
            }),
          }
        );

      const data =
        await res.json();

      setRecommendations(
        data.recommendations || []
      );

    } catch (error) {

      console.log(error);
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

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* HEADER */}

        <div className="mb-10">

          <div className="flex flex-wrap items-center gap-4 mb-5">

            <div className="px-4 py-2 rounded-full bg-[#16d64d] text-white text-sm font-black">

              {listing.category || "Listing"}

            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">

              <Star
                size={16}
                className="text-yellow-400 fill-yellow-400"
              />

              {averageRating}
              {" "}
              ({reviewsCount})

            </div>

            {owner?.verified_identity && (

              <div className="flex items-center gap-2 text-sm font-bold text-[#16d64d]">

                <ShieldCheck
                  size={16}
                />

                Verifiziert

              </div>

            )}

            {listing.ai_verified && (

              <div className="px-4 py-2 rounded-full bg-[#16d64d]/10 text-[#16d64d] text-sm font-black">

                ✓ AI Verified

              </div>

            )}

          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">

                {listing.title}

              </h1>

              <div className="flex items-center gap-3 text-gray-500 text-lg">

                <MapPin size={20} />

                {listing.location || "Standort unbekannt"}

              </div>

            </div>

            <button
              onClick={() =>
                setReportOpen(true)
              }
              className="h-14 px-6 rounded-2xl bg-red-500 text-white flex items-center justify-center gap-3 font-black hover:scale-[1.02] transition-all"
            >

              <Flag size={20} />

              Melden

            </button>

          </div>

        </div>

        {/* CONTENT */}

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-10">

          {/* LEFT */}

          <div className="space-y-10">

            <ImageGallery
              images={listing.images}
            />

            {/* DESCRIPTION */}

            <div className="bg-white rounded-[40px] p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <Sparkles
                  className="text-[#16d64d]"
                />

                <h2 className="text-4xl font-black">

                  Beschreibung

                </h2>

              </div>

              <p className="text-gray-600 text-lg leading-10 whitespace-pre-line">

                {listing.description}

              </p>

            </div>

            {/* OWNER */}

            <div className="bg-white rounded-[40px] p-8 shadow-sm">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

                <div className="flex items-center gap-5">

                  <img
                    src={
                      owner?.avatar_url ||

                      "https://placehold.co/200x200/png"
                    }
                    className="w-24 h-24 rounded-full object-cover"
                  />

                  <div>

                    <Link
                      href={`/user/${listing.user_id}`}
                    >

                      <h3 className="text-3xl font-black mb-2 hover:underline">

                        {owner?.full_name || "Gastgeber"}

                      </h3>

                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-gray-500">

                      <div className="flex items-center gap-2">

                        <Clock3 size={18} />

                        Antwortet schnell

                      </div>

                      {owner?.verified_identity && (

                        <div className="flex items-center gap-2 text-[#16d64d] font-bold">

                          <BadgeCheck
                            size={18}
                          />

                          Verifiziert

                        </div>

                      )}

                    </div>

                  </div>

                </div>

                <button
                  onClick={handleMessage}
                  className="h-16 px-8 rounded-2xl bg-black text-white flex items-center justify-center gap-3 font-black text-lg hover:scale-[1.02] transition-all"
                >

                  <MessageCircle size={22} />

                  Nachricht senden

                </button>

              </div>

            </div>

            {/* MAP */}

            <div className="bg-white rounded-[40px] p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-8">

                <MapPin
                  className="text-[#16d64d]"
                />

                <h2 className="text-4xl font-black">

                  Standort

                </h2>

              </div>

              <ListingMap
                lat={listing.latitude}
                lng={listing.longitude}
                title={listing.title}
                image={listing.images?.[0]}
                price={listing.price}
                location={listing.location}
              />

            </div>

            {/* REVIEWS */}

            <ReviewsSection
              listingId={listing.id}
              ownerId={listing.user_id}
              user={user}
            />

            {/* RECOMMENDATIONS */}

            {recommendations.length > 0 && (

              <section className="mt-24">

                <div className="flex items-end justify-between mb-8">

                  <div>

                    <h2 className="text-4xl font-black">

                      Ähnliche Listings

                    </h2>

                    <p className="text-gray-500 mt-2">

                      AI Empfehlungen für dich

                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                  {recommendations.map(
                    (item) => (

                      <ListingCard
                        key={item.id}
                        listing={item}
                      />

                    )
                  )}

                </div>

              </section>

            )}

          </div>

          {/* RIGHT */}

          <div className="xl:sticky xl:top-28 h-fit">

            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">

              <div className="flex items-end gap-3 mb-8">

                <span className="text-6xl font-black">

                  €
                  {listing.price}

                </span>

                <span className="text-gray-500 text-xl mb-2">

                  / {listing.rental_type}

                </span>

              </div>

              <BookingCalendar
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                excludedDates={excludedDates}
              />

              {totalDays > 0 && (

                <div className="mt-8 space-y-5">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">

                      €
                      {listing.price}
                      {" "}
                      ×
                      {" "}
                      {totalDays}
                      {" "}
                      Tage

                    </span>

                    <span className="font-black">

                      €
                      {totalPrice}

                    </span>

                  </div>

                  <div className="border-t pt-5 flex items-center justify-between">

                    <span className="text-2xl font-black">

                      Gesamt

                    </span>

                    <span className="text-3xl font-black text-[#16d64d]">

                      €
                      {totalPrice}

                    </span>

                  </div>

                </div>

              )}

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full h-16 rounded-2xl bg-[#16d64d] text-white text-lg font-black mt-8 hover:scale-[1.01] transition-all"
              >

                {checkoutLoading

                  ? "Weiterleitung..."

                  : "Jetzt buchen"}

              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">

                <ShieldCheck
                  size={16}
                />

                Sichere Zahlung mit Stripe

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* REPORT MODAL */}

      {reportOpen && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-xl rounded-[40px] p-8 relative">

            <button
              onClick={() =>
                setReportOpen(false)
              }
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
            >

              <X size={20} />

            </button>

            <h2 className="text-4xl font-black mb-8">

              Listing melden

            </h2>

            <div className="space-y-5">

              <select
                value={reportReason}
                onChange={(e) =>
                  setReportReason(
                    e.target.value
                  )
                }
                className="w-full h-16 rounded-2xl border border-gray-200 px-5"
              >

                <option>
                  Spam
                </option>

                <option>
                  Betrug
                </option>

                <option>
                  Fake Listing
                </option>

                <option>
                  Illegale Inhalte
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
                className="w-full h-52 rounded-2xl border border-gray-200 p-5 resize-none"
              />

            </div>

            <button
              onClick={submitReport}
              disabled={reportLoading}
              className="w-full h-16 rounded-2xl bg-red-500 text-white font-black text-lg mt-8"
            >

              {reportLoading

                ? "Wird gesendet..."

                : "Listing melden"}

            </button>

          </div>

        </div>

      )}

      <Footer />

    </main>

  );
}