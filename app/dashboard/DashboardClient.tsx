"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {

  Plus,

  EyeOff,

  Sparkles,

  Euro,

  Package,

  Activity,

  ArrowUpRight,

  CreditCard,

  Trash2,

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

  async function connectStripe() {

    try {

      window.location.href =
        "/api/stripe/connect";

    } catch (error) {

      console.log(error);
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

    try {

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

    } catch (error) {

      console.log(error);
    }
  }

  async function toggleActive(
    id: string,
    active: boolean
  ) {

    try {

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

    } catch (error) {

      console.log(error);
    }
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

          </div>

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
              "
            />

            <div>

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

          <StatCard
            icon={
              <Package
                size={30}
                className="
                  text-[#16d64d]
                "
              />
            }
            title="Listings"
            value={listings.length}
          />

          <StatCard
            icon={
              <Activity
                size={30}
                className="
                  text-blue-500
                "
              />
            }
            title="Aktiv"
            value={activeListings}
          />

          <StatCard
            icon={
              <EyeOff
                size={30}
                className="
                  text-red-500
                "
              />
            }
            title="Inaktiv"
            value={inactiveListings}
          />

          <StatCard
            icon={
              <Euro
                size={30}
                className="
                  text-yellow-500
                "
              />
            }
            title="Gesamtwert"
            value={`€${totalValue}`}
          />

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

          <button
            onClick={
              connectStripe
            }
            className="
              h-16
              px-8
              rounded-2xl
              bg-purple-600
              text-white
              flex
              items-center
              justify-center
              gap-3
              font-black
              text-lg
              hover:scale-[1.02]
              transition-all
            "
          >

            <CreditCard
              size={22}
            />

            Stripe Connect

          </button>

        </div>

        {/* EMPTY */}

        {listings.length === 0 && (

          <div
            className="
              bg-white
              rounded-[40px]
              p-16
              text-center
              shadow-sm
            "
          >

            <h2
              className="
                text-4xl
                font-black
                mb-5
              "
            >

              Keine Listings gefunden

            </h2>

            <p
              className="
                text-gray-500
                mb-8
              "
            >

              Erstelle jetzt dein erstes Listing.

            </p>

            <Link
              href="/create"
              className="
                inline-flex
                items-center
                justify-center
                h-14
                px-8
                rounded-2xl
                bg-[#16d64d]
                text-white
                font-black
              "
            >

              Listing erstellen

            </Link>

          </div>

        )}

        {/* LISTINGS */}

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
          "
        >

          {listings.map(
            (listing) => (

              <div
                key={listing.id}
                className="
                  bg-white
                  rounded-[36px]
                  overflow-hidden
                  shadow-sm
                  border
                  border-gray-100
                "
              >

                <img
                  src={
                    listing.images?.[0] ||
                    listing.image_url ||
                    "/placeholder.jpg"
                  }
                  className="
                    w-full
                    h-64
                    object-cover
                  "
                />

                <div className="p-6">

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      mb-5
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-2xl
                          font-black
                          mb-2
                        "
                      >

                        {listing.title}

                      </h2>

                      <p
                        className="
                          text-gray-500
                        "
                      >

                        €{listing.price}

                      </p>

                    </div>

                    <div
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-black

                        ${
                          listing.active

                            ? "bg-[#16d64d]/10 text-[#16d64d]"

                            : "bg-red-100 text-red-500"
                        }
                      `}
                    >

                      {
                        listing.active

                          ? "Aktiv"

                          : "Inaktiv"
                      }

                    </div>

                  </div>

                  <div
                    className="
                      flex
                      gap-3
                    "
                  >

                    <button
                      onClick={() =>
                        toggleActive(
                          listing.id,
                          listing.active
                        )
                      }
                      className="
                        flex-1
                        h-14
                        rounded-2xl
                        bg-black
                        text-white
                        font-black
                      "
                    >

                      {
                        listing.active

                          ? "Deaktivieren"

                          : "Aktivieren"
                      }

                    </button>

                    <button
                      onClick={() =>
                        deleteListing(
                          listing.id
                        )
                      }
                      className="
                        min-w-[56px]
                        h-14
                        rounded-2xl
                        bg-red-500
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Trash2
                        size={20}
                      />

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

      <Footer />

    </main>

  );
}

function StatCard({
  icon,
  title,
  value,
}: any) {

  return (

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
          bg-gray-100
          flex
          items-center
          justify-center
          mb-6
        "
      >

        {icon}

      </div>

      <p
        className="
          text-gray-400
          mb-3
        "
      >

        {title}

      </p>

      <h2
        className="
          text-5xl
          font-black
          leading-none
        "
      >

        {value}

      </h2>

    </div>

  );
}