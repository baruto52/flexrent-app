"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  FaPaperPlane,
} from "react-icons/fa";

import { supabase } from "@/lib/supabase";

type Props = {

  listing: any;

  user: any;

  onClose: () => void;
};

export default function ChatModal({

  listing,

  user,

  onClose,
}: Props) {

  const [messages, setMessages] =
    useState<any[]>([]);

  const [text, setText] =
    useState("");

  useEffect(() => {

    loadMessages();

  }, []);

  async function loadMessages() {

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .eq(
          "listing_id",
          listing.id
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (data) {

      setMessages(data);
    }
  }

  async function sendMessage() {

    if (!text) return;

    await supabase
      .from("messages")
      .insert({

        listing_id:
          listing.id,

        sender_id:
          user?.id,

        receiver_id:
          listing.user_id,

        text,
      });

    setText("");

    loadMessages();
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-2xl w-full h-[80vh] flex flex-col overflow-hidden">

        {/* HEADER */}

        <div className="border-b p-5 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-black">

              Chat

            </h2>

            <p className="text-gray-500">

              {listing.title}

            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >

            ×

          </button>

        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">

          {messages.map(
            (message) => {

            const mine =
              message.sender_id ===
              user?.id;

            return (

              <div
                key={message.id}
                className={`flex ${
                  mine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[70%] px-5 py-4 rounded-3xl ${
                    mine
                      ? "bg-green-500 text-white"
                      : "bg-white"
                  }`}
                >

                  {message.text}

                </div>

              </div>

            );

          })}

        </div>

        {/* INPUT */}

        <div className="border-t p-4 flex gap-3">

          <input
            value={text}
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
            placeholder="Nachricht schreiben..."
            className="flex-1 border rounded-2xl px-5 py-4"
          />

          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-2xl"
          >

            <FaPaperPlane />

          </button>

        </div>

      </div>

    </div>

  );
}