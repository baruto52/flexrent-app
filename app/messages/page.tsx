"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
};

export default function MessagesPage() {

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadConversations();

  }, []);

  async function loadConversations() {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const currentUserId =
      session.user.id;

    const { data, error } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {

      console.log(error);

      return;
    }

    const uniqueChats =
      new Map();

    for (const msg of data || []) {

      const otherUserId =
        msg.sender_id === currentUserId
          ? msg.receiver_id
          : msg.sender_id;

      if (
        !uniqueChats.has(
          otherUserId
        )
      ) {

        const {
          data: profile,
        } = await supabase
          .from("profiles")
          .select(
            "full_name, avatar_url"
          )
          .eq(
            "id",
            otherUserId
          )
          .single();

        uniqueChats.set(
          otherUserId,
          {
            ...msg,
            sender_name:
              profile?.full_name ||
              "User",
            sender_avatar:
              profile?.avatar_url ||
              "/avatar.png",
          }
        );
      }
    }

    setConversations(
      Array.from(
        uniqueChats.values()
      )
    );

    setLoading(false);
  }

  if (loading) {

    return (

      <div className="p-10">

        Lade Nachrichten...

      </div>

    );
  }

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-2">

        Nachrichten

      </h1>

      <p className="text-gray-500 mb-8">

        Deine Unterhaltungen

      </p>

      <div className="space-y-4">

        {conversations.map(
          (chat) => {

          const otherUserId =
            chat.sender_id;

          return (

            <Link
              key={chat.id}
              href={`/messages/${otherUserId}`}
            >

              <div className="bg-white border rounded-3xl p-5 hover:shadow-lg transition cursor-pointer flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <img
                    src={
                      chat.sender_avatar
                    }
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div>

                    <h2 className="font-bold text-xl">

                      {
                        chat.sender_name
                      }

                    </h2>

                    <p className="text-gray-500">

                      {chat.message}

                    </p>

                  </div>

                </div>

                <div className="text-sm text-gray-400">

                  {new Date(
                    chat.created_at
                  ).toLocaleDateString()}

                </div>

              </div>

            </Link>
          );
        })}

      </div>

    </div>
  );
}