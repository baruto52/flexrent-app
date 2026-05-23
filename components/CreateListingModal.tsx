"use client";

import React, {
  useState,
} from "react";

import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

type Props = {

  user: any;

  onClose: () => void;

  onCreated: () => void;
};

export default function CreateListingModal({

  user,

  onClose,

  onCreated,
}: Props) {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [category, setCategory] =
    useState("Werkzeuge");

  const [loading, setLoading] =
    useState(false);

  async function createListing() {

    if (
      !title ||
      !price
    ) {

      toast.error(
        "Bitte Felder ausfüllen"
      );

      return;
    }

    setLoading(true);

    const { error } =
      await supabase
        .from("listings")
        .insert({

          title,

          description,

          price:
            Number(price),

          location,

          category,

          user_id:
            user?.id,

          active: true,
        });

    setLoading(false);

    if (error) {

      toast.error(
        "Fehler beim Erstellen"
      );

      return;
    }

    toast.success(
      "Anzeige erstellt"
    );

    onCreated();
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-2xl w-full p-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-4xl font-black">

            Anzeige erstellen

          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >

            ×

          </button>

        </div>

        {/* FORM */}

        <div className="space-y-5">

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Titel"
            className="w-full border rounded-2xl px-5 py-4"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Beschreibung"
            className="w-full border rounded-2xl px-5 py-4 h-40"
          />

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            placeholder="Preis"
            className="w-full border rounded-2xl px-5 py-4"
          />

          <input
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            placeholder="Standort"
            className="w-full border rounded-2xl px-5 py-4"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-5 py-4"
          >

            <option>
              Werkzeuge
            </option>

            <option>
              Maschinen
            </option>

            <option>
              Parkplätze
            </option>

            <option>
              Fahrzeuge
            </option>

            <option>
              Immobilien
            </option>

            <option>
              Elektronik
            </option>

            <option>
              Sport
            </option>

            <option>
              Sonstiges
            </option>

          </select>

          <button
            onClick={createListing}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-bold text-lg"
          >

            {loading
              ? "Wird erstellt..."
              : "Anzeige erstellen"}

          </button>

        </div>

      </div>

    </div>

  );
}