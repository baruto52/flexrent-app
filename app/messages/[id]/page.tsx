"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {

  ArrowLeft,

  Send,

  Trash2,

  ShieldCheck,

  Image as ImageIcon,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

type Message = {

  id: string;

  sender_id: string;

  receiver_id: string;

  message: string;

  image_url?: string;

  created_at: string;

  seen?: boolean;
};

export default function ChatPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const otherUserId =
    params.id as string;

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [otherTyping, setOtherTyping] =
    useState(false);

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

    if (!session) {

      router.push("/login");

      return;
    }

    const userId =
      session.user.id;

    setCurrentUserId(
      userId
    );

    await Promise.all([

      loadMessages(
        userId
      ),

      markMessagesAsRead(
        userId
      ),

      loadProfile(),
    ]);

    listenMessages(
      userId
    );

    listenTyping(
      userId
    );

    setLoading(false);
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

        seen: true,
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
          event: "*",
          schema: "public",
          table: "messages",
        },
        async () => {

          await loadMessages(
            userId
          );
        }
      )
      .subscribe();
  }

  function listenTyping(
    userId: string
  ) {

    const channel =
      supabase.channel(
        `typing-${userId}-${otherUserId}`
      );

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_status",
        },
        async () => {

          const { data } =
            await supabase
              .from("typing_status")
              .select("*")
              .eq(
                "user_id",
                otherUserId
              )
              .eq(
                "receiver_id",
                userId
              )
              .maybeSingle();

          setOtherTyping(
            data?.typing || false
          );
        }
      )
      .subscribe();
  }

  async function uploadImage(
    file: File
  ) {

    try {

      setUploading(true);

      /*
        SAFE FILE NAME
      */

      const extension =
        file.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${extension}`;

      /*
        UPLOAD
      */

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("chat-images")
          .upload(

            fileName,

            file,

            {

              cacheControl:
                "3600",

              upsert: false,

              contentType:
                file.type,
            }
          );

      if (uploadError) {

        console.log(
          "UPLOAD ERROR:",
          uploadError
        );

        alert(
          "Bild Upload fehlgeschlagen"
        );

        return;
      }

      /*
        PUBLIC URL
      */

      const {
        data: publicUrlData,
      } =
        supabase.storage
          .from("chat-images")
          .getPublicUrl(
            fileName
          );

      if (
        !publicUrlData
          ?.publicUrl
      ) {

        alert(
          "Bild URL Fehler"
        );

        return;
      }

      /*
        SAVE MESSAGE
      */

      const {
        error: messageError,
      } =
        await supabase
          .from("messages")
          .insert({

            sender_id:
              currentUserId,

            receiver_id:
              otherUserId,

            message:
              "",

            image_url:
              publicUrlData.publicUrl,

            seen: false,

            is_read: false,
          });

      if (messageError) {

        console.log(
          "MESSAGE ERROR:",
          messageError
        );

        alert(
          "Nachricht konnte nicht gespeichert werden"
        );

        return;
      }

      /*
        PUSH
      */

      try {

        await fetch(
          "/api/send-push",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              userId:
                otherUserId,

              title:
                "Neues Bild",

              message:
                "Du hast ein Bild erhalten",
            }),
          }
        );

      } catch (error) {

        console.log(error);
      }

      /*
        RELOAD
      */

      await loadMessages(
        currentUserId
      );

      scrollToBottom();

    } catch (error) {

      console.log(
        "IMAGE ERROR:",
        error
      );

      alert(
        "Bild konnte nicht gesendet werden"
      );

    } finally {

      setUploading(false);
    }
  }

  async function sendMessage() {

    if (!newMessage.trim())
      return;

    const {
      error,
    } =
      await supabase
        .from("messages")
        .insert({

          sender_id:
            currentUserId,

          receiver_id:
            otherUserId,

          message:
            newMessage,

          seen: false,

          is_read: false,
        });

    if (error) {

      console.log(error);

      return;
    }

    setNewMessage("");

    await loadMessages(
      currentUserId
    );

    scrollToBottom();
  }

  function scrollToBottom() {

    messagesEndRef.current?.scrollIntoView({

      behavior: "smooth",
    });
  }

  async function deleteMessage(
    id: string
  ) {

    await supabase
      .from("messages")
      .delete()
      .eq(
        "id",
        id
      );

    setMessages(
      (prev) =>

        prev.filter(
          (msg) =>
            msg.id !== id
        )
    );
  }

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-3xl
          font-black
        "
      >

        Chat wird geladen...

      </div>

    );
  }

  return (

    <main
      className="
        h-screen
        bg-[#f5f7fb]
        flex
        flex-col
      "
    >

      {/* HEADER */}

      <div
        className="
          bg-white
          border-b
          border-gray-100
          px-4
          md:px-6
          py-4
          flex
          items-center
          justify-between
          sticky
          top-0
          z-40
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <button
            onClick={() =>
              router.push(
                "/messages"
              )
            }
            className="
              w-12
              h-12
              rounded-2xl
              bg-[#f5f7fb]
              flex
              items-center
              justify-center
            "
          >

            <ArrowLeft
              size={22}
            />

          </button>

          <img
            src={
              profile?.avatar_url ||
              "/avatar.png"
            }
            className="
              w-14
              h-14
              rounded-full
              object-cover
            "
          />

          <div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <h1
                className="
                  font-black
                  text-xl
                "
              >

                {
                  profile?.full_name ||
                  "User"
                }

              </h1>

              <ShieldCheck
                size={18}
                className="
                  text-[#16d64d]
                "
              />

            </div>

            <p
              className="
                text-[#16d64d]
                text-sm
                font-semibold
              "
            >

              {otherTyping
                ? "schreibt gerade..."
                : profile?.online
                ? "Online"
                : "Offline"}

            </p>

          </div>

        </div>

      </div>

      {/* CHAT */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-4
          md:px-6
          py-6
          space-y-5
        "
      >

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
                  className={`
                    max-w-[85%]
                    md:max-w-[500px]
                    rounded-[30px]
                    px-5
                    py-4
                    shadow-sm
                    ${
                      isMine
                        ? "bg-[#16d64d] text-white"
                        : "bg-white text-black"
                    }
                  `}
                >

                  {msg.image_url && (

                    <img
                      src={
                        msg.image_url
                      }
                      className="
                        rounded-2xl
                        mb-3
                        max-h-[320px]
                        w-full
                        object-cover
                      "
                    />

                  )}

                  {msg.message && (

                    <div
                      className="
                        break-words
                        text-[16px]
                        leading-7
                      "
                    >

                      {msg.message}

                    </div>

                  )}

                  <div
                    className={`
                      text-[11px]
                      mt-3
                      ${
                        isMine
                          ? "text-green-100"
                          : "text-gray-400"
                      }
                    `}
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

      {/* INPUT */}

      <div
        className="
          bg-white
          border-t
          border-gray-100
          p-4
          sticky
          bottom-0
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            max-w-5xl
            mx-auto
          "
        >

          <input
            value={newMessage}
            onChange={(e) =>
              setNewMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key ===
                "Enter"
              ) {

                sendMessage();
              }
            }}
            placeholder="Nachricht schreiben..."
            className="
              flex-1
              h-16
              rounded-2xl
              border
              border-gray-200
              px-5
              outline-none
              text-lg
              bg-[#f5f7fb]
            "
          />

          <label
            className="
              w-16
              h-16
              rounded-2xl
              bg-white
              border
              border-gray-200
              flex
              items-center
              justify-center
              cursor-pointer
            "
          >

            <ImageIcon
              size={22}
            />

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {

                const file =
                  e.target.files?.[0];

                if (file) {

                  uploadImage(file);
                }
              }}
            />

          </label>

          <button
            onClick={sendMessage}
            disabled={uploading}
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
              size={22}
            />

          </button>

        </div>

      </div>

    </main>
  );
}