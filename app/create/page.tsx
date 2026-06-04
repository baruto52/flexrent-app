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

  ShieldAlert,

  Clock3,

} from "lucide-react";

import imageCompression
from "browser-image-compression";

import toast
from "react-hot-toast";

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

const rentalUnits = [

  "hour",

  "day",

  "week",
];

export default function CreatePage() {

  const router =
    useRouter();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [

    descriptionLoading,

    setDescriptionLoading,

  ] = useState(false);

  const [price, setPrice] =
    useState("");

  /*
    RENTAL TYPE
  */

  const [
    rentalType,
    setRentalType,
  ] = useState("day");

  const [location, setLocation] =
    useState("");

  const [lat, setLat] =
    useState(52.52);

  const [lng, setLng] =
    useState(13.405);

  const [category, setCategory] =
    useState("");

  const [

    categoryLoading,

    setCategoryLoading,

  ] = useState(false);

  const [images, setImages] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  /*
    AI
  */

  const [
    aiRisk,
    setAiRisk,
  ] = useState("");

  const [
    aiReason,
    setAiReason,
  ] = useState("");

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

  /*
    CATEGORY AI
  */

  async function detectCategory(
    value: string
  ) {

    if (!value) return;

    try {

      setCategoryLoading(true);

      const res =
        await fetch(
          "/api/ai/category",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title: value,
            }),
          }
        );

      const data =
        await res.json();

      if (
        data?.category
      ) {

        setCategory(
          data.category
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setCategoryLoading(false);
    }
  }

  /*
    DESCRIPTION AI
  */

  async function generateDescription() {

    if (
      !title ||
      !category
    )
      return;

    try {

      setDescriptionLoading(true);

      const res =
        await fetch(
          "/api/ai/generate-description",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              title,

              category,
            }),
          }
        );

      const data =
        await res.json();

      if (
        data?.description
      ) {

        setDescription(
          data.description
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setDescriptionLoading(false);
    }
  }

  /*
    IMAGES
  */

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
    IMAGE UPLOAD
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

                const compressedFile =
                  await imageCompression(
                    image,
                    {

                      maxSizeMB: 1,

                      maxWidthOrHeight: 1600,

                      useWebWorker: true,
                    }
                  );

                const fileName =
                  `${Date.now()}-${Math.random()}-${image.name}`;

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

  /*
    CREATE LISTING
  */

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

      /*
        VALIDATION
      */

      if (

        !title ||

        !description ||

        !price ||

        !location ||

        !category
      ) {

        toast.error(
          "Bitte alle Felder ausfüllen"
        );

        return;
      }

      /*
        PRICE LIMITS
      */

      if (

        Number(price) <= 0 ||

        Number(price) > 100000
      ) {

        toast.error(
          "Ungültiger Preis"
        );

        return;
      }

      /*
        IMAGES
      */

      if (
        images.length === 0
      ) {

        toast.error(
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

                price,
              }),
            }
          );

        const moderationData =
          await moderationRes.json();

        /*
          AI STATUS
        */

        setAiRisk(
          moderationData
            ?.moderation?.risk || ""
        );

        setAiReason(
          moderationData
            ?.moderation?.reason || ""
        );

        /*
          BLOCK HIGH RISK
        */

        if (

          moderationData
            ?.moderation?.risk ===
          "high"
        ) {

          toast.error(
            "Listing wurde blockiert"
          );

          setLoading(false);

          return;
        }

        /*
          WARNING
        */

        if (

          moderationData
            ?.moderation?.risk ===
          "medium"
        ) {

          const confirmed =
            confirm(

              "Dieses Listing wirkt verdächtig. Trotzdem veröffentlichen?"
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
          TRUST SCORE
        */

        const trustRes =
          await fetch(
            "/api/ai/trust-score",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                title,

                description,

                imageCount:
                  imageUrls.length,
              }),
            }
          );

        const trustData =
          await trustRes.json();

        const trust =
          trustData?.trust;

        const aiVerified =
          (trust?.score || 0) >= 80;

        /*
          INSERT
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
  rentalType,

rental_type:
  rentalType,

location,

              latitude:
                lat,

              longitude:
                lng,

              category,

              images:
                imageUrls,

              active: true,

              /*
                AI
              */

              trust_score:
                trust?.score || 0,

              trust_label:
                trust?.label || "",

              trust_reason:
                trust?.reason || "",

              ai_verified:
                aiVerified,

              flagged:

                moderationData
                  ?.moderation?.risk ===
                "medium",

              risk_score:

                moderationData
                  ?.moderation?.score || 0,
            });

        if (error) {

          console.log(error);

          toast.error(
            error.message
          );

          return;
        }

        toast.success(
          "Listing erstellt"
        );

        router.push(
          "/dashboard"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Fehler beim Erstellen"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        <div className="bg-white rounded-[42px] p-5 md:p-10 shadow-sm border border-gray-100">

          {/* HEADER */}

          <div className="mb-12">

            <div className="flex items-center gap-5 mb-5">

              <div className="w-20 h-20 rounded-[28px] bg-[#16d64d] text-white flex items-center justify-center shadow-lg">

                <Sparkles size={38} />

              </div>

              <div>

                <h1 className="text-4xl md:text-6xl font-black leading-none">

                  Neues Listing

                </h1>

                <p className="text-gray-500 text-lg mt-3">

                  AI-gesicherte Marketplace Anzeige

                </p>

              </div>

            </div>

          </div>

          <div className="space-y-10">

            {/* TITLE */}

            <div className="space-y-3">

              <input
                type="text"
                value={title}
                onChange={(e) => {

                  setTitle(
                    e.target.value
                  );

                  detectCategory(
                    e.target.value
                  );
                }}
                placeholder="Titel"
                className="w-full h-16 rounded-2xl border border-gray-200 px-5"
              />

              {categoryLoading && (

                <p className="text-sm text-gray-500 px-2">

                  AI erkennt Kategorie...

                </p>

              )}

            </div>

            {/* DESCRIPTION */}

            <div className="space-y-4">

              <div className="flex items-center justify-between gap-4">

                <h2 className="text-lg font-black">

                  Beschreibung

                </h2>

                <button
                  type="button"
                  onClick={
                    generateDescription
                  }
                  disabled={
                    descriptionLoading
                  }
                  className="h-11 px-5 rounded-2xl bg-[#16d64d] text-white text-sm font-black"
                >

                  {descriptionLoading

                    ? "AI generiert..."

                    : "AI Beschreibung"}

                </button>

              </div>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Beschreibung"
                className="w-full h-48 rounded-3xl border border-gray-200 p-5"
              />

            </div>

            {/* PRICE */}

            <div className="grid md:grid-cols-2 gap-5">

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                placeholder="Preis"
                className="w-full h-16 rounded-2xl border border-gray-200 px-5"
              />

              <select
                value={rentalType}
                onChange={(e) =>
                  setRentalType(
                    e.target.value
                  )
                }
                className="w-full h-16 rounded-2xl border border-gray-200 px-5"
              >

                {rentalUnits.map(
                  (unit) => (

                    <option
                      key={unit}
                      value={unit}
                    >

                      {unit === "hour"

                        ? "Pro Stunde"

                        : unit === "week"

                        ? "Pro Woche"

                        : "Pro Tag"}

                    </option>

                  )
                )}

              </select>

            </div>

            {/* LOCATION */}

            <LocationPicker
              location={location}
              setLocation={setLocation}
              setLat={setLat}
              setLng={setLng}
            />

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full h-16 rounded-2xl border border-gray-200 px-5"
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

            {/* UPLOAD */}

            <label className="border-2 border-dashed border-gray-300 rounded-[40px] p-10 flex flex-col items-center justify-center cursor-pointer">

              <Upload size={50} />

              <p className="mt-5 font-bold">

                Bilder hochladen

              </p>

              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImages}
              />

            </label>

            {/* IMAGES */}

            {images.length > 0 && (

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                {images.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      key={index}
                      className="relative h-44 rounded-3xl overflow-hidden"
                    >

                      <img
                        src={URL.createObjectURL(image)}
                        alt=""
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

            {/* AI WARNING */}

            {aiRisk && (

              <div
                className={`
                  rounded-[32px]
                  p-6
                  border

                  ${aiRisk === "high"

                    ? "bg-red-500/10 border-red-500/20"

                    : aiRisk === "medium"

                    ? "bg-yellow-500/10 border-yellow-500/20"

                    : "bg-[#16d64d]/10 border-[#16d64d]/20"
                  }
                `}
              >

                <div className="flex items-start gap-4">

                  <ShieldAlert
                    className={`

                      ${aiRisk === "high"

                        ? "text-red-500"

                        : aiRisk === "medium"

                        ? "text-yellow-500"

                        : "text-[#16d64d]"
                      }
                    `}
                    size={32}
                  />

                  <div>

                    <h3 className="text-2xl font-black mb-2">

                      AI Sicherheitsprüfung

                    </h3>

                    <p className="text-gray-700 leading-7">

                      {aiReason || "Keine Risiken erkannt"}
                    </p>

                  </div>

                </div>

              </div>

            )}

            {/* SUBMIT */}

            <button
              onClick={createListing}
              disabled={loading}
              className="w-full h-20 rounded-[30px] bg-[#16d64d] text-white text-2xl font-black flex items-center justify-center gap-4"
            >

              <Clock3 size={28} />

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