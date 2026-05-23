"use client";

import React, {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

type Props = {

  user: any;

  onClose: () => void;
};

export default function MyListingsModal({

  user,

  onClose,
}: Props) {

  const [listings, setListings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadListings();

  }, []);

  async function loadListings() {

    setLoading(true);

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "user_id",
          user?.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {

      setListings(data);
    }

    setLoading(false);
  }

  async function deleteListing(
    listingId: string
  ) {

    const confirmed =
      confirm(
        "Anzeige wirklich löschen?"
      );

    if (!confirmed) return;

    await supabase
      .from("listings")
      .delete()
      .eq(
        "id",
        listingId
      );

    toast.success(
      "Anzeige gelöscht"
    );

    loadListings();
  }

  async function toggleActive(
    listing: any
  ) {

    await supabase
      .from("listings")
      .update({
        active:
          !listing.active,
      })
      .eq(
        "id",
        listing.id
      );

    loadListings();
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-5xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">

          <h2 className="text-4xl font-black">

            Meine Anzeigen

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

          ) : listings.length === 0 ? (

            <div className="text-center py-20">

              <h3 className="text-3xl font-black mb-4">

                Keine Anzeigen

              </h3>

              <p className="text-gray-500">

                Erstelle deine erste Anzeige.

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {listings.map(
                (listing) => (

                <div
                  key={listing.id}
                  className="border rounded-3xl overflow-hidden"
                >

                  <img
                    src={
                      listing.images?.[0] ||
                      listing.image ||
                      "https://via.placeholder.com/500"
                    }
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5">

                    <h3 className="text-2xl font-bold mb-2">

                      {listing.title}

                    </h3>

                    <p className="text-gray-500 mb-4">

                      {listing.location}

                    </p>

                    <p className="text-3xl font-black text-green-600 mb-5">

                      € {listing.price}

                    </p>

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          toggleActive(
                            listing
                          )
                        }
                        className={`flex-1 py-4 rounded-2xl font-bold ${
                          listing.active
                            ? "bg-yellow-400"
                            : "bg-green-500 text-white"
                        }`}
                      >

                        {listing.active
                          ? "Deaktivieren"
                          : "Aktivieren"}

                      </button>

                      <button
                        onClick={() =>
                          deleteListing(
                            listing.id
                          )
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold"
                      >

                        Löschen

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}