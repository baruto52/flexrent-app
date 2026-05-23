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

    /* NOTIFICATIONS */

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
      }

    );

    notificationChannel.subscribe();

    /* MESSAGES */

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

  function navLink(
    href: string
  ) {

    return pathname === href

      ? "text-black font-black"

      : "text-gray-500 hover:text-black transition";
  }

  function closeMenu() {

    setMenuOpen(false);
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-white/80
        backdrop-blur-xl
        border-b
        border-gray-100
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          h-24
          flex
          items-center
          justify-between
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            items-center
            gap-12
          "
        >

          <Link
            href="/"
            className="
              text-4xl
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

            <Link
              href="/"
              className={navLink("/")}
            >
              Home
            </Link>

            <Link
              href="/favorites"
              className={navLink("/favorites")}
            >
              Favoriten
            </Link>

            <Link
              href="/bookings"
              className={navLink("/bookings")}
            >
              Buchungen
            </Link>

            <Link
              href="/dashboard"
              className={navLink("/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              href="/notifications"
              className={navLink("/notifications")}
            >
              Notifications
            </Link>

          </nav>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            items-center
            gap-4
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
              hover:scale-[1.03]
              transition
              text-white
              items-center
              justify-center
              gap-3
              font-bold
              shadow-lg
            "
          >

            <Plus
              size={20}
            />

            Erstellen

          </Link>

          {/* FAVORITES */}

          <Link
            href="/favorites"
            className="
              relative
              w-14
              h-14
              rounded-2xl
              bg-gray-100
              hover:bg-gray-200
              transition
              flex
              items-center
              justify-center
            "
          >

            <Heart
              size={22}
            />

          </Link>

          {/* NOTIFICATIONS */}

          <Link
            href="/notifications"
            className="
              relative
              w-14
              h-14
              rounded-2xl
              bg-gray-100
              hover:bg-gray-200
              transition
              flex
              items-center
              justify-center
            "
          >

            <Bell
              size={22}
            />

            {notifications > 0 && (

              <div
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[24px]
                  h-6
                  rounded-full
                  bg-red-500
                  text-white
                  text-xs
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
              w-14
              h-14
              rounded-2xl
              bg-gray-100
              hover:bg-gray-200
              transition
              flex
              items-center
              justify-center
            "
          >

            <Inbox
              size={22}
            />

            {messages > 0 && (

              <div
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[24px]
                  h-6
                  rounded-full
                  bg-[#16d64d]
                  text-white
                  text-xs
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

            <Link
              href="/profile"
              className="
                w-14
                h-14
                rounded-2xl
                bg-black
                hover:scale-105
                transition
                text-white
                flex
                items-center
                justify-center
              "
            >

              <User
                size={22}
              />

            </Link>

          )}

          {/* LOGIN */}

          {!user && (

            <Link
              href="/login"
              className="
                h-14
                px-6
                rounded-2xl
                bg-black
                hover:scale-[1.03]
                transition
                text-white
                flex
                items-center
                justify-center
                font-bold
              "
            >
              Login
            </Link>

          )}

          {/* LOGOUT */}

          {user && (

            <button
              onClick={logout}
              className="
                hidden
                md:flex
                w-14
                h-14
                rounded-2xl
                bg-red-500
                hover:bg-red-600
                transition
                text-white
                items-center
                justify-center
              "
            >

              <LogOut
                size={22}
              />

            </button>

          )}

          {/* MOBILE BUTTON */}

          <button
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
            className="
              lg:hidden
              w-14
              h-14
              rounded-2xl
              bg-gray-100
              hover:bg-gray-200
              transition
              flex
              items-center
              justify-center
            "
          >

            {menuOpen ? (

              <X
                size={24}
              />

            ) : (

              <Menu
                size={24}
              />

            )}

          </button>

        </div>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div
          className="
            lg:hidden
            border-t
            border-gray-100
            bg-white
            px-4
            py-6
            animate-in
            slide-in-from-top-2
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              text-lg
            "
          >

            <Link
              href="/"
              onClick={closeMenu}
              className="font-bold"
            >
              Home
            </Link>

            <Link
              href="/favorites"
              onClick={closeMenu}
              className="font-bold"
            >
              Favoriten
            </Link>

            <Link
              href="/bookings"
              onClick={closeMenu}
              className="font-bold"
            >
              Buchungen
            </Link>

            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="font-bold"
            >
              Dashboard
            </Link>

            <Link
              href="/messages"
              onClick={closeMenu}
              className="font-bold"
            >
              Nachrichten
            </Link>

            <Link
              href="/notifications"
              onClick={closeMenu}
              className="font-bold"
            >
              Notifications
            </Link>

            {user && (

              <Link
                href="/profile"
                onClick={closeMenu}
                className="font-bold"
              >
                Profil
              </Link>

            )}

            {user && (

              <button
                onClick={logout}
                className="
                  h-14
                  rounded-2xl
                  bg-red-500
                  text-white
                  font-bold
                "
              >
                Logout
              </button>

            )}

          </div>

        </div>

      )}

    </header>
  );
}