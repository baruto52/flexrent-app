"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {

    const checkUser = async () => {

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        window.location.href = "/";
      }
    };

    checkUser();

  }, []);

  const loginWithGoogle = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  };

  const loginWithApple = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  };

  const loginWithFacebook = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  };

  const login = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/";
  };

  const register = async () => {

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Registrierung erfolgreich");

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-6">

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-[32px]
          p-10
          shadow-xl
        "
      >

        <h1 className="text-5xl font-black mb-3">
          Loqaro
        </h1>

        <h2 className="text-4xl font-black mb-2">
          Willkommen zurück
        </h2>

        <p className="text-gray-500 mb-10">
          Melde dich an oder erstelle einen Account.
        </p>

        <div className="space-y-4">

          <button
            onClick={loginWithGoogle}
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              bg-white
              font-bold
              hover:bg-gray-50
              transition
            "
          >
            Mit Google anmelden
          </button>

          <button
            onClick={loginWithApple}
            className="
              w-full
              h-14
              rounded-2xl
              bg-black
              text-white
              font-bold
            "
          >
            Mit Apple anmelden
          </button>

          <button
            onClick={loginWithFacebook}
            className="
              w-full
              h-14
              rounded-2xl
              bg-blue-600
              text-white
              font-bold
            "
          >
            Mit Facebook anmelden
          </button>

        </div>

        <div className="my-8 text-center text-gray-400">
          ODER
        </div>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              px-5
              outline-none
              focus:border-[#16d64d]
            "
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              px-5
              outline-none
              focus:border-[#16d64d]
            "
          />

          <button
            onClick={login}
            className="
              w-full
              h-14
              rounded-2xl
              bg-[#16d64d]
              text-white
              font-black
              text-lg
            "
          >
            Anmelden
          </button>

          <button
            onClick={register}
            className="
              w-full
              h-14
              rounded-2xl
              bg-black
              text-white
              font-black
              text-lg
            "
          >
            Registrieren
          </button>

        </div>

      </div>

    </div>
  );
}