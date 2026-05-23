"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Navbar
from "@/components/Navbar";

import {

  ArrowLeft,

  Send,

  ShieldCheck,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function ChatPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const receiverId =
    params.id as string;

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  const [receiver, setReceiver] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  useEffect(() => {

    init();

  }, []);

  useEffect(() => {

    scrollBottom();

  }, [messages]);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {

      router.push("/login");

      return;
    }

    setCurrentUser(
      session.user
    );

    await Promise.all([

      loadReceiver(),

      loadMessages(
        session.user.id
      ),
    ]);

    subscribeMessages(
      session.user.id
    );
  }

  function scrollBottom() {

    messagesEndRef.current
      ?.scrollIntoView({

        behavior: "smooth",
      });
  }

  async function loadReceiver() {

    const {
      data,
    } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          receiverId
        )
        .maybeSingle();

    setReceiver(data);
  }

  async function loadMessages(
    currentUserId: string
  ) {

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `
          and(sender_id.eq.${currentUserId},receiver_id.eq.${receiverId}),
          and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId})
          `
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    setMessages(data || []);

    setLoading(false);
  }

  function subscribeMessages(
    currentUserId: string
  ) {

    const channel =
      supabase.channel(
        `chat-${currentUserId}-${receiverId}`
      );

    channel.on(

      "postgres_changes",

      {

        event: "INSERT",

        schema: "public",

        table: "messages",
      },

      (payload) => {

        const newMessage =
          payload.new as any;

        const valid =

          (
            newMessage.sender_id ===
            currentUserId &&

            newMessage.receiver_id ===
            receiverId
          ) ||

          (
            newMessage.sender_id ===
            receiverId &&

            newMessage.receiver_id ===
            currentUserId
          );

        if (!valid)
          return;

        setMessages(
          (prev) => [

            ...prev,

            newMessage,
          ]
        );
      }
    );

    channel.subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };
  }

  async function sendMessage() {

    if (
      !message.trim()
    ) return;

    if (!currentUser)
      return;

    try {

      setSending(true);

      await supabase
        .from("messages")
        .insert({

          sender_id:
            currentUser.id,

          receiver_id:
            receiverId,

          message:
            message.trim(),

          listing_id: null,
        });

      setMessage("");

    } catch (error) {

      console.log(error);

    } finally {

      setSending(false);
    }
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
        Chat wird geladen...
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
          h-[calc(100vh-96px)]
          flex
          flex-col
        "
      >

        {/* HEADER */}

        <div
          className="
            h-24
            bg-white
            border-b
            border-gray-100
            px-6
            flex
            items-center
            justify-between
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              gap-5
            "
          >

            <button
              onClick={() =>
                router.back()
              }
              className="
                w-14
                h-14
                rounded-2xl
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >

              <ArrowLeft
                size={24}
              />

            </button>

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  relative
                  w-14
                  h-14
                  rounded-full
                  overflow-hidden
                  bg-gray-100
                "
              >

                <Image
                  src={
                    receiver?.avatar_url ||

                    "https://placehold.co/300x300/png"
                  }
                  alt="User"
                  fill
                  className="
                    object-cover
                  "
                />

              </div>

              <div>

                <h1
                  className="
                    text-2xl
                    font-black
                  "
                >

                  {
                    receiver?.full_name ||

                    "Chat"
                  }

                </h1>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-[#16d64d]
                    font-bold
                  "
                >

                  <ShieldCheck
                    size={18}
                  />

                  Verifiziert

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* MESSAGES */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            py-8
            space-y-5
          "
        >

          {messages.map(
            (msg) => {

              const own =
                msg.sender_id ===
                currentUser?.id;

              return (

                <div
                  key={msg.id}
                  className={`
                    flex
                    ${
                      own

                        ? "justify-end"

                        : "justify-start"
                    }
                  `}
                >

                  <div
                    className={`
                      max-w-[75%]
                      px-6
                      py-4
                      rounded-[28px]
                      text-lg
                      shadow-sm
                      ${
                        own

                          ? "bg-[#16d64d] text-white"

                          : "bg-white"
                      }
                    `}
                  >

                    <p>

                      {msg.message}

                    </p>

                    <div
                      className={`
                        mt-2
                        text-sm
                        ${
                          own

                            ? "text-white/70"

                            : "text-gray-400"
                        }
                      `}
                    >

                      {new Date(
                        msg.created_at
                      ).toLocaleTimeString(
                        "de-DE",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}

                    </div>

                  </div>

                </div>

              );
            }
          )}

          <div
            ref={
              messagesEndRef
            }
          />

        </div>

        {/* INPUT */}

        <div
          className="
            bg-white
            border-t
            border-gray-100
            p-6
          "
        >

          <div
            className="
              flex
              gap-4
            "
          >

            <input
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage();
                }
              }}
              placeholder="Nachricht schreiben..."
              className="
                flex-1
                h-16
                px-6
                rounded-2xl
                border
                border-gray-200
                outline-none
                text-lg
              "
            />

            <button
              onClick={
                sendMessage
              }
              disabled={
                sending
              }
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
                shadow-lg
                disabled:opacity-50
              "
            >

              <Send
                size={24}
              />

            </button>

          </div>

        </div>

      </div>

    </main>
  );
}