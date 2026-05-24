"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Bell,
  Heart,
  Inbox,
  LogOut,
  Menu,
  Plus,
  User,
  X,
} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

export default function Navbar() {

  const pathname =
    usePathname();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  const [notifications, setNotifications] =
    useState(0);

  const [messages, setMessages] =
    useState(0);

  useEffect(() => {

    let cleanup:
      (() => void) | undefined;

    init().then(
      (cleanupFn) => {

        cleanup =
          cleanupFn;
      }
    );

    return () => {

      if (cleanup) {

        cleanup();
      }
    };

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session)
      return;

    setUser(
      session.user
    );

    await Promise.all([

      loadNotifications(
        session.user.id
      ),

      loadMessages(
        session.user.id
      ),
    ]);

    return listenRealtime(
      session.user.id
    );
  }

  async function loadNotifications(
    userId: string
  ) {

    const { count } =
      await supabase
        .from("notifications")
        .select(
          "*",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "user_id",
          userId
        )
        .eq(
          "read",
          false
        );

    setNotifications(
      count || 0
    );
  }

  async function loadMessages(
    userId: string
  ) {

    const { count } =
      await supabase
        .from("messages")
        .select(
          "*",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "receiver_id",
          userId
        );

    setMessages(
      count || 0
    );
  }

  function listenRealtime(
    userId: string
  ) {

    const notificationChannel =
      supabase.channel(
        `navbar-notifications-${userId}`
      );

    notificationChannel.on(

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

        toast.success(
          "Neue Benachrichtigung"
        );
      }

    );

    notificationChannel.subscribe();

    const messageChannel =
      supabase.channel(
        `navbar-messages-${userId}`
      );

    messageChannel.on(

      "postgres_changes",

      {

        event: "INSERT",

        schema: "public",

        table:
          "messages",

        filter:
          `receiver_id=eq.${userId}`,
      },

      () => {

        loadMessages(
          userId
        );

        toast.success(
          "Neue Nachricht erhalten"
        );
      }

    );

    messageChannel.subscribe();

    return () => {

      supabase.removeChannel(
        notificationChannel
      );

      supabase.removeChannel(
        messageChannel
      );
    };
  }

  async function logout() {

    await supabase.auth.signOut();

    window.location.href =
      "/";
  }

  function closeMenu() {

    setMenuOpen(false);
  }

  return (

    <>

      <header
        className="
          sticky
          top-0
          z-50
          bg-white/85
          backdrop-blur-xl
          border-b
          border-gray-100
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            h-20
            flex
            items-center
            justify-between
          "
        >

          {/* LOGO */}

          <Link
            href="/"
            className="
              text-3xl
              md:text-4xl
              font-black
              tracking-tight
            "
          >

            FlexRent

          </Link>

          {/* DESKTOP NAV */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-8
              text-lg
              font-semibold
            "
          >

            <Link href="/">
              Home
            </Link>

            <Link href="/favorites">
              Favoriten
            </Link>

            <Link href="/map">
              Karte
            </Link>

            <Link href="/bookings">
              Buchungen
            </Link>

            <Link href="/host/bookings">
              Vermieter
            </Link>

          </nav>

          {/* RIGHT */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* CREATE */}

            <Link
              href="/create"
              className="
                hidden
                md:flex
                h-14
                px-6
                rounded-2xl
                bg-[#16d64d]
                text-white
                items-center
                justify-center
                gap-2
                font-bold
              "
            >

              <Plus size={18} />

              Erstellen

            </Link>

            {/* FAVORITES */}

            <Link
              href="/favorites"
              className="
                relative
                w-12
                h-12
                rounded-2xl
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >

              <Heart size={20} />

            </Link>

            {/* NOTIFICATIONS */}

            <Link
              href="/notifications"
              className="
                relative
                w-12
                h-12
                rounded-2xl
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >

              <Bell size={20} />

              {notifications > 0 && (

                <div
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[22px]
                    h-5
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-black
                    flex
                    items-center
                    justify-center
                    px-1
                  "
                >

                  {notifications > 99
                    ? "99+"
                    : notifications}

                </div>

              )}

            </Link>

            {/* MESSAGES */}

            <Link
              href="/messages"
              className="
                relative
                w-12
                h-12
                rounded-2xl
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >

              <Inbox size={20} />

              {messages > 0 && (

                <div
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[22px]
                    h-5
                    rounded-full
                    bg-[#16d64d]
                    text-white
                    text-[10px]
                    font-black
                    flex
                    items-center
                    justify-center
                    px-1
                  "
                >

                  {messages > 99
                    ? "99+"
                    : messages}

                </div>

              )}

            </Link>

            {/* PROFILE */}

            {user && (

              <div
                className="
                  hidden
                  md:flex
                  items-center
                  gap-3
                "
              >

                <Link
                  href="/profile"
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >

                  <User size={20} />

                </Link>

                <button
                  onClick={logout}
                  className="
                    h-12
                    px-5
                    rounded-2xl
                    bg-red-500
                    text-white
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <LogOut size={18} />

                  Logout

                </button>

              </div>

            )}

            {!user && (

              <Link
                href="/login"
                className="
                  hidden
                  md:flex
                  h-12
                  px-5
                  rounded-2xl
                  bg-black
                  text-white
                  items-center
                  justify-center
                  font-bold
                "
              >

                Login

              </Link>

            )}

            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
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

              {menuOpen ? (

                <X size={22} />

              ) : (

                <Menu size={22} />

              )}

            </button>

          </div>

        </div>

      </header>

    </>

  );
}