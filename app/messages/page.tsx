"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Link from "next/link";

import Navbar
from "@/components/Navbar";

import {

  MessageCircle,

  ShieldCheck,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function MessagesPage() {

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [conversations, setConversations] =
    useState<any[]>([]);

  useEffect(() => {

    init();

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {

      window.location.href =
        "/login";

      return;
    }

    setUser(
      session.user
    );

    await loadConversations(
      session.user.id
    );

    setLoading(false);
  }

  async function loadConversations(
    userId: string
  ) {

    const {
      data,
    } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `
          sender_id.eq.${userId},
          receiver_id.eq.${userId}
          `
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!data) {

      setConversations([]);

      return;
    }

    const map =
      new Map();

    for (const msg of data) {

      const otherUserId =

        msg.sender_id === userId

          ? msg.receiver_id

          : msg.sender_id;

      if (
        map.has(
          otherUserId
        )
      ) continue;

      const {
        data: profile,
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            otherUserId
          )
          .maybeSingle();

      map.set(
        otherUserId,
        {

          userId:
            otherUserId,

          profile,

          latestMessage:
            msg.message,

          createdAt:
            msg.created_at,
        }
      );
    }

    setConversations(
      Array.from(
        map.values()
      )
    );
  }

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-2xl
          font-black
        "
      >

        Nachrichten werden geladen...

      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div
        className="
          max-w-5xl
          mx-auto
          px-4
          py-10
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-10
          "
        >

          <div>

            <h1
              className="
                text-5xl
                font-black
                mb-3
              "
            >
              Nachrichten
            </h1>

            <p
              className="
                text-gray-500
                text-lg
              "
            >
              Deine Unterhaltungen
            </p>

          </div>

          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
              px-5
              py-3
              rounded-2xl
              bg-[#16d64d]/10
              text-[#16d64d]
              font-bold
            "
          >

            <ShieldCheck
              size={22}
            />

            Sicher verschlüsselt

          </div>

        </div>

        {/* EMPTY */}

        {conversations.length === 0 && (

          <div
            className="
              bg-white
              rounded-[40px]
              p-20
              text-center
              shadow-sm
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
                mx-auto
                mb-8
              "
            >

              <MessageCircle
                size={42}
              />

            </div>

            <h2
              className="
                text-4xl
                font-black
                mb-5
              "
            >
              Keine Nachrichten
            </h2>

            <p
              className="
                text-gray-500
                text-xl
              "
            >
              Starte eine Unterhaltung
              mit einem Anbieter.
            </p>

          </div>

        )}

        {/* LIST */}

        <div className="space-y-5">

          {conversations.map(
            (chat) => (

              <Link
                key={chat.userId}
                href={`/messages/${chat.userId}`}
                className="
                  bg-white
                  rounded-[32px]
                  p-6
                  shadow-sm
                  flex
                  items-center
                  gap-5
                  hover:shadow-lg
                  transition
                "
              >

                {/* AVATAR */}

                <div
                  className="
                    relative
                    w-20
                    h-20
                    rounded-full
                    overflow-hidden
                    bg-gray-100
                    flex-shrink-0
                  "
                >

                  <Image
                    src={
                      chat.profile
                        ?.avatar_url ||

                      "https://placehold.co/300x300/png"
                    }
                    alt="User"
                    fill
                    className="
                      object-cover
                    "
                  />

                </div>

                {/* CONTENT */}

                <div className="flex-1">

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      mb-2
                    "
                  >

                    <h2
                      className="
                        text-2xl
                        font-black
                      "
                    >

                      {
                        chat.profile
                          ?.full_name ||

                        "User"
                      }

                    </h2>

                    <span
                      className="
                        text-sm
                        text-gray-400
                      "
                    >

                      {new Date(
                        chat.createdAt
                      ).toLocaleDateString(
                        "de-DE"
                      )}

                    </span>

                  </div>

                  <p
                    className="
                      text-gray-500
                      line-clamp-1
                      text-lg
                    "
                  >

                    {
                      chat.latestMessage
                    }

                  </p>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

    </main>
  );
}