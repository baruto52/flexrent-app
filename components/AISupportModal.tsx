"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  onClose: () => void;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AISupportModal({
  onClose,
}: Props) {

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  async function askAI() {

    if (!message.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");

    try {

      setLoading(true);

      const res = await fetch(
        "/api/ai/support",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message:
              userMessage.content,
          }),
        }
      );

      const data =
        await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer ||
            "Keine Antwort erhalten.",
        },
      ]);

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "AI Fehler aufgetreten.",
        },
      ]);

    } finally {

      setLoading(false);

    }
  }

  return (

    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div
        className="
          bg-white
          w-full
          max-w-3xl
          h-[85vh]
          rounded-[40px]
          shadow-2xl
          flex
          flex-col
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            h-24
            border-b
            border-gray-100
            px-8
            flex
            items-center
            justify-between
            shrink-0
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-black
              "
            >

              LOQARO AI

            </h1>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >

              Premium Marketplace Support

            </p>

          </div>

          <button
            onClick={onClose}
            className="
              w-12
              h-12
              rounded-full
              bg-gray-100
              text-2xl
              hover:bg-gray-200
              transition
            "
          >

            ×

          </button>

        </div>

        {/* CHAT */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            py-6
            space-y-4
            bg-[#f5f7fb]
          "
        >

          {messages.length === 0 && (

            <div
              className="
                h-full
                flex
                items-center
                justify-center
              "
            >

              <div className="text-center">

                <h2
                  className="
                    text-4xl
                    font-black
                    mb-4
                  "
                >

                  Wie kann ich helfen?

                </h2>

                <p
                  className="
                    text-gray-500
                    text-lg
                  "
                >

                  Betrug melden,
                  Hilfe erhalten,
                  Fragen stellen.

                </p>

              </div>

            </div>

          )}

          {messages.map(
            (msg, index) => (

              <div
                key={index}
                className={`
                  flex
                  ${
                    msg.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }
                `}
              >

                <div
                  className={`
                    max-w-[80%]
                    rounded-[28px]
                    px-6
                    py-4
                    text-[15px]
                    leading-7
                    shadow-sm
                    ${
                      msg.role ===
                      "user"
                        ? "bg-[#16d64d] text-white"
                        : "bg-white text-black"
                    }
                  `}
                >

                  {msg.content}

                </div>

              </div>

            )
          )}

          {loading && (

            <div className="flex justify-start">

              <div
                className="
                  bg-white
                  rounded-[28px]
                  px-6
                  py-4
                  shadow-sm
                "
              >

                AI antwortet...

              </div>

            </div>

          )}

          <div ref={bottomRef} />

        </div>

        {/* INPUT */}

        <div
          className="
            p-5
            border-t
            border-gray-100
            bg-white
            shrink-0
          "
        >

          <div
            className="
              flex
              gap-4
            "
          >

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {

                  e.preventDefault();

                  askAI();
                }

              }}
              placeholder="Schreibe eine Nachricht..."
              className="
                flex-1
                h-16
                max-h-40
                border
                border-gray-200
                rounded-3xl
                px-5
                py-4
                outline-none
                resize-none
              "
            />

            <button
              onClick={askAI}
              disabled={loading}
              className="
                w-40
                rounded-3xl
                bg-[#16d64d]
                text-white
                font-black
                hover:scale-[1.02]
                transition
                disabled:opacity-50
              "
            >

              Senden

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}