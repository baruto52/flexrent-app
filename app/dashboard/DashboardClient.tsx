"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {

  Plus,

  Eye,

  EyeOff,

  Pencil,

  Trash2,

  Sparkles,

  Euro,

  Package,

  Activity,

  ArrowUpRight,

  ShieldCheck,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function DashboardClient() {

  const [loading, setLoading] =
    useState(true);

  const [listings, setListings] =
    useState<any[]>([]);

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {

    let realtimeChannel: any;

    init().then(
      (channel) => {

        realtimeChannel =
          channel;
      }
    );

    return () => {

      if (realtimeChannel) {

        supabase.removeChannel(
          realtimeChannel
        );
      }
    };

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {

      window.location.href =
        "/login";

      return;
    }

    await Promise.all([

      loadProfile(
        session.user.id
      ),

      loadListings(
        session.user.id
      ),
    ]);

    return listenListings(
      session.user.id
    );
  }

  function listenListings(
    userId: string
  ) {

    const channel =
      supabase.channel(
        `dashboard-${userId}`
      );

    channel.on(

      "postgres_changes",

      {

        event: "*",

        schema: "public",

        table:
          "listings",

        filter:
          `user_id=eq.${userId}`,
      },

      () => {

        loadListings(
          userId
        );
      }

    );

    channel.subscribe();

    return channel;
  }

  async function loadProfile(
    userId: string
  ) {

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          userId
        )
        .single();

    setProfile(data);
  }

  async function loadListings(
    userId: string
  ) {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("listings")
          .select("*")
          .eq(
            "user_id",
            userId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {

        console.log(error);

        setListings([]);

        return;
      }

      setListings(
        data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  async function deleteListing(
    id: string
  ) {

    const confirmed =
      confirm(
        "Listing löschen?"
      );

    if (!confirmed)
      return;

    await supabase
      .from("listings")
      .delete()
      .eq(
        "id",
        id
      );

    setListings(
      (prev) =>

        prev.filter(
          (listing) =>
            listing.id !== id
        )
    );
  }

  async function toggleActive(
    id: string,
    active: boolean
  ) {

    await supabase
      .from("listings")
      .update({

        active:
          !active,
      })
      .eq(
        "id",
        id
      );

    setListings(
      (prev) =>

        prev.map(
          (listing) =>

            listing.id === id

              ? {

                  ...listing,

                  active:
                    !active,
                }

              : listing
        )
    );
  }

  const activeListings =

    listings.filter(
      (listing) =>
        listing.active
    ).length;

  const inactiveListings =

    listings.filter(
      (listing) =>
        !listing.active
    ).length;

  const totalValue =

    listings.reduce(

      (
        acc,
        listing
      ) =>

        acc +
        (
          Number(
            listing.price
          ) || 0
        ),

      0
    );

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

        Dashboard wird geladen...

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
          py-8
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-8
            mb-12
          "
        >

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-3
                px-5
                py-3
                rounded-full
                bg-[#16d64d]
                text-white
                font-black
                mb-6
              "
            >

              <Sparkles
                size={20}
              />

              Vermieter Dashboard

            </div>

            <h1
              className="
                text-5xl
                md:text-7xl
                font-black
                leading-none
                tracking-tight
              "
            >

              Willkommen
              <br />

              zurück

            </h1>

            <p
              className="
                text-gray-500
                text-lg
                md:text-2xl
                mt-5
                max-w-3xl
              "
            >

              Verwalte deine Listings,
              Einnahmen und Aktivitäten
              auf FlexRent.

            </p>

          </div>

          {/* PROFILE */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-6
              shadow-sm
              border
              border-gray-100
              flex
              items-center
              gap-5
            "
          >

            <img
              src={
                profile?.avatar_url ||
                "/avatar.png"
              }
              className="
                w-20
                h-20
                rounded-full
                object-cover
                border-4
                border-white
                shadow-lg
              "
            />

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-2
                "
              >

                <h2
                  className="
                    text-2xl
                    font-black
                  "
                >

                  {
                    profile?.full_name ||
                    "User"
                  }

                </h2>

                <ShieldCheck
                  size={18}
                  className="
                    text-[#16d64d]
                  "
                />

              </div>

              <p
                className="
                  text-gray-500
                "
              >

                Premium Vermieter

              </p>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
            mb-12
          "
        >

          {/* TOTAL */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-7
              shadow-sm
              border
              border-gray-100
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#16d64d]/10
                flex
                items-center
                justify-center
                mb-6
              "
            >

              <Package
                size={30}
                className="
                  text-[#16d64d]
                "
              />

            </div>

            <p
              className="
                text-gray-400
                mb-3
              "
            >

              Listings

            </p>

            <h2
              className="
                text-5xl
                font-black
                leading-none
              "
            >

              {listings.length}

            </h2>

          </div>

          {/* ACTIVE */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-7
              shadow-sm
              border
              border-gray-100
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-blue-500/10
                flex
                items-center
                justify-center
                mb-6
              "
            >

              <Activity
                size={30}
                className="
                  text-blue-500
                "
              />

            </div>

            <p
              className="
                text-gray-400
                mb-3
              "
            >

              Aktiv

            </p>

            <h2
              className="
                text-5xl
                font-black
                leading-none
              "
            >

              {activeListings}

            </h2>

          </div>

          {/* INACTIVE */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-7
              shadow-sm
              border
              border-gray-100
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-red-500/10
                flex
                items-center
                justify-center
                mb-6
              "
            >

              <EyeOff
                size={30}
                className="
                  text-red-500
                "
              />

            </div>

            <p
              className="
                text-gray-400
                mb-3
              "
            >

              Inaktiv

            </p>

            <h2
              className="
                text-5xl
                font-black
                leading-none
              "
            >

              {inactiveListings}

            </h2>

          </div>

          {/* VALUE */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-7
              shadow-sm
              border
              border-gray-100
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-yellow-500/10
                flex
                items-center
                justify-center
                mb-6
              "
            >

              <Euro
                size={30}
                className="
                  text-yellow-500
                "
              />

            </div>

            <p
              className="
                text-gray-400
                mb-3
              "
            >

              Gesamtwert

            </p>

            <h2
              className="
                text-5xl
                font-black
                leading-none
              "
            >

              €{totalValue}

            </h2>

          </div>

        </div>

        {/* ACTIONS */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-5
            mb-12
          "
        >

          <Link
            href="/create"
            className="
              h-16
              px-8
              rounded-2xl
              bg-[#16d64d]
              text-white
              flex
              items-center
              justify-center
              gap-3
              font-black
              text-lg
              shadow-lg
            "
          >

            <Plus
              size={22}
            />

            Neues Listing

          </Link>

          <Link
            href="/map"
            className="
              h-16
              px-8
              rounded-2xl
              bg-white
              border
              border-gray-200
              flex
              items-center
              justify-center
              gap-3
              font-black
              text-lg
            "
          >

            <ArrowUpRight
              size={22}
            />

            Explore Map

          </Link>

        </div>

        {/* LISTINGS */}

        <div className="space-y-6">

          {listings.map(
            (listing) => (

              <div
                key={listing.id}
                className="
                  bg-white
                  rounded-[40px]
                  p-5
                  md:p-6
                  shadow-sm
                  border
                  border-gray-100
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    xl:flex-row
                    xl:items-center
                    gap-6
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      w-full
                      xl:w-[240px]
                      h-[220px]
                      rounded-[30px]
                      overflow-hidden
                      flex-shrink-0
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
                      "
                    />

                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <div
                      className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                        gap-5
                      "
                    >

                      <div>

                        <div
                          className="
                            inline-flex
                            px-4
                            py-2
                            rounded-full
                            bg-[#16d64d]/10
                            text-[#16d64d]
                            font-black
                            text-sm
                            mb-4
                          "
                        >

                          {
                            listing.category ||
                            "Listing"
                          }

                        </div>

                        <h2
                          className="
                            text-3xl
                            font-black
                            mb-4
                          "
                        >

                          {
                            listing.title
                          }

                        </h2>

                        <p
                          className="
                            text-gray-500
                            line-clamp-2
                            leading-7
                            max-w-3xl
                          "
                        >

                          {
                            listing.description
                          }

                        </p>

                      </div>

                      {/* PRICE */}

                      <div
                        className="
                          bg-[#f5f7fb]
                          rounded-3xl
                          px-6
                          py-5
                          min-w-fit
                        "
                      >

                        <p
                          className="
                            text-gray-400
                            mb-2
                          "
                        >

                          Preis

                        </p>

                        <h3
                          className="
                            text-4xl
                            font-black
                            leading-none
                          "
                        >

                          €
                          {
                            listing.price
                          }

                        </h3>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-4
                        mt-8
                      "
                    >

                      <button
                        onClick={() =>
                          toggleActive(
                            listing.id,
                            listing.active
                          )
                        }
                        className={`
                          h-14
                          px-6
                          rounded-2xl
                          text-white
                          flex
                          items-center
                          justify-center
                          gap-3
                          font-black
                          ${
                            listing.active

                              ? "bg-red-500"

                              : "bg-[#16d64d]"
                          }
                        `}
                      >

                        {listing.active ? (

                          <>

                            <EyeOff
                              size={20}
                            />

                            Deaktivieren

                          </>

                        ) : (

                          <>

                            <Eye
                              size={20}
                            />

                            Aktivieren

                          </>

                        )}

                      </button>

                      <Link
                        href={`/edit/${listing.id}`}
                        className="
                          h-14
                          px-6
                          rounded-2xl
                          bg-black
                          text-white
                          flex
                          items-center
                          justify-center
                          gap-3
                          font-black
                        "
                      >

                        <Pencil
                          size={20}
                        />

                        Bearbeiten

                      </Link>

                      <button
                        onClick={() =>
                          deleteListing(
                            listing.id
                          )
                        }
                        className="
                          h-14
                          px-6
                          rounded-2xl
                          bg-white
                          border
                          border-red-200
                          text-red-500
                          flex
                          items-center
                          justify-center
                          gap-3
                          font-black
                        "
                      >

                        <Trash2
                          size={20}
                        />

                        Löschen

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )
          )}

          {listings.length === 0 && (

            <div
              className="
                bg-white
                rounded-[40px]
                p-12
                md:p-24
                text-center
                shadow-sm
              "
            >

              <div
                className="
                  w-28
                  h-28
                  rounded-full
                  bg-[#16d64d]
                  text-white
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-8
                "
              >

                <Package
                  size={50}
                />

              </div>

              <h2
                className="
                  text-4xl
                  md:text-6xl
                  font-black
                  mb-6
                "
              >

                Keine Listings

              </h2>

              <p
                className="
                  text-gray-500
                  text-lg
                  md:text-2xl
                  max-w-3xl
                  mx-auto
                "
              >

                Erstelle jetzt dein erstes
                Premium Listing auf
                FlexRent.

              </p>

              <Link
                href="/create"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  mt-10
                  h-16
                  px-8
                  rounded-2xl
                  bg-[#16d64d]
                  text-white
                  text-lg
                  font-black
                "
              >

                <Plus
                  size={22}
                />

                Erstes Listing erstellen

              </Link>

            </div>

          )}

        </div>

      </div>

      <Footer />

    </main>
  );
}