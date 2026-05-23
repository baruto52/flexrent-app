"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {
  MessageCircle,
  ChevronRight,
} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function InboxPage() {

  const [user, setUser] =
    useState<any>(null);

  const [conversations, setConversations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    init();

  }, []);

  const init =
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

      setUser(
        session.user
      );

      loadConversations(
        session.user.id
      );
    };

  const loadConversations =
    async (
      userId: string
    ) => {

      const {
        data: conversationsData,
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

      if (!conversationsData) {

        setLoading(false);

        return;
      }

      const uniqueChats =
        Array.from(

          new Map(

            conversationsData.map(
              (message) => {

                const otherUser =
                  message.sender_id ===
                  userId
                    ? message.receiver_id
                    : message.sender_id;

                return [

                  otherUser,

                  {

                    ...message,

                    otherUser,
                  },
                ];
              }
            )

          ).values()

        );

      setConversations(
        uniqueChats
      );

      setLoading(false);
    };

  if (loading) {

    return (

      <div className="p-10">
        Lade Inbox...
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* TOP */}

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
                w-16
                h-16
                rounded-3xl
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
              "
            >

              <MessageCircle
                size={30}
              />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                "
              >
                Inbox
              </h1>

              <p
                className="
                  text-gray-500
                  text-lg
                  mt-2
                "
              >
                Deine Unterhaltungen
              </p>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {conversations.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[40px]
              p-20
              text-center
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
              Deine Unterhaltungen erscheinen hier.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {conversations.map(
              (
                conversation,
                index
              ) => (

                <Link
                  key={index}
                  href={`/messages?user=${conversation.otherUser}&listing=${conversation.listing_id}`}
                  className="
                    bg-white
                    rounded-[32px]
                    p-6
                    flex
                    items-center
                    justify-between
                    shadow-sm
                    hover:shadow-xl
                    transition
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-5
                    "
                  >

                    {/* AVATAR */}

                    <div
                      className="
                        w-16
                        h-16
                        rounded-full
                        bg-[#16d64d]
                        text-white
                        flex
                        items-center
                        justify-center
                        font-black
                        text-2xl
                      "
                    >

                      {
                        conversation.otherUser
                          ?.charAt(0)
                          ?.toUpperCase()
                      }

                    </div>

                    {/* CONTENT */}

                    <div>

                      <h2
                        className="
                          text-2xl
                          font-black
                          mb-2
                        "
                      >
                        Unterhaltung
                      </h2>

                      <p
                        className="
                          text-gray-500
                          line-clamp-1
                          max-w-xl
                        "
                      >
                        {
                          conversation.text
                        }
                      </p>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      flex
                      items-center
                      gap-5
                    "
                  >

                    <p
                      className="
                        text-gray-400
                      "
                    >

                      {new Date(
                        conversation.created_at
                      ).toLocaleDateString(
                        "de-DE"
                      )}

                    </p>

                    <ChevronRight
                      size={26}
                      className="
                        text-gray-400
                      "
                    />

                  </div>

                </Link>

              )
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}