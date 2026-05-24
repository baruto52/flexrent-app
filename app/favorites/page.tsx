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

  Star,

  ShieldCheck,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

type FavoriteListing = {

  id: string;

  listing_id: string;

  listings: {

    id: string;

    title: string;

    description?: string;

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
              description,
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

        <div className="mb-14">

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-end
              md:justify-between
              gap-6
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
                  bg-red-500
                  text-white
                  font-black
                  mb-6
                "
              >

                <Heart
                  size={20}
                  fill="white"
                />

                Gespeicherte Listings

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

                Meine Favoriten

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

                Speichere interessante
                Listings und finde sie
                jederzeit schnell wieder.

              </p>

            </div>

            <div
              className="
                bg-white
                border
                border-gray-100
                rounded-3xl
                px-8
                py-6
                shadow-sm
                min-w-fit
              "
            >

              <p
                className="
                  text-gray-400
                  mb-2
                "
              >

                Gespeichert

              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  leading-none
                "
              >

                {
                  favorites.length
                }

              </h2>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {favorites.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[44px]
              p-10
              md:p-24
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-32
                h-32
                rounded-full
                bg-red-500
                text-white
                flex
                items-center
                justify-center
                mx-auto
                mb-10
                shadow-xl
              "
            >

              <Heart
                size={56}
                fill="white"
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

              Noch keine Favoriten

            </h2>

            <p
              className="
                text-gray-500
                text-lg
                md:text-2xl
                max-w-3xl
                mx-auto
                leading-relaxed
              "
            >

              Speichere Listings mit dem
              Herzsymbol und entdecke
              später schneller passende
              Werkzeuge, Garagen,
              Parkplätze oder Lagerräume.

            </p>

            <Link
              href="/"
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

              <Sparkles
                size={20}
              />

              Listings entdecken

            </Link>

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
                      rounded-[40px]
                      overflow-hidden
                      shadow-sm
                      hover:shadow-2xl
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      border
                      border-gray-100
                      group
                    "
                  >

                    {/* IMAGE */}

                    <Link
                      href={`/listing/${listing.id}`}
                    >

                      <div
                        className="
                          relative
                          h-[320px]
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
                            group-hover:scale-110
                            transition-all
                            duration-700
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/40
                            via-transparent
                            to-transparent
                          "
                        />

                        {/* CATEGORY */}

                        <div
                          className="
                            absolute
                            top-5
                            left-5
                            px-4
                            py-2
                            rounded-full
                            bg-white/90
                            backdrop-blur-md
                            text-black
                            text-sm
                            font-black
                            shadow-lg
                          "
                        >

                          {
                            listing.category ||
                            "Listing"
                          }

                        </div>

                        {/* FAVORITE */}

                        <button
                          onClick={() =>
                            removeFavorite(
                              favorite.id
                            )
                          }
                          className="
                            absolute
                            top-5
                            right-5
                            w-14
                            h-14
                            rounded-full
                            bg-white/90
                            backdrop-blur-md
                            flex
                            items-center
                            justify-center
                            shadow-xl
                            hover:scale-110
                            transition
                          "
                        >

                          <Heart
                            size={24}
                            fill="red"
                            color="red"
                          />

                        </button>

                        {/* PRICE */}

                        <div
                          className="
                            absolute
                            bottom-5
                            left-5
                            bg-white
                            rounded-2xl
                            px-5
                            py-3
                            shadow-2xl
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

                          <h3
                            className="
                              text-3xl
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

                    </Link>

                    {/* CONTENT */}

                    <div className="p-7">

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                          mb-4
                        "
                      >

                        <h2
                          className="
                            text-3xl
                            font-black
                            leading-tight
                            line-clamp-2
                          "
                        >

                          {
                            listing.title
                          }

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
                            size={14}
                            fill="#16d64d"
                          />

                          4.9

                        </div>

                      </div>

                      {/* LOCATION */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-gray-500
                          mb-5
                        "
                      >

                        <MapPin
                          size={18}
                        />

                        <span className="line-clamp-1">

                          {
                            listing.location ||
                            "Standort unbekannt"
                          }

                        </span>

                      </div>

                      {/* DESCRIPTION */}

                      <p
                        className="
                          text-gray-600
                          leading-7
                          line-clamp-2
                          mb-6
                        "
                      >

                        {
                          listing.description ||
                          "Premium Listing auf FlexRent."
                        }

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
                            className="
                              text-[#16d64d]
                            "
                          />

                          Verifiziert

                        </div>

                        <Link
                          href={`/listing/${listing.id}`}
                          className="
                            h-12
                            px-5
                            rounded-2xl
                            bg-[#16d64d]
                            text-white
                            flex
                            items-center
                            justify-center
                            text-sm
                            font-black
                            shadow-lg
                          "
                        >

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