"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {

  Upload,

  MapPin,

  Trash2,

  Sparkles,

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

export default function CreatePage() {

  const router =
    useRouter();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [priceUnit, setPriceUnit] =
    useState("Tag");

  const [location, setLocation] =
    useState("");

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [category, setCategory] =
    useState("");

  const [images, setImages] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (!navigator.geolocation)
      return;

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );
      },

      (error) => {

        console.log(error);
      }

    );

  }, []);

  /* IMAGES */

  const handleImages =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const files =
        Array.from(
          e.target.files || []
        );

      setImages(
        (prev) =>

          [
            ...prev,
            ...files,
          ].slice(0, 10)
      );
    };

  const removeImage =
    (
      index: number
    ) => {

      setImages(
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

          images.map(
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

  /* CREATE */

  const createListing =
    async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

        router.push("/login");

        return;
      }

      if (
        !title ||
        !description ||
        !price ||
        !location ||
        !category
      ) {

        alert(
          "Bitte alle Felder ausfüllen"
        );

        return;
      }

      if (
        images.length === 0
      ) {

        alert(
          "Bitte mindestens ein Bild hochladen"
        );

        return;
      }

      setLoading(true);

      try {

        const imageUrls =
          await uploadImages();

        const { error } =
          await supabase
            .from("listings")
            .insert({

              user_id:
                session.user.id,

              title,

              description,

              price:
                Number(price),

              price_unit:
                priceUnit,

              location,

              latitude,

              longitude,

              category,

              images:
                imageUrls,

              active: true,
            });

        if (error) {

          console.log(error);

          alert(
            error.message
          );

          return;
        }

        router.push(
          "/dashboard"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Fehler beim Erstellen"
        );

      } finally {

        setLoading(false);
      }
    };

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

          <div className="mb-12">

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
                  bg-[#16d64d]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >

                <Sparkles
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
                  Neues Listing
                </h1>

                <p
                  className="
                    text-gray-500
                    text-xl
                    mt-3
                  "
                >
                  Veröffentliche dein Premium Listing
                </p>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="space-y-8">

            {/* TITLE */}

            <div>

              <label
                className="
                  block
                  font-black
                  text-lg
                  mb-3
                "
              >
                Titel
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="BMW M4 Competition"
                disabled={loading}
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
                  block
                  font-black
                  text-lg
                  mb-3
                "
              >
                Beschreibung
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Beschreibe dein Listing..."
                disabled={loading}
                className="
                  w-full
                  h-44
                  rounded-3xl
                  border
                  border-gray-200
                  p-5
                  text-lg
                  outline-none
                  disabled:opacity-50
                "
              />

            </div>

            {/* PRICE */}

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
              "
            >

              <div>

                <label
                  className="
                    block
                    font-black
                    text-lg
                    mb-3
                  "
                >
                  Preis
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  placeholder="250"
                  disabled={loading}
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

              <div>

                <label
                  className="
                    block
                    font-black
                    text-lg
                    mb-3
                  "
                >
                  Einheit
                </label>

                <select
                  value={priceUnit}
                  onChange={(e) =>
                    setPriceUnit(
                      e.target.value
                    )
                  }
                  disabled={loading}
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

                  <option>
                    Stunde
                  </option>

                  <option>
                    Tag
                  </option>

                  <option>
                    Woche
                  </option>

                  <option>
                    Monat
                  </option>

                </select>

              </div>

            </div>

            {/* LOCATION */}

            <div>

              <label
                className="
                  block
                  font-black
                  text-lg
                  mb-3
                "
              >
                Standort
              </label>

              <div className="relative">

                <MapPin
                  size={22}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  placeholder="Berlin"
                  disabled={loading}
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    border
                    border-gray-200
                    pl-14
                    pr-5
                    text-lg
                    outline-none
                    disabled:opacity-50
                  "
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div>

              <label
                className="
                  block
                  font-black
                  text-lg
                  mb-4
                "
              >
                Kategorie
              </label>

              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-4
                  gap-4
                "
              >

                {categories.map(
                  (item) => (

                    <button
                      key={item}
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setCategory(
                          item
                        )
                      }
                      className={`
                        h-16
                        rounded-2xl
                        border
                        font-bold
                        transition
                        disabled:opacity-50
                        ${
                          category === item
                            ? "bg-[#16d64d] text-white border-[#16d64d]"
                            : "border-gray-200 hover:border-[#16d64d]"
                        }
                      `}
                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>

            {/* UPLOAD */}

            <div>

              <label
                className="
                  block
                  font-black
                  text-lg
                  mb-4
                "
              >
                Bilder
              </label>

              <label
                className="
                  border-2
                  border-dashed
                  border-gray-300
                  rounded-[36px]
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
                    w-24
                    h-24
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
                    size={42}
                  />

                </div>

                <h3
                  className="
                    text-4xl
                    font-black
                    mb-3
                  "
                >
                  Bilder hochladen
                </h3>

                <p
                  className="
                    text-gray-500
                    text-xl
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

            {/* PREVIEW */}

            {images.length > 0 && (

              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-4
                  gap-5
                "
              >

                {images.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        relative
                        h-48
                        rounded-3xl
                        overflow-hidden
                      "
                    >

                      <img
                        src={URL.createObjectURL(image)}
                        alt=""
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
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

                    </div>

                  )
                )}

              </div>

            )}

            {/* BUTTON */}

            <button
              onClick={
                createListing
              }
              disabled={loading}
              className="
                w-full
                h-16
                rounded-2xl
                bg-[#16d64d]
                text-white
                text-xl
                font-black
                hover:scale-[1.01]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >

              {loading
                ? "Listing wird erstellt..."
                : "Listing erstellen"}

            </button>

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}