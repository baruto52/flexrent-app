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

  /*
    LOAD CHAT HISTORY
  */

  useEffect(() => {

    const stored =
      localStorage.getItem(
        "loqaro-ai-history"
      );

    if (stored) {

      try {

        setMessages(
          JSON.parse(stored)
        );

      } catch {

        localStorage.removeItem(
          "loqaro-ai-history"
        );

      }

    }

  }, []);

  /*
    AUTO SCROLL
  */

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);

  /*
    SAVE HISTORY
  */

  function saveHistory(
    updated: Message[]
  ) {

    setMessages(updated);

    localStorage.setItem(
      "loqaro-ai-history",
      JSON.stringify(updated)
    );

  }

  /*
    ASK AI
  */

  async function askAI() {

    if (
      !message.trim() ||
      loading
    ) return;

    /*
      USER MESSAGE
    */

    const userMessage: Message = {

      role: "user",

      content:
        message.trim(),
    };

    /*
      UPDATE HISTORY
    */

    const updatedMessages: Message[] = [

      ...messages,

      userMessage,
    ];

    saveHistory(
      updatedMessages
    );

    setMessage("");

    try {

      setLoading(true);

      /*
        API REQUEST
      */

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

            history:
              updatedMessages,
          }),
        }
      );

      /*
        RESPONSE
      */

      const data =
        await res.json();

      console.log(
        "AI RESPONSE:",
        data
      );

      /*
        ERROR
      */

      if (!res.ok) {

        const errorMessages: Message[] = [

          ...updatedMessages,

          {
            role: "assistant",

            content:
              data.error ||
              "Server Fehler.",
          },
        ];

        saveHistory(
          errorMessages
        );

        return;
      }

      /*
        AI MESSAGE
      */

      const aiMessage: Message = {

        role: "assistant",

        content:
          data.answer ||
          "Keine AI Antwort.",
      };

      /*
        FINAL UPDATE
      */

      const finalMessages: Message[] = [

        ...updatedMessages,

        aiMessage,
      ];

      saveHistory(
        finalMessages
      );

    } catch (error) {

      console.error(
        "AI SUPPORT ERROR:",
        error
      );

      const errorMessages: Message[] = [

        ...updatedMessages,

        {
          role: "assistant",

          content:
            "AI Fehler aufgetreten.",
        },
      ];

      saveHistory(
        errorMessages
      );

    } finally {

      setLoading(false);

    }
  }

  /*
    CLEAR CHAT
  */

  function clearChat() {

    localStorage.removeItem(
      "loqaro-ai-history"
    );

    setMessages([]);

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

          <div className="flex items-center gap-3">

            <button
              onClick={clearChat}
              className="
                px-4
                h-11
                rounded-2xl
                bg-gray-100
                hover:bg-gray-200
                text-sm
                font-semibold
                transition
              "
            >

              Reset

            </button>

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
                    whitespace-pre-wrap
                    break-words
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

              {loading
                ? "..."
                : "Senden"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}