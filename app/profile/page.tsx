"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileStats from "@/components/ProfileStats";

import {
  Camera,
  MapPin,
  User,
  FileText,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function ProfilePage() {

  const [userId, setUserId] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [avatar, setAvatar] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [listingsCount, setListingsCount] =
    useState(0);

  const [favoritesCount, setFavoritesCount] =
    useState(0);

  const [bookingsCount, setBookingsCount] =
    useState(0);

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile =
    async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

        window.location.href =
          "/login";

        return;
      }

      const currentUserId =
        session.user.id;

      setUserId(
        currentUserId
      );

      const [

        profileRes,

        listingsRes,

        favoritesRes,

        bookingsRes,

      ] =
        await Promise.all([

          supabase
            .from("profiles")
            .select("*")
            .eq(
              "id",
              currentUserId
            )
            .maybeSingle(),

          supabase
            .from("listings")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "user_id",
              currentUserId
            ),

          supabase
            .from("favorites")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "user_id",
              currentUserId
            ),

          supabase
            .from("bookings")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "renter_id",
              currentUserId
            ),
        ]);

      if (profileRes.data) {

        setFullName(
          profileRes.data.full_name || ""
        );

        setBio(
          profileRes.data.bio || ""
        );

        setLocation(
          profileRes.data.location || ""
        );

        setAvatar(
          profileRes.data.avatar_url || ""
        );
      }

      setListingsCount(
        listingsRes.count || 0
      );

      setFavoritesCount(
        favoritesRes.count || 0
      );

      setBookingsCount(
        bookingsRes.count || 0
      );

      setLoading(false);
    };

  const uploadAvatar =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      try {

        const file =
          e.target.files?.[0];

        if (!file)
          return;

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          alert(
            "Nur Bilder erlaubt"
          );

          return;
        }

        if (
          file.size >
          5 * 1024 * 1024
        ) {

          alert(
            "Maximal 5MB erlaubt"
          );

          return;
        }

        setUploading(true);

        const fileExt =
          file.name
            .split(".")
            .pop();

        const fileName =
          `${userId}-${Date.now()}.${fileExt}`;

        const {
          error: uploadError,
        } =
          await supabase.storage
            .from("avatars")
            .upload(
              fileName,
              file
            );

        if (uploadError) {

          alert(
            uploadError.message
          );

          return;
        }

        const {
          data: publicUrlData,
        } =
          supabase.storage
            .from("avatars")
            .getPublicUrl(
              fileName
            );

        const avatarUrl =
          publicUrlData.publicUrl;

        setAvatar(
          avatarUrl
        );

        await supabase
          .from("profiles")
          .upsert({

            id: userId,

            full_name:
              fullName,

            bio,

            location,

            avatar_url:
              avatarUrl,
          });

      } catch (error) {

        console.log(error);

      } finally {

        setUploading(false);
      }
    };

  const saveProfile =
    async () => {

      setSaving(true);

      try {

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {

          alert("Nicht eingeloggt");

          return;
        }

        const { error } =
          await supabase
            .from("profiles")
            .upsert({

              id: session.user.id,

              full_name:
                fullName,

              bio,

              location,

              avatar_url:
                avatar,
            });

        if (error) {

          console.log(error);

          alert(error.message);

          return;
        }

        alert(
          "Profil gespeichert"
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
        Profil wird geladen...
      </div>

    );
  }

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">

        <div
          className="
            bg-white
            rounded-[40px]
            p-10
            shadow-sm
            mb-10
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              items-center
              gap-10
            "
          >

            <div
              className="
                relative
                w-44
                h-44
                flex-shrink-0
              "
            >

              <div
                className="
                  w-full
                  h-full
                  rounded-full
                  overflow-hidden
                  border-4
                  border-[#16d64d]
                  bg-gray-100
                "
              >

                <img
                  src={
                    avatar ||
                    "https://placehold.co/400x400/png"
                  }
                  alt="Avatar"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>

              <label
                className="
                  absolute
                  bottom-3
                  right-3
                  w-14
                  h-14
                  rounded-full
                  bg-[#16d64d]
                  text-white
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  shadow-lg
                "
              >

                <Camera
                  size={24}
                />

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={
                    uploadAvatar
                  }
                />

              </label>

            </div>

            <div className="flex-1">

              <h1
                className="
                  text-5xl
                  font-black
                  mb-5
                "
              >
                {
                  fullName ||
                  "Dein Name"
                }
              </h1>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-500
                  text-lg
                  mb-5
                "
              >

                <MapPin
                  size={20}
                />

                {
                  location ||
                  "Kein Standort"
                }

              </div>

              <p
                className="
                  text-gray-600
                  text-lg
                  leading-9
                  max-w-3xl
                "
              >

                {bio ||

                  "Keine Beschreibung vorhanden."}

              </p>

            </div>

          </div>

        </div>

        <ProfileStats

          listingsCount={
            listingsCount
          }

          favoritesCount={
            favoritesCount
          }

          bookingsCount={
            bookingsCount
          }

        />

        <div
          className="
            bg-white
            rounded-[40px]
            p-10
            shadow-sm
          "
        >

          <div className="space-y-8">

            <div>

              <label
                className="
                  font-black
                  text-lg
                  mb-3
                  block
                "
              >
                Vollständiger Name
              </label>

              <div className="relative">

                <User
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
                  value={fullName}
                  disabled={
                    saving ||
                    uploading
                  }
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  placeholder="Max Mustermann"
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
                  disabled={
                    saving ||
                    uploading
                  }
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  placeholder="Berlin"
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

              <div className="relative">

                <FileText
                  size={22}
                  className="
                    absolute
                    left-5
                    top-7
                    text-gray-400
                  "
                />

                <textarea
                  value={bio}
                  disabled={
                    saving ||
                    uploading
                  }
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                  placeholder="Erzähle etwas über dich..."
                  className="
                    w-full
                    h-44
                    rounded-2xl
                    border
                    border-gray-200
                    pl-14
                    pr-5
                    py-5
                    text-lg
                    outline-none
                    disabled:opacity-50
                  "
                />

              </div>

            </div>

            <button
              onClick={
                saveProfile
              }
              disabled={
                saving ||
                uploading
              }
              className="
                w-full
                h-16
                rounded-2xl
                bg-[#16d64d]
                text-white
                font-black
                text-xl
                hover:scale-[1.01]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >

              {saving

                ? "Speichern..."

                : uploading

                ? "Bild wird hochgeladen..."

                : "Profil speichern"}

            </button>

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}