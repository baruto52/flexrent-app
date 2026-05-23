"use client";

import { useEffect, useState, useRef } from "react";

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

  const params = useParams();

  const receiverId =
    params.id as string;

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState("");

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    init();

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) return;

    setCurrentUserId(
      session.user.id
    );

    loadMessages(
      session.user.id
    );

    listenRealtime(
      session.user.id
    );
  }

  async function loadMessages(
    userId: string
  ) {

    const { data, error } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {

      console.log(error);

      return;
    }

    setMessages(data || []);

    scrollBottom();
  }

  function listenRealtime(
    userId: string
  ) {

    supabase
      .channel(
        `chat-${receiverId}`
      )
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

          const valid =
            (
              msg.sender_id === userId &&
              msg.receiver_id === receiverId
            ) ||
            (
              msg.sender_id === receiverId &&
              msg.receiver_id === userId
            );

          if (valid) {

            setMessages(
              (prev) => [
                ...prev,
                msg,
              ]
            );

            scrollBottom();
          }
        }
      )
      .subscribe();
  }

  async function sendMessage() {

    if (!newMessage.trim())
      return;

    const { error } =
      await supabase
        .from("messages")
        .insert({
          sender_id:
            currentUserId,
          receiver_id:
            receiverId,
          message:
            newMessage,
        });

    if (!error) {

      setNewMessage("");
    }
  }

  function scrollBottom() {

    setTimeout(() => {

      messagesEndRef.current?.
        scrollIntoView({
          behavior: "smooth",
        });

    }, 100);
  }

  return (

    <div className="flex flex-col h-screen bg-gray-50">

      <div className="bg-white border-b p-5 flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-gray-300" />

        <div>

          <h2 className="font-bold text-xl">

            Chat

          </h2>

          <p className="text-green-500 text-sm">

            Online

          </p>

        </div>

      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.map(
          (msg) => {

          const mine =
            msg.sender_id ===
            currentUserId;

          return (

            <div
              key={msg.id}
              className={`flex ${
                mine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[70%] px-5 py-3 rounded-3xl ${
                  mine
                    ? "bg-green-500 text-white"
                    : "bg-white border"
                }`}
              >

                {msg.message}

              </div>

            </div>
          );
        })}

        <div
          ref={messagesEndRef}
        />

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
          className="flex-1 border rounded-2xl px-5 py-4"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-8 rounded-2xl"
        >

          Senden

        </button>

      </div>

    </div>
  );
}