"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

export default function ChatPage() {

  const params =
    useParams();

  const otherUserId =
    params.id as string;

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {

    init();

  }, []);

  useEffect(() => {

    scrollToBottom();

  }, [messages]);

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

    loadMessages(
      userId
    );

    markMessagesAsRead(
      userId
    );

    loadProfile();

    listenMessages(
      userId
    );
  }

  async function loadProfile() {

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          otherUserId
        )
        .single();

    setProfile(data);
  }

  async function loadMessages(
    userId: string
  ) {

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (data)
      setMessages(data);
  }

  async function markMessagesAsRead(
    userId: string
  ) {

    await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .eq(
        "sender_id",
        otherUserId
      )
      .eq(
        "receiver_id",
        userId
      );
  }

  function listenMessages(
    userId: string
  ) {

    const channel =
      supabase.channel(
        `chat-${userId}-${otherUserId}`
      );

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {

          const msg =
            payload.new as Message;

          const isRelevant =
            (
              msg.sender_id ===
                userId &&
              msg.receiver_id ===
                otherUserId
            ) ||
            (
              msg.sender_id ===
                otherUserId &&
              msg.receiver_id ===
                userId
            );

          if (isRelevant) {

            setMessages(
              (prev) => [
                ...prev,
                msg,
              ]
            );
          }
        }
      )
      .subscribe();
  }

  async function sendMessage() {

    if (!newMessage.trim())
      return;

    await supabase
      .from("messages")
      .insert({
        sender_id:
          currentUserId,
        receiver_id:
          otherUserId,
        message:
          newMessage,
      });

    setNewMessage("");
  }

  function scrollToBottom() {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (

    <div className="h-screen flex flex-col bg-[#f5f5f5]">

      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">

        <img
          src={
            profile?.avatar_url ||
            "/avatar.png"
          }
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>

          <h1 className="font-bold text-xl">

            {profile?.full_name ||
              "User"}

          </h1>

          <p className="text-green-500 text-sm">

            Online

          </p>

        </div>

      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

        {messages.map(
          (msg) => {

            const isMine =
              msg.sender_id ===
              currentUserId;

            return (

              <div
                key={msg.id}
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[350px] px-5 py-3 rounded-3xl shadow-sm ${
                    isMine
                      ? "bg-green-500 text-white"
                      : "bg-white text-black"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <span>

                      {msg.message}

                    </span>

                    {isMine && (

                      <button
                        onClick={async () => {

                          await supabase
                            .from(
                              "messages"
                            )
                            .delete()
                            .eq(
                              "id",
                              msg.id
                            );

                          setMessages(
                            (
                              prev
                            ) =>
                              prev.filter(
                                (
                                  m
                                ) =>
                                  m.id !==
                                  msg.id
                              )
                          );
                        }}
                        className="text-xs opacity-70 hover:opacity-100"
                      >

                        ✕

                      </button>
                    )}

                  </div>

                  <div
                    className={`text-[11px] mt-2 ${
                      isMine
                        ? "text-green-100"
                        : "text-gray-400"
                    }`}
                  >

                    {new Date(
                      msg.created_at
                    ).toLocaleTimeString(
                      [],
                      {
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                      }
                    )}

                  </div>

                </div>

              </div>
            );
          }
        )}

        <div ref={messagesEndRef} />

      </div>

      <div className="bg-white border-t p-4 flex gap-3">

        <input
          value={newMessage}
          onChange={(e) =>
            setNewMessage(
              e.target.value
            )
          }
          placeholder="Nachricht schreiben..."
          className="flex-1 border rounded-2xl px-5 py-4 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white px-8 rounded-2xl font-semibold"
        >

          Senden

        </button>

      </div>

    </div>
  );
}