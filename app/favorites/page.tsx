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
  Heart,
  Trash2,
  MapPin,
  Sparkles,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

type FavoriteListing = {

  id: string;

  listing_id: string;

  listings: {

    id: string;

    title: string;

    price: number;

    location: string;

    images: string[];

    category: string;

  } | null;
};

export default function FavoritesPage() {

  const [favorites, setFavorites] =
    useState<
      FavoriteListing[]
    >([]);

  const [loading, setLoading] =
    useState(true);

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
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      window.location.href =
        "/login";

      return;
    }

    await loadFavorites(
      user.id
    );

    return listenFavorites(
      user.id
    );
  }

  async function loadFavorites(
    userId: string
  ) {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("favorites")
          .select(`
            *,
            listings (
              id,
              title,
              price,
              location,
              images,
              category
            )
          `)
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

        setFavorites([]);

        return;
      }

      setFavorites(

        (data || []).filter(
          (favorite) =>
            favorite.listings
        )
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  function listenFavorites(
    userId: string
  ) {

    const channel =
      supabase
        .channel(
          `favorites-${userId}`
        )
        .on(

          "postgres_changes",

          {

            event: "*",

            schema: "public",

            table:
              "favorites",

            filter:
              `user_id=eq.${userId}`,
          },

          () => {

            loadFavorites(
              userId
            );
          }

        );

    channel.subscribe();

    return channel;
  }

  async function removeFavorite(
    favoriteId: string
  ) {

    const confirmed =
      confirm(
        "Favorit entfernen?"
      );

    if (!confirmed)
      return;

    try {

      await supabase
        .from("favorites")
        .delete()
        .eq(
          "id",
          favoriteId
        );

      setFavorites(
        (prev) =>

          prev.filter(
            (favorite) =>

              favorite.id !==
              favoriteId
          )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Fehler beim Entfernen"
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
        Favoriten werden geladen...
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
                bg-red-500
                text-white
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <Heart
                size={38}
                fill="white"
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
                Meine Favoriten
              </h1>

              <p
                className="
                  text-gray-500
                  text-xl
                  mt-3
                "
              >
                {
                  favorites.length
                } gespeicherte Listings
              </p>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {favorites.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[40px]
              p-20
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-28
                h-28
                rounded-full
                bg-red-500
                text-white
                flex
                items-center
                justify-center
                mx-auto
                mb-10
              "
            >

              <Heart
                size={50}
                fill="white"
              />

            </div>

            <h2
              className="
                text-5xl
                font-black
                mb-5
              "
            >
              Keine Favoriten
            </h2>

            <p
              className="
                text-gray-500
                text-2xl
                max-w-2xl
                mx-auto
                leading-10
              "
            >
              Speichere Listings mit dem Herzsymbol,
              um sie später schnell wiederzufinden.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {favorites.map(
              (favorite) => {

                const listing =
                  favorite.listings;

                if (!listing)
                  return null;

                return (

                  <div
                    key={favorite.id}
                    className="
                      bg-white
                      rounded-[36px]
                      overflow-hidden
                      shadow-sm
                      hover:shadow-2xl
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      group
                    "
                  >

                    <Link
                      href={`/listing/${listing.id}`}
                    >

                      <div
                        className="
                          relative
                          h-80
                          overflow-hidden
                        "
                      >

                        <Image
                          src={
                            listing.images?.[0] ||
                            "https://placehold.co/1200x900/png"
                          }
                          alt={
                            listing.title
                          }
                          fill
                          className="
                            object-cover
                            group-hover:scale-105
                            transition
                            duration-500
                          "
                        />

                        <div
                          className="
                            absolute
                            top-5
                            left-5
                            px-4
                            py-2
                            rounded-full
                            bg-black/70
                            text-white
                            text-sm
                            font-bold
                            backdrop-blur
                          "
                        >

                          {
                            listing.category ||
                            "Listing"
                          }

                        </div>

                        <div
                          className="
                            absolute
                            top-5
                            right-5
                            w-14
                            h-14
                            rounded-full
                            bg-white/90
                            backdrop-blur
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <Heart
                            size={24}
                            fill="red"
                            color="red"
                          />

                        </div>

                      </div>

                    </Link>

                    <div className="p-7">

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

                          <h2
                            className="
                              text-3xl
                              font-black
                              mb-3
                              line-clamp-1
                            "
                          >
                            {
                              listing.title
                            }
                          </h2>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-gray-500
                            "
                          >

                            <MapPin
                              size={18}
                            />

                            {
                              listing.location ||
                              "Unbekannt"
                            }

                          </div>

                        </div>

                        <button
                          onClick={() =>
                            removeFavorite(
                              favorite.id
                            )
                          }
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-red-500
                            text-white
                            flex
                            items-center
                            justify-center
                            hover:scale-110
                            transition
                          "
                        >

                          <Trash2
                            size={22}
                          />

                        </button>

                      </div>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div>

                          <p className="text-gray-500 mb-1">
                            Preis
                          </p>

                          <h3
                            className="
                              text-5xl
                              font-black
                            "
                          >
                            €
                            {
                              listing.price
                            }
                          </h3>

                        </div>

                        <Link
                          href={`/listing/${listing.id}`}
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
                            font-bold
                          "
                        >

                          <Sparkles
                            size={18}
                          />

                          Öffnen

                        </Link>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}