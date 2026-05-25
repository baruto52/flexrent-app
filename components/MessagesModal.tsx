"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import Image from "next/image";

import { supabase }
from "@/lib/supabase";

type Props = {

  user: any;

  onClose: () => void;
};

export default function MessagesModal({

  user,

  onClose,

}: Props) {

  const [loading, setLoading] =
    useState(true);

  const [chats, setChats] =
    useState<any[]>([]);

  /*
    LOAD CHATS
  */

  const loadChats =
    useCallback(
      async () => {

        try {

          const {
            data,
            error,
          } =
            await supabase
              .from("messages")
              .select(`

                id,

                text,

                created_at,

                listing_id,

                sender_id,

                receiver_id,

                sender_name,

                receiver_name,

                sender_avatar,

                receiver_avatar,

                read

              `)
              .or(
                `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
              )
              .order(
                "created_at",
                {
                  ascending: false,
                }
              )
              .limit(50);

          if (
            error ||
            !data
          ) {

            console.log(error);

            return;
          }

          /*
            UNIQUE CHATS
          */

          const unique =
            Array.from(

              new Map(

                data.map(
                  (msg) => [

                    `${msg.listing_id}-${
                      msg.sender_id === user.id

                        ? msg.receiver_id

                        : msg.sender_id
                    }`,

                    msg,
                  ]
                )
              ).values()
            );

          setChats(
            unique as any[]
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      },

      [user.id]
    );

  /*
    INITIAL LOAD
  */

  useEffect(() => {

    loadChats();

  }, [loadChats]);

  /*
    REALTIME
  */

  useEffect(() => {

    const channel =
      supabase
        .channel(
          "messages-sidebar"
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
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

  }, [loadChats]);

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        backdrop-blur-sm
        flex
        justify-center
        items-center
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-xl
          rounded-[32px]
          overflow-hidden
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            border-b
            p-6
            flex
            items-center
            justify-between
          "
        >

          <h1
            className="
              text-3xl
              font-black
            "
          >

            Nachrichten

          </h1>

          <button
            onClick={onClose}
            className="
              w-12
              h-12
              rounded-full
              bg-gray-100
              text-2xl
              font-bold
              hover:bg-gray-200
              transition
            "
          >

            ×

          </button>

        </div>

        {/* CONTENT */}

        <div
          className="
            max-h-[75vh]
            overflow-y-auto
          "
        >

          {/* LOADING */}

          {loading && (

            <div
              className="
                p-10
                text-center
                font-bold
              "
            >

              Nachrichten laden...

            </div>

          )}

          {/* EMPTY */}

          {!loading &&
            chats.length === 0 && (

            <div
              className="
                p-10
                text-center
                text-gray-500
              "
            >

              Keine Nachrichten vorhanden

            </div>

          )}

          {/* CHAT LIST */}

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
                  className="
                    border-b
                    p-5
                    hover:bg-gray-50
                    transition
                    cursor-pointer
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >

                    {/* AVATAR */}

                    <div className="relative">

                      <Image
                        src={
                          otherAvatar ||

                          "https://placehold.co/100x100/png"
                        }
                        alt=""
                        width={60}
                        height={60}
                        loading="lazy"
                        quality={70}
                        className="
                          rounded-full
                          object-cover
                          w-14
                          h-14
                        "
                      />

                      {unread && (

                        <div
                          className="
                            absolute
                            top-0
                            right-0
                            w-4
                            h-4
                            rounded-full
                            bg-red-500
                            border-2
                            border-white
                          "
                        />

                      )}

                    </div>

                    {/* CONTENT */}

                    <div
                      className="
                        flex-1
                        min-w-0
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >

                        <h2
                          className="
                            font-black
                            truncate
                            text-lg
                          "
                        >

                          {otherName ||
                            "Benutzer"}

                        </h2>

                        <span
                          className="
                            text-xs
                            text-gray-400
                            flex-shrink-0
                          "
                        >

                          {new Date(
                            chat.created_at
                          ).toLocaleDateString(
                            "de-DE"
                          )}

                        </span>

                      </div>

                      <p
                        className="
                          text-sm
                          text-gray-500
                          truncate
                          mt-1
                        "
                      >

                        {chat.text}

                      </p>

                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>

      </div>

    </div>
  );
}