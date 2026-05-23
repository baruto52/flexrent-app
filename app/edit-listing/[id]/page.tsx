"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {

  Save,

  Upload,

  Trash2,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

const categories = [

  "Fahrzeuge",

  "Werkzeuge",

  "Elektronik",

  "Immobilien",

  "Events",

  "Maschinen",

  "Camping",

  "Gaming",

  "Business",

  "Sport",

  "Sonstiges",
];

export default function EditListingPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const listingId =
    typeof params.id === "string"

      ? params.id

      : Array.isArray(params.id)

      ? params.id[0]

      : "";

  const [listing, setListing] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [newImages, setNewImages] =
    useState<File[]>([]);

  useEffect(() => {

    if (!listingId)
      return;

    loadListing();

  }, [listingId]);

  /* LOAD */

  const loadListing =
    async () => {

      setLoading(true);

      const {
        data,
        error,
      } =
        await supabase
          .from("listings")
          .select("*")
          .eq(
            "id",
            listingId
          )
          .single();

      if (error) {

        console.log(error);

        setLoading(false);

        return;
      }

      setListing(data);

      setLoading(false);
    };

  /* IMAGES */

  const handleImages =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const files =
        Array.from(
          e.target.files || []
        );

      setNewImages(
        (prev) =>

          [
            ...prev,
            ...files,
          ].slice(0, 10)
      );
    };

  const removeNewImage =
    (
      index: number
    ) => {

      setNewImages(
        (prev) =>

          prev.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  /* UPLOAD */

  const uploadImages =
    async () => {

      const uploaded:
        string[] = [];

      const uploads =
        await Promise.all(

          newImages.map(
            async (image) => {

              if (
                image.size >
                5 * 1024 * 1024
              ) {

                return null;
              }

              const fileName =
                `${Date.now()}-${Math.random()}-${image.name}`;

              const { error } =
                await supabase.storage
                  .from(
                    "listing-images"
                  )
                  .upload(
                    fileName,
                    image
                  );

              if (error) {

                console.log(error);

                return null;
              }

              const {
                data,
              } =
                supabase.storage
                  .from(
                    "listing-images"
                  )
                  .getPublicUrl(
                    fileName
                  );

              return data.publicUrl;
            }
          )
        );

      uploads.forEach(
        (url) => {

          if (url) {

            uploaded.push(url);
          }
        }
      );

      return uploaded;
    };

  /* SAVE */

  const saveListing =
    async () => {

      if (!listing)
        return;

      setSaving(true);

      try {

        let images =
          listing.images || [];

        if (
          newImages.length > 0
        ) {

          images =
            await uploadImages();
        }

        const { error } =
          await supabase
            .from("listings")
            .update({

              title:
                listing.title,

              description:
                listing.description,

              location:
                listing.location,

              category:
                listing.category,

              price:
                Number(
                  listing.price
                ),

              price_unit:
                listing.price_unit,

              images,
            })
            .eq(
              "id",
              listingId
            );

        if (error) {

          console.log(error);

          alert(
            error.message
          );

          return;
        }

        alert(
          "Listing gespeichert"
        );

        router.push(
          `/listing/${listingId}`
        );

      } catch (error) {

        console.log(error);

        alert(
          "Fehler beim Speichern"
        );

      } finally {

        setSaving(false);
      }
    };

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
        Lade Listing...
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
          text-3xl
          font-black
        "
      >
        Listing nicht gefunden
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div
          className="
            bg-white
            rounded-[40px]
            p-10
            shadow-sm
          "
        >

          {/* HEADER */}

          <div className="mb-10">

            <h1
              className="
                text-5xl
                font-black
                mb-4
              "
            >
              Listing bearbeiten
            </h1>

            <p
              className="
                text-gray-500
                text-xl
              "
            >
              Aktualisiere deine Anzeige.
            </p>

          </div>

          {/* FORM */}

          <div className="space-y-8">

            {/* TITLE */}

            <div>

              <label
                className="
                  font-black
                  text-lg
                  mb-3
                  block
                "
              >
                Titel
              </label>

              <input
                type="text"
                value={
                  listing.title || ""
                }
                disabled={saving}
                onChange={(e) =>
                  setListing({

                    ...listing,

                    title:
                      e.target.value,
                  })
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
                  disabled:opacity-50
                "
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label
                className="
                  font-black
                  text-lg
                  mb-3
                  block
                "
              >
                Beschreibung
              </label>

              <textarea
                value={
                  listing.description || ""
                }
                disabled={saving}
                onChange={(e) =>
                  setListing({

                    ...listing,

                    description:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  h-44
                  rounded-2xl
                  border
                  border-gray-200
                  p-5
                  text-lg
                  outline-none
                  disabled:opacity-50
                "
              />

            </div>

            {/* ROW */}

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
              "
            >

              {/* PRICE */}

              <div>

                <label
                  className="
                    font-black
                    text-lg
                    mb-3
                    block
                  "
                >
                  Preis
                </label>

                <input
                  type="number"
                  value={
                    listing.price || ""
                  }
                  disabled={saving}
                  onChange={(e) =>
                    setListing({

                      ...listing,

                      price:
                        e.target.value,
                    })
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
                    disabled:opacity-50
                  "
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label
                  className="
                    font-black
                    text-lg
                    mb-3
                    block
                  "
                >
                  Kategorie
                </label>

                <select
                  value={
                    listing.category || ""
                  }
                  disabled={saving}
                  onChange={(e) =>
                    setListing({

                      ...listing,

                      category:
                        e.target.value,
                    })
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
                    bg-white
                    disabled:opacity-50
                  "
                >

                  {categories.map(
                    (item) => (

                      <option
                        key={item}
                      >
                        {item}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

            {/* LOCATION */}

            <div>

              <label
                className="
                  font-black
                  text-lg
                  mb-3
                  block
                "
              >
                Standort
              </label>

              <input
                type="text"
                value={
                  listing.location || ""
                }
                disabled={saving}
                onChange={(e) =>
                  setListing({

                    ...listing,

                    location:
                      e.target.value,
                  })
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
                  disabled:opacity-50
                "
              />

            </div>

            {/* IMAGE UPLOAD */}

            <div>

              <label
                className="
                  font-black
                  text-lg
                  mb-4
                  block
                "
              >
                Bilder ersetzen
              </label>

              <label
                className="
                  border-2
                  border-dashed
                  border-gray-300
                  rounded-[32px]
                  p-14
                  flex
                  flex-col
                  items-center
                  justify-center
                  cursor-pointer
                  text-center
                  hover:border-[#16d64d]
                  transition
                "
              >

                <div
                  className="
                    w-20
                    h-20
                    rounded-full
                    bg-[#16d64d]
                    text-white
                    flex
                    items-center
                    justify-center
                    mb-6
                  "
                >

                  <Upload
                    size={38}
                  />

                </div>

                <h3
                  className="
                    text-3xl
                    font-black
                    mb-3
                  "
                >
                  Neue Bilder hochladen
                </h3>

                <p
                  className="
                    text-gray-500
                    text-lg
                  "
                >
                  Maximal 10 Bilder
                </p>

                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={
                    handleImages
                  }
                />

              </label>

            </div>

            {/* IMAGES */}

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-5
              "
            >

              {(newImages.length > 0

                ? newImages.map(
                    (image) =>

                      URL.createObjectURL(
                        image
                      )
                  )

                : listing.images || []

              ).map(
                (
                  image: string,
                  index: number
                ) => (

                  <div
                    key={index}
                    className="
                      relative
                      h-44
                      rounded-3xl
                      overflow-hidden
                    "
                  >

                    <img
                      src={image}
                      alt=""
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                    {newImages.length > 0 && (

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        className="
                          absolute
                          top-3
                          right-3
                          w-10
                          h-10
                          rounded-full
                          bg-red-500
                          text-white
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Trash2
                          size={18}
                        />

                      </button>

                    )}

                  </div>

                )
              )}

            </div>

            {/* SAVE */}

            <button
              onClick={
                saveListing
              }
              disabled={saving}
              className="
                w-full
                h-16
                rounded-2xl
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
                gap-4
                text-xl
                font-black
                hover:scale-[1.01]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >

              <Save
                size={24}
              />

              {saving
                ? "Speichern..."
                : "Änderungen speichern"}

            </button>

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}