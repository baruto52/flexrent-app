"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Props = {

  user: any;

  onClose: () => void;
};

export default function FavoritesModal({

  user,

  onClose,
}: Props) {

  const [favorites, setFavorites] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadFavorites();

  }, []);

  async function loadFavorites() {

    setLoading(true);

    const { data } =
      await supabase
        .from("favorites")
        .select(`
          id,
          listing_id,
          listings (*)
        `)
        .eq(
          "user_id",
          user?.id
        );

    if (data) {

      setFavorites(data);
    }

    setLoading(false);
  }

  async function removeFavorite(
    favoriteId: string
  ) {

    await supabase
      .from("favorites")
      .delete()
      .eq(
        "id",
        favoriteId
      );

    loadFavorites();
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">

          <h2 className="text-4xl font-black">

            Favoriten

          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >

            ×

          </button>

        </div>

        {/* CONTENT */}

        <div className="p-8">

          {loading ? (

            <div className="text-center py-20">

              Lädt...

            </div>

          ) : favorites.length === 0 ? (

            <div className="text-center py-20">

              <h3 className="text-3xl font-black mb-4">

                Keine Favoriten

              </h3>

              <p className="text-gray-500">

                Speichere Anzeigen für später.

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {favorites.map(
                (favorite) => {

                const listing =
                  favorite.listings;

                return (

                  <div
                    key={favorite.id}
                    className="border rounded-3xl overflow-hidden"
                  >

                    <img
                      src={
                        listing?.images?.[0] ||
                        listing?.image ||
                        "https://via.placeholder.com/500"
                      }
                      className="w-full h-56 object-cover"
                    />

                    <div className="p-5">

                      <h3 className="text-2xl font-bold mb-2">

                        {listing?.title}

                      </h3>

                      <p className="text-gray-500 mb-4">

                        {listing?.location}

                      </p>

                      <p className="text-3xl font-black text-green-600 mb-5">

                        € {listing?.price}

                      </p>

                      <button
                        onClick={() =>
                          removeFavorite(
                            favorite.id
                          )
                        }
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold"
                      >

                        Entfernen

                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}