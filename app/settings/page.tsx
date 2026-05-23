"use client";

import { useEffect, useState } from "react";

import {
  Upload,
  Save,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function SettingsPage() {

  const [user, setUser] =
    useState<any>(null);

  const [fullName, setFullName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [avatar, setAvatar] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile = async () => {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      window.location.href =
        "/login";

      return;
    }

    setUser(user);

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (data) {

      setFullName(
        data.full_name || ""
      );

      setBio(
        data.bio || ""
      );

      setLocation(
        data.location || ""
      );

      setAvatarPreview(
        data.avatar_url || ""
      );
    }

    setLoading(false);
  };

  /* AVATAR */

  const handleAvatar = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    setAvatar(file);

    setAvatarPreview(
      URL.createObjectURL(file)
    );
  };

  /* SAVE */

  const saveProfile =
    async () => {

      if (!user) return;

      setSaving(true);

      let avatarUrl =
        avatarPreview;

      /* UPLOAD */

      if (avatar) {

        const fileName =
          `${Date.now()}-${avatar.name}`;

        await supabase.storage
          .from("avatars")
          .upload(
            fileName,
            avatar
          );

        const {
          data: publicUrl,
        } =
          supabase.storage
            .from("avatars")
            .getPublicUrl(
              fileName
            );

        avatarUrl =
          publicUrl.publicUrl;
      }

      /* UPDATE */

      const { error } =
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,

            email:
              user.email,

            full_name:
              fullName,

            bio,

            location,

            avatar_url:
              avatarUrl,
          });

      if (error) {

        console.log(error);

        alert(error.message);

        setSaving(false);

        return;
      }

      alert(
        "Profil gespeichert"
      );

      setSaving(false);
    };

  if (loading) {

    return (
      <div className="p-10 text-2xl">
        Lade Einstellungen...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-6 py-10">

      <div className="max-w-4xl mx-auto">

        {/* CARD */}

        <div
          className="
            bg-white
            rounded-[50px]
            shadow-xl
            p-10
          "
        >

          {/* HEADER */}

          <div className="mb-12">

            <h1
              className="
                text-6xl
                font-black
                tracking-[-3px]
              "
            >
              Einstellungen
            </h1>

            <p
              className="
                text-gray-500
                text-xl
                mt-4
              "
            >
              Bearbeite dein
              Profil.
            </p>

          </div>

          {/* AVATAR */}

          <div className="mb-10">

            <label className="font-bold text-lg">
              Profilbild
            </label>

            <div className="mt-5 flex items-center gap-6">

              {/* IMAGE */}

              {avatarPreview ? (

                <img
                  src={avatarPreview}
                  alt=""
                  className="
                    w-32
                    h-32
                    rounded-full
                    object-cover
                  "
                />

              ) : (

                <div
                  className="
                    w-32
                    h-32
                    rounded-full
                    bg-[#00e01a]
                    flex
                    items-center
                    justify-center
                    text-5xl
                    font-black
                  "
                >
                  {user.email?.[0]?.toUpperCase()}
                </div>

              )}

              {/* BUTTON */}

              <label
                className="
                  h-14
                  px-6
                  rounded-2xl
                  bg-black
                  text-white
                  font-bold
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                "
              >

                <Upload size={22} />

                Bild hochladen

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={
                    handleAvatar
                  }
                />

              </label>

            </div>

          </div>

          {/* FORM */}

          <div className="grid gap-7">

            {/* NAME */}

            <div>

              <label className="font-bold">
                Vollständiger Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="Max Mustermann"
                className="
                  w-full
                  mt-3
                  h-16
                  px-6
                  rounded-2xl
                  bg-gray-100
                "
              />

            </div>

            {/* BIO */}

            <div>

              <label className="font-bold">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(
                    e.target.value
                  )
                }
                placeholder="Erzähle etwas über dich..."
                className="
                  w-full
                  mt-3
                  h-40
                  p-6
                  rounded-2xl
                  bg-gray-100
                "
              />

            </div>

            {/* LOCATION */}

            <div>

              <label className="font-bold">
                Standort
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                placeholder="Berlin"
                className="
                  w-full
                  mt-3
                  h-16
                  px-6
                  rounded-2xl
                  bg-gray-100
                "
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={saveProfile}
            disabled={saving}
            className="
              w-full
              h-16
              rounded-2xl
              bg-[#00e01a]
              text-black
              font-black
              text-lg
              mt-10
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <Save size={24} />

            {saving
              ? "Speichern..."
              : "Profil speichern"}

          </button>

        </div>

      </div>

    </main>
  );
}