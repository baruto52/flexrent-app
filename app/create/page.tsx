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

import imageCompression
from "browser-image-compression";

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

  /*
    OPTIMIZED IMAGE UPLOAD
  */

  const uploadImages =
    async () => {

      const uploaded:
        string[] = [];

      const uploads =
        await Promise.all(

          images.map(
            async (image) => {

              try {

                /*
                  COMPRESS IMAGE
                */

                const compressedFile =
                  await imageCompression(
                    image,
                    {

                      maxSizeMB: 1,

                      maxWidthOrHeight: 1600,

                      useWebWorker: true,
                    }
                  );

                /*
                  FILE NAME
                */

                const fileName =
                  `${Date.now()}-${Math.random()}-${image.name}`;

                /*
                  UPLOAD
                */

                const { error } =
                  await supabase.storage
                    .from(
                      "listing-images"
                    )
                    .upload(
                      fileName,
                      compressedFile
                    );

                if (error) {

                  console.log(error);

                  return null;
                }

                /*
                  PUBLIC URL
                */

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

              } catch (error) {

                console.log(error);

                return null;
              }
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

        /*
          AI MODERATION
        */

        const moderationRes =
          await fetch(
            "/api/ai/moderate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                title,
                description,
              }),
            }
          );

        const moderationData =
          await moderationRes.json();

        /*
          HIGH RISK
        */

        if (
          moderationData
            ?.moderation?.risk ===
          "high"
        ) {

          alert(
            "Dieses Listing wurde aus Sicherheitsgründen blockiert."
          );

          setLoading(false);

          return;
        }

        /*
          MEDIUM RISK
        */

        if (
          moderationData
            ?.moderation?.risk ===
          "medium"
        ) {

          const confirmed =
            confirm(
              "Dieses Listing wirkt möglicherweise verdächtig. Trotzdem veröffentlichen?"
            );

          if (!confirmed) {

            setLoading(false);

            return;
          }
        }

        /*
          IMAGE UPLOAD
        */

        const imageUrls =
          await uploadImages();

        /*
          SAVE LISTING
        */

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

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="space-y-10">

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Titel"
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-gray-200
                px-5
              "
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Beschreibung"
              className="
                w-full
                h-48
                rounded-3xl
                border
                border-gray-200
                p-5
              "
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
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-gray-200
                px-5
              "
            />

            <LocationPicker
              location={location}
              setLocation={setLocation}
              setLat={setLat}
              setLng={setLng}
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-gray-200
                px-5
              "
            >

              {categories.map(
                (category) => (

                  <option
                    key={category}
                  >

                    {category}

                  </option>

                )
              )}

            </select>

            {/* IMAGE UPLOAD */}

            <label
              className="
                border-2
                border-dashed
                border-gray-300
                rounded-[40px]
                p-10
                flex
                flex-col
                items-center
                justify-center
                cursor-pointer
              "
            >

              <Upload
                size={50}
              />

              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImages}
              />

            </label>

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