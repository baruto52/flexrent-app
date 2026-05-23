"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

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

  const [currentUserId, setCurrentUserId] =
    useState("");

  useEffect(() => {

    init();

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) return;

    const userId =
      session.user.id;

    setCurrentUserId(
      userId
    );

    loadConversations(
      userId
    );
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

    if (!data) return;

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

      const { data: profile } =
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
            msg.message,

          createdAt:
            msg.created_at,

          unread:
            unreadCount,
        }
      );
    }

    setConversations(
      Array.from(
        uniqueMap.values()
      )
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

  return (

    <div className="max-w-4xl mx-auto py-10 px-5">

      <h1 className="text-5xl font-bold mb-2">

        Nachrichten

      </h1>

      <p className="text-gray-500 mb-8">

        Deine Unterhaltungen

      </p>

      <div className="space-y-4">

        {conversations.map(
          (chat) => (

          <div
            key={chat.userId}
            className="bg-white border rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition"
          >

            <Link
              href={`/messages/${chat.userId}`}
              className="flex items-center gap-4 flex-1"
            >

              <img
                src={chat.avatar}
                alt=""
                className="w-16 h-16 rounded-full object-cover border"
              />

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h2 className="font-bold text-lg">

                    {chat.name}

                  </h2>

                  <span className="text-sm text-gray-400">

                    {new Date(
                      chat.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>

                <div className="flex items-center gap-3 mt-1">

                  <p className="text-gray-500 line-clamp-1">

                    {chat.lastMessage}

                  </p>

                  {chat.unread > 0 && (

                    <div className="min-w-[24px] h-6 px-2 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">

                      {chat.unread}

                    </div>
                  )}

                </div>

              </div>

            </Link>

            <button
              onClick={() =>
                deleteConversation(
                  chat.userId
                )
              }
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
            >

              Löschen

            </button>

          </div>
        ))}

        {conversations.length === 0 && (

          <div className="bg-white border rounded-3xl p-10 text-center text-gray-500">

            Keine Nachrichten vorhanden

          </div>
        )}

      </div>

    </div>
  );
}