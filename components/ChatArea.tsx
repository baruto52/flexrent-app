"use client";

import {
  useRef,
  useEffect,
} from "react";

import {
  ArrowLeft,
  Send,
} from "lucide-react";

import MessageBubble
from "./MessageBubble";

type Props = {
  receiver: any;
  messages: any[];
  currentUser: any;
  message: string;
  setMessage: any;
  sendMessage: () => void;
  sending: boolean;
  router: any;
};

export default function ChatArea({

  receiver,

  messages,

  currentUser,

  message,

  setMessage,

  sendMessage,

  sending,

  router,

}: Props) {

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({

        behavior: "smooth",
      });

  }, [messages]);

  return (

    <div
      className="
        flex-1
        flex
        flex-col
        bg-[#f5f7fb]
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
          gap-4
          shadow-sm
        "
      >

        <button
          onClick={() =>
            router.back()
          }
          className="
            lg:hidden
            w-12
            h-12
            rounded-2xl
            bg-gray-100
            flex
            items-center
            justify-center
          "
        >

          <ArrowLeft
            size={20}
          />

        </button>

        <div
          className="
            w-14
            h-14
            rounded-full
            overflow-hidden
            bg-gray-200
          "
        >

          <img
            src={
              receiver?.avatar_url ||

              "https://placehold.co/300x300/png"
            }
            alt="User"
            className="
              w-full
              h-full
              object-cover
            "
          />

        </div>

        <div>

          <h2
            className="
              text-2xl
              font-black
            "
          >

            {
              receiver?.full_name ||

              "Chat"
            }

          </h2>

          <p
            className="
              text-sm
              text-[#16d64d]
              font-bold
            "
          >
            Online
          </p>

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
          (msg) => (

            <MessageBubble
              key={msg.id}
              own={
                msg.sender_id ===
                currentUser?.id
              }
              message={
                msg.message
              }
              createdAt={
                msg.created_at
              }
            />

          )
        )}

        <div ref={bottomRef} />

      </div>

      {/* INPUT */}

      <div
        className="
          bg-white
          border-t
          border-gray-100
          p-5
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
            "
          >

            <Send
              size={24}
            />

          </button>

        </div>

      </div>

    </div>

  );
}