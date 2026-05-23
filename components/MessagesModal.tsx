"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Props = {
  user: any;

  onClose: () => void;
};

export default function MessagesModal({
  user,
  onClose,
}: Props) {

  const [chats, setChats] =
    useState<any[]>([]);

  useEffect(() => {

    loadChats();

    const channel =
      supabase
        .channel("messages-sidebar")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          () => {

            loadChats();

          }
        )
        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, []);

  async function loadChats() {

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!data) return;

    const unique =
      Array.from(
        new Map(

          data.map(
            (msg) => [

              msg.listing_id +
              (
                msg.sender_id ===
                user.id
                  ? msg.receiver_id
                  : msg.sender_id
              ),

              msg,

            ]
          )

        ).values()
      );

    setChats(unique as any[]);
  }

  return (

    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">

      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden">

        {/* HEADER */}

        <div className="border-b p-5 flex items-center justify-between">

          <h1 className="text-3xl font-bold">
            Nachrichten
          </h1>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        {/* LIST */}

        <div className="max-h-[75vh] overflow-y-auto">

          {chats.length === 0 && (

            <div className="p-10 text-center text-gray-500">

              Keine Nachrichten vorhanden

            </div>

          )}

          {chats.map(
            (chat: any) => {

            const otherName =
              chat.sender_id ===
              user.id
                ? chat.receiver_name
                : chat.sender_name;

            const otherAvatar =
              chat.sender_id ===
              user.id
                ? chat.receiver_avatar
                : chat.sender_avatar;

            const unread =
              !chat.read &&
              chat.receiver_id ===
              user.id;

            return (

              <div
                key={chat.id}
                className="border-b p-4 hover:bg-gray-50 cursor-pointer transition"
              >

                <div className="flex items-center gap-4">

                  {/* AVATAR */}

                  <div className="relative">

                    <img
                      src={
                        otherAvatar ||
                        "https://via.placeholder.com/50"
                      }
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    {unread && (

                      <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white" />

                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between gap-3">

                      <h2 className="font-bold truncate">

                        {otherName ||
                          "Benutzer"}

                      </h2>

                      <span className="text-xs text-gray-400">

                        {new Date(
                          chat.created_at
                        ).toLocaleDateString()}

                      </span>

                    </div>

                    <p className="text-sm text-gray-500 truncate mt-1">

                      {chat.text}

                    </p>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );
}