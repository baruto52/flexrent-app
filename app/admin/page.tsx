"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {

  Shield,

  Trash2,

  Users,

  Package,

  BadgeEuro,

  CalendarDays,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function AdminPage() {

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [users, setUsers] =
    useState<any[]>([]);

  const [listings, setListings] =
    useState<any[]>([]);

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [revenue, setRevenue] =
    useState(0);

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

    try {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

        window.location.href =
          "/login";

        return;
      }

      /* ADMIN CHECK */

      const {
        data: profile,
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            session.user.id
          )
          .maybeSingle();

      if (!profile?.is_admin) {

        setLoading(false);

        return;
      }

      setAuthorized(true);

      await Promise.all([

        loadUsers(),

        loadListings(),

        loadBookings(),
      ]);

      return listenRealtime();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  function listenRealtime() {

    const channel =
      supabase
        .channel(
          "admin-realtime"
        )
        .on(

          "postgres_changes",

          {

            event: "*",

            schema: "public",

            table:
              "listings",
          },

          () => {

            loadListings();
          }

        )
        .on(

          "postgres_changes",

          {

            event: "*",

            schema: "public",

            table:
              "bookings",
          },

          () => {

            loadBookings();
          }

        );

    channel.subscribe();

    return channel;
  }

  async function loadUsers() {

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setUsers(
      data || []
    );
  }

  async function loadListings() {

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setListings(
      data || []
    );
  }

  async function loadBookings() {

    const { data } =
      await supabase
        .from("bookings")
        .select("*");

    const bookingsData =
      data || [];

    setBookings(
      bookingsData
    );

    const totalRevenue =
      bookingsData.reduce(

        (
          acc,
          booking
        ) =>

          acc +
          (
            Number(
              booking.total_price
            ) || 0
          ),

        0
      );

    setRevenue(
      totalRevenue
    );
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

    try {

      const { error } =
        await supabase
          .from("listings")
          .delete()
          .eq(
            "id",
            id
          );

      if (error) {

        alert(
          "Fehler beim Löschen"
        );

        return;
      }

      setListings(
        (prev) =>

          prev.filter(
            (listing) =>

              listing.id !== id
          )
      );

    } catch (error) {

      console.log(error);
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
        Admin Panel wird geladen...
      </div>

    );
  }

  if (!authorized) {

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
        Kein Zugriff
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div className="mb-14">

          <div
            className="
              flex
              items-center
              gap-5
              mb-5
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-[28px]
                bg-black
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Shield
                size={38}
              />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  md:text-6xl
                  font-black
                "
              >
                Admin Panel
              </h1>

              <p
                className="
                  text-gray-500
                  text-xl
                  mt-3
                "
              >
                Marketplace Verwaltung
              </p>

            </div>

          </div>

        </div>

        {/* KPI */}

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
            mb-14
          "
        >

          {/* USERS */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-gray-500 mb-2">
                  Nutzer
                </p>

                <h2
                  className="
                    text-5xl
                    font-black
                  "
                >
                  {users.length}
                </h2>

              </div>

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-[#16d64d]
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <Users
                  size={30}
                />

              </div>

            </div>

          </div>

          {/* LISTINGS */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-gray-500 mb-2">
                  Listings
                </p>

                <h2
                  className="
                    text-5xl
                    font-black
                  "
                >
                  {listings.length}
                </h2>

              </div>

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <Package
                  size={30}
                />

              </div>

            </div>

          </div>

          {/* BOOKINGS */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-gray-500 mb-2">
                  Buchungen
                </p>

                <h2
                  className="
                    text-5xl
                    font-black
                  "
                >
                  {bookings.length}
                </h2>

              </div>

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-blue-500
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <CalendarDays
                  size={30}
                />

              </div>

            </div>

          </div>

          {/* REVENUE */}

          <div
            className="
              bg-white
              rounded-[36px]
              p-8
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-gray-500 mb-2">
                  Umsatz
                </p>

                <h2
                  className="
                    text-5xl
                    font-black
                  "
                >
                  €
                  {revenue}
                </h2>

              </div>

              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-yellow-500
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <BadgeEuro
                  size={30}
                />

              </div>

            </div>

          </div>

        </div>

        {/* LISTINGS */}

        <div>

          <h2
            className="
              text-4xl
              font-black
              mb-8
            "
          >
            Alle Listings
          </h2>

          <div className="space-y-8">

            {listings.map(
              (listing) => (

                <div
                  key={listing.id}
                  className="
                    bg-white
                    rounded-[36px]
                    overflow-hidden
                    shadow-sm
                  "
                >

                  <div
                    className="
                      grid
                      lg:grid-cols-4
                    "
                  >

                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        h-[260px]
                      "
                    >

                      <Image
                        src={
                          listing?.images?.[0] ||
                          "https://placehold.co/1200x900/png"
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

                    <div
                      className="
                        lg:col-span-3
                        p-8
                        flex
                        flex-col
                        justify-between
                      "
                    >

                      <div>

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-5
                            mb-5
                          "
                        >

                          <div>

                            <h3
                              className="
                                text-4xl
                                font-black
                                mb-3
                              "
                            >
                              {
                                listing.title
                              }
                            </h3>

                            <p className="text-gray-500">
                              {
                                listing.location ||
                                "Unbekannt"
                              }
                            </p>

                          </div>

                          <h4
                            className="
                              text-5xl
                              font-black
                            "
                          >
                            €
                            {
                              listing.price
                            }
                          </h4>

                        </div>

                        <p
                          className="
                            text-gray-600
                            leading-8
                            line-clamp-3
                          "
                        >
                          {
                            listing.description ||
                            "Keine Beschreibung"
                          }
                        </p>

                      </div>

                      {/* ACTION */}

                      <div className="mt-8">

                        <button
                          onClick={() =>
                            deleteListing(
                              listing.id
                            )
                          }
                          className="
                            h-14
                            px-7
                            rounded-2xl
                            bg-red-500
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-3
                            font-bold
                          "
                        >

                          <Trash2
                            size={20}
                          />

                          Listing löschen

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}