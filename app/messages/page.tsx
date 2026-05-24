"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {

  MessageCircle,

  Search,

  Trash2,

  ShieldCheck,

  ArrowRight,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

type Conversation = {

  userId: string;

  name: string;

  avatar: string;

  lastMessage: string;

  createdAt: string;

  unread: number;
};

export default function MessagesPage() {

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [filtered, setFiltered] =
    useState<Conversation[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    init();

  }, []);

  useEffect(() => {

    const filteredData =
      conversations.filter(
        (chat) =>

          chat.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          chat.lastMessage
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFiltered(
      filteredData
    );

  }, [search, conversations]);

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

    const userId =
      session.user.id;

    setCurrentUserId(
      userId
    );

    await loadConversations(
      userId
    );

    listenMessages(
      userId
    );

    setLoading(false);
  }

  function listenMessages(
    userId: string
  ) {

    const channel =
      supabase.channel(
        `messages-list-${userId}`
      );

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {

          loadConversations(
            userId
          );
        }
      )
      .subscribe();
  }

  async function loadConversations(
    userId: string
  ) {

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `sender_id.eq.${userId},receiver_id.eq.${userId}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!data) {

      setLoading(false);

      return;
    }

    const uniqueMap =
      new Map();

    for (const msg of data) {

      const otherUserId =
        msg.sender_id === userId
          ? msg.receiver_id
          : msg.sender_id;

      if (
        uniqueMap.has(
          otherUserId
        )
      )
        continue;

      const unreadCount =
        data.filter(
          (m) =>
            m.sender_id ===
              otherUserId &&
            m.receiver_id ===
              userId &&
            !m.is_read
        ).length;

      const {
        data: profile,
      } =
        await supabase
          .from("profiles")
          .select(
            "full_name, avatar_url"
          )
          .eq(
            "id",
            otherUserId
          )
          .single();

      uniqueMap.set(
        otherUserId,
        {

          userId:
            otherUserId,

          name:
            profile?.full_name ||
            "User",

          avatar:
            profile?.avatar_url ||
            "/avatar.png",

          lastMessage:
            msg.image_url
              ? "📷 Bild"
              : msg.message,

          createdAt:
            msg.created_at,

          unread:
            unreadCount,
        }
      );
    }

    const result =
      Array.from(
        uniqueMap.values()
      );

    setConversations(
      result
    );

    setFiltered(
      result
    );
  }

  async function deleteConversation(
    otherUserId: string
  ) {

    const confirmDelete =
      confirm(
        "Unterhaltung löschen?"
      );

    if (!confirmDelete)
      return;

    await supabase
      .from("messages")
      .delete()
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      );

    setConversations(
      (prev) =>

        prev.filter(
          (c) =>
            c.userId !==
            otherUserId
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
          text-3xl
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
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-8
        "
      >

        {/* HEADER */}

        <div className="mb-10">

          <div
            className="
              inline-flex
              items-center
              gap-3
              px-5
              py-3
              rounded-full
              bg-[#16d64d]
              text-white
              font-black
              mb-6
            "
          >

            <MessageCircle
              size={20}
            />

            Nachrichten

          </div>

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-end
              lg:justify-between
              gap-6
            "
          >

            <div>

              <h1
                className="
                  text-5xl
                  md:text-7xl
                  font-black
                  leading-none
                  tracking-tight
                "
              >

                Deine Chats

              </h1>

              <p
                className="
                  text-gray-500
                  text-lg
                  md:text-2xl
                  mt-5
                  max-w-3xl
                "
              >

                Kommuniziere direkt mit
                Vermietern und Mietern
                auf FlexRent.

              </p>

            </div>

            <div
              className="
                bg-white
                border
                border-gray-100
                rounded-3xl
                px-8
                py-6
                shadow-sm
                min-w-fit
              "
            >

              <p
                className="
                  text-gray-400
                  mb-2
                "
              >

                Unterhaltungen

              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  leading-none
                "
              >

                {
                  conversations.length
                }

              </h2>

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div
          className="
            bg-white
            rounded-[32px]
            p-4
            shadow-sm
            border
            border-gray-100
            mb-8
          "
        >

          <div
            className="
              h-16
              rounded-2xl
              border
              border-gray-200
              flex
              items-center
              px-5
              gap-3
            "
          >

            <Search
              size={20}
              className="
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Nachrichten durchsuchen..."
              className="
                flex-1
                h-full
                outline-none
                text-lg
                bg-transparent
              "
            />

          </div>

        </div>

        {/* EMPTY */}

        {filtered.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[40px]
              p-10
              md:p-24
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-28
                h-28
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
                size={50}
              />

            </div>

            <h2
              className="
                text-4xl
                md:text-6xl
                font-black
                mb-6
              "
            >

              Keine Nachrichten

            </h2>

            <p
              className="
                text-gray-500
                text-lg
                md:text-2xl
                max-w-3xl
                mx-auto
              "
            >

              Sobald du Listings
              kontaktierst, erscheinen
              deine Unterhaltungen hier.

            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {filtered.map(
              (chat) => (

                <div
                  key={chat.userId}
                  className="
                    bg-white
                    rounded-[36px]
                    p-5
                    md:p-6
                    shadow-sm
                    border
                    border-gray-100
                    hover:shadow-xl
                    transition-all
                    duration-300
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-5
                    "
                  >

                    <Link
                      href={`/messages/${chat.userId}`}
                    >

                      <img
                        src={
                          chat.avatar
                        }
                        alt=""
                        className="
                          w-20
                          h-20
                          rounded-full
                          object-cover
                          border-4
                          border-white
                          shadow-lg
                        "
                      />

                    </Link>

                    <Link
                      href={`/messages/${chat.userId}`}
                      className="
                        flex-1
                        min-w-0
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-5
                        "
                      >

                        <div className="min-w-0">

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-2
                            "
                          >

                            <h2
                              className="
                                text-2xl
                                font-black
                                truncate
                              "
                            >

                              {chat.name}

                            </h2>

                            <ShieldCheck
                              size={18}
                              className="
                                text-[#16d64d]
                              "
                            />

                          </div>

                          <p
                            className="
                              text-gray-500
                              line-clamp-1
                              text-lg
                            "
                          >

                            {
                              chat.lastMessage
                            }

                          </p>

                        </div>

                        <div
                          className="
                            flex
                            flex-col
                            items-end
                            gap-3
                            min-w-fit
                          "
                        >

                          <span
                            className="
                              text-sm
                              text-gray-400
                              font-semibold
                            "
                          >

                            {new Date(
                              chat.createdAt
                            ).toLocaleDateString()}

                          </span>

                          {chat.unread > 0 && (

                            <div
                              className="
                                min-w-[34px]
                                h-9
                                px-3
                                rounded-full
                                bg-[#16d64d]
                                text-white
                                text-sm
                                flex
                                items-center
                                justify-center
                                font-black
                              "
                            >

                              {
                                chat.unread
                              }

                            </div>

                          )}

                        </div>

                      </div>

                    </Link>

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        ml-3
                      "
                    >

                      <Link
                        href={`/messages/${chat.userId}`}
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-[#16d64d]
                          text-white
                          flex
                          items-center
                          justify-center
                          shadow-lg
                        "
                      >

                        <ArrowRight
                          size={22}
                        />

                      </Link>

                      <button
                        onClick={() =>
                          deleteConversation(
                            chat.userId
                          )
                        }
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-red-500
                          text-white
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Trash2
                          size={20}
                        />

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}