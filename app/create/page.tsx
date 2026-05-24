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
import LocationPicker from "@/components/LocationPicker";

import {
  Upload,
  Trash2,
  Sparkles,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

const categories = [

  "Alle",

  "Werkzeuge",

  "Parkplätze",

  "Garagen",

  "Keller",

  "Lagerräume",

  "Transporter",

  "Anhänger",

  "Maschinen",

  "Fahrzeuge",

  "Baumaschinen",

  "Elektronik",

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

  const [lat, setLat] =
    useState(52.52);

  const [lng, setLng] =
    useState(13.405);

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

        setLat(
          position.coords.latitude
        );

        setLng(
          position.coords.longitude
        );
      },

      (error) => {

        console.log(error);
      }

    );

  }, []);

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

              latitude: lat,

              longitude: lng,

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

    <main
      className="
        min-h-screen
        bg-[#f5f7fb]
      "
    >

      <Navbar />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-8
          py-10
        "
      >

        <div
          className="
            bg-white
            rounded-[42px]
            p-5
            md:p-10
            shadow-sm
            border
            border-gray-100
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
                    text-4xl
                    md:text-6xl
                    font-black
                    leading-none
                  "
                >

                  Neues Listing

                </h1>

                <p
                  className="
                    text-gray-500
                    text-lg
                    md:text-xl
                    mt-3
                  "
                >

                  Vermiete Werkzeuge,
                  Keller, Garagen,
                  Parkplätze & mehr.

                </p>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="space-y-10">

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
                placeholder="Makita Bohrmaschine"
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
                  h-48
                  rounded-3xl
                  border
                  border-gray-200
                  p-5
                  text-lg
                  outline-none
                  resize-none
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
                  placeholder="25"
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
                  mb-4
                "
              >

                Standort

              </label>

              <LocationPicker
                location={location}
                setLocation={setLocation}
                setLat={setLat}
                setLng={setLng}
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label
                className="
                  block
                  font-black
                  text-lg
                  mb-5
                "
              >

                Kategorie

              </label>

              <div
                className="
                  flex
                  gap-5
                  overflow-x-auto
                  scrollbar-hide
                  pb-4
                "
              >

                {categories.map(
                  (item) => {

                    const active =
                      category === item;

                    return (

                      <button
                        key={item}
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          setCategory(item)
                        }
                        className={`
                          min-w-[160px]
                          h-[160px]
                          rounded-[36px]
                          border
                          transition-all
                          duration-300
                          flex
                          flex-col
                          items-center
                          justify-center
                          gap-5
                          shadow-sm
                          hover:-translate-y-1
                          hover:shadow-xl
                          ${
                            active
                              ? "bg-[#16d64d] text-white border-[#16d64d]"
                              : "bg-white border-gray-100"
                          }
                        `}
                      >

                        <div
                          className={`
                            w-20
                            h-20
                            rounded-[26px]
                            flex
                            items-center
                            justify-center
                            text-3xl
                            ${
                              active
                                ? "bg-white/20"
                                : "bg-[#16d64d]/10"
                            }
                          `}
                        >

                          {item === "Alle" && "📦"}
                          {item === "Werkzeuge" && "🛠️"}
                          {item === "Parkplätze" && "🅿️"}
                          {item === "Garagen" && "🚗"}
                          {item === "Keller" && "📦"}
                          {item === "Lagerräume" && "🏢"}
                          {item === "Transporter" && "🚚"}
                          {item === "Anhänger" && "🛻"}
                          {item === "Maschinen" && "⚙️"}
                          {item === "Fahrzeuge" && "🚘"}
                          {item === "Baumaschinen" && "🏗️"}
                          {item === "Elektronik" && "💻"}
                          {item === "Sonstiges" && "✨"}

                        </div>

                        <span
                          className="
                            font-black
                            text-base
                            text-center
                            px-2
                            whitespace-nowrap
                          "
                        >

                          {item}

                        </span>

                      </button>

                    );
                  }
                )}

              </div>

            </div>

            {/* IMAGE UPLOAD */}

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
                  rounded-[40px]
                  p-10
                  md:p-16
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
                    text-3xl
                    md:text-4xl
                    font-black
                    mb-3
                  "
                >

                  Bilder hochladen

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
                  onChange={handleImages}
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
                        h-44
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
                          removeImage(index)
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
              onClick={createListing}
              disabled={loading}
              className="
                w-full
                h-20
                rounded-[30px]
                bg-[#16d64d]
                text-white
                text-2xl
                font-black
                hover:scale-[1.01]
                transition-all
              "
            >

              {loading
                ? "Listing wird erstellt..."
                : "Anzeige veröffentlichen"}

            </button>

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}