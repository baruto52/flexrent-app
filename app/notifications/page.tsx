"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {

  Bell,

  Check,

  Trash2,

  Sparkles,

  MessageCircle,

  CalendarDays,

  Heart,

  Star,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

type Notification = {

  id: string;

  title: string;

  description: string;

  read: boolean;

  created_at: string;

  user_id: string;

  type?: string;

  link?: string;
};

export default function NotificationsPage() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let realtimeChannel: any;

    init().then(
      (channel) => {

        realtimeChannel =
          channel;
      }
    );

    return () => {

      if (realtimeChannel) {

        supabase.removeChannel(
          realtimeChannel
        );
      }
    };

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {

      window.location.href =
        "/login";

      return;
    }

    await loadNotifications(
      session.user.id
    );

    return listenNotifications(
      session.user.id
    );
  }

  async function loadNotifications(
    userId: string
  ) {

    try {

      const { data } =
        await supabase
          .from("notifications")
          .select("*")
          .eq(
            "user_id",
            userId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      setNotifications(
        data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  function listenNotifications(
    userId: string
  ) {

    const channel =
      supabase
        .channel(
          `notifications-${userId}`
        )
        .on(

          "postgres_changes",

          {

            event: "*",

            schema: "public",

            table:
              "notifications",

            filter:
              `user_id=eq.${userId}`,
          },

          () => {

            loadNotifications(
              userId
            );
          }

        );

    channel.subscribe();

    return channel;
  }

  async function markAsRead(
    id: string
  ) {

    try {

      const { error } =
        await supabase
          .from("notifications")
          .update({

            read: true,
          })
          .eq(
            "id",
            id
          );

      if (error) {

        alert(
          "Fehler"
        );

        return;
      }

      setNotifications(
        (prev) =>

          prev.map(
            (notification) =>

              notification.id === id

                ? {
                    ...notification,
                    read: true,
                  }

                : notification
          )
      );

    } catch (error) {

      console.log(error);
    }
  }

  async function deleteNotification(
    id: string
  ) {

    try {

      const { error } =
        await supabase
          .from("notifications")
          .delete()
          .eq(
            "id",
            id
          );

      if (error) {

        alert(
          "Fehler"
        );

        return;
      }

      setNotifications(
        (prev) =>

          prev.filter(
            (notification) =>

              notification.id !== id
          )
      );

    } catch (error) {

      console.log(error);
    }
  }

  async function markAllAsRead() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user)
      return;

    try {

      await supabase
        .from("notifications")
        .update({

          read: true,
        })
        .eq(
          "user_id",
          user.id
        );

      setNotifications(
        (prev) =>

          prev.map(
            (notification) => ({

              ...notification,

              read: true,
            })
          )
      );

    } catch (error) {

      console.log(error);
    }
  }

  const unreadCount =

    notifications.filter(
      (notification) =>

        !notification.read
    ).length;

  function getIcon(
    type?: string
  ) {

    switch (type) {

      case "message":

        return (
          <MessageCircle
            size={28}
          />
        );

      case "booking":

        return (
          <CalendarDays
            size={28}
          />
        );

      case "favorite":

        return (
          <Heart
            size={28}
          />
        );

      case "review":

        return (
          <Star
            size={28}
          />
        );

      default:

        return (
          <Bell
            size={28}
          />
        );
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
          text-3xl
          font-black
        "
      >
        Notifications werden geladen...
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-6
            mb-12
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-5
                mb-5
              "
            >

              <div
                className="
                  w-20
                  h-20
                  rounded-[28px]
                  bg-[#16d64d]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >

                <Bell
                  size={38}
                />

              </div>

              <div>

                <h1
                  className="
                    text-5xl
                    md:text-6xl
                    font-black
                  "
                >
                  Notifications
                </h1>

                <p
                  className="
                    text-gray-500
                    text-xl
                    mt-3
                  "
                >
                  {
                    unreadCount
                  } ungelesene Benachrichtigungen
                </p>

              </div>

            </div>

          </div>

          {notifications.length > 0 && (

            <button
              onClick={
                markAllAsRead
              }
              className="
                h-14
                px-6
                rounded-2xl
                bg-black
                text-white
                flex
                items-center
                justify-center
                gap-3
                font-bold
              "
            >

              <Check
                size={20}
              />

              Alle gelesen

            </button>

          )}

        </div>

        {/* EMPTY */}

        {notifications.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[40px]
              p-20
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-28
                h-28
                rounded-full
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
                mx-auto
                mb-10
              "
            >

              <Sparkles
                size={50}
              />

            </div>

            <h2
              className="
                text-5xl
                font-black
                mb-5
              "
            >
              Keine Notifications
            </h2>

            <p
              className="
                text-gray-500
                text-2xl
                max-w-2xl
                mx-auto
                leading-10
              "
            >
              Neue Aktivitäten erscheinen hier automatisch.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {notifications.map(
              (notification) => {

                const content = (

                  <div
                    className={`
                      bg-white
                      rounded-[36px]
                      p-8
                      shadow-sm
                      border
                      transition
                      hover:shadow-xl
                      ${
                        notification.read

                          ? "border-gray-100"

                          : "border-[#16d64d]"
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-6
                      "
                    >

                      {/* LEFT */}

                      <div
                        className="
                          flex
                          gap-5
                        "
                      >

                        <div
                          className={`
                            w-16
                            h-16
                            rounded-2xl
                            text-white
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            ${
                              notification.read

                                ? "bg-gray-300"

                                : "bg-[#16d64d]"
                            }
                          `}
                        >

                          {getIcon(
                            notification.type
                          )}

                        </div>

                        <div>

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              mb-3
                            "
                          >

                            <h2
                              className="
                                text-3xl
                                font-black
                              "
                            >
                              {
                                notification.title
                              }
                            </h2>

                            {!notification.read && (

                              <div
                                className="
                                  w-3
                                  h-3
                                  rounded-full
                                  bg-[#16d64d]
                                "
                              />

                            )}

                          </div>

                          <p
                            className="
                              text-gray-600
                              text-lg
                              leading-8
                              mb-4
                            "
                          >
                            {
                              notification.description
                            }
                          </p>

                          <p
                            className="
                              text-gray-400
                              text-sm
                            "
                          >

                            {new Date(
                              notification.created_at
                            ).toLocaleString(
                              "de-DE"
                            )}

                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        {!notification.read && (

                          <button
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            className="
                              w-14
                              h-14
                              rounded-2xl
                              bg-[#16d64d]
                              text-white
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <Check
                              size={22}
                            />

                          </button>

                        )}

                        <button
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-red-500
                            text-white
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <Trash2
                            size={22}
                          />

                        </button>

                      </div>

                    </div>

                  </div>

                );

                if (notification.link) {

                  return (

                    <Link
                      key={notification.id}
                      href={
                        notification.link
                      }
                    >
                      {content}
                    </Link>

                  );
                }

                return (

                  <div
                    key={notification.id}
                  >
                    {content}
                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}