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

    init();

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

    loadNotifications(
      session.user.id
    );

    loadMessages(
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

      {/* TOP NAVBAR */}

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
            h-20
            md:h-24
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

            <Link href="/bookings">
              Buchungen
            </Link>

            <Link href="/host/bookings">
              Vermieter
            </Link>

            <Link href="/messages">
              Nachrichten
            </Link>

          </nav>

          {/* RIGHT */}

          <div
            className="
              flex
              items-center
              gap-2
              md:gap-4
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

            {/* ICONS */}

            <Link
              href="/favorites"
              className="
                relative
                w-12
                h-12
                md:w-14
                md:h-14
                rounded-2xl
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >

              <Heart size={20} />

            </Link>

            <Link
              href="/notifications"
              className="
                relative
                w-12
                h-12
                md:w-14
                md:h-14
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

                  {notifications}

                </div>

              )}

            </Link>

            <Link
              href="/messages"
              className="
                relative
                w-12
                h-12
                md:w-14
                md:h-14
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

                  {messages}

                </div>

              )}

            </Link>

            {/* PROFILE */}

            {user && (

              <Link
                href="/profile"
                className="
                  hidden
                  md:flex
                  w-14
                  h-14
                  rounded-2xl
                  bg-black
                  text-white
                  items-center
                  justify-center
                "
              >

                <User size={20} />

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

        {/* MOBILE MENU */}

        {menuOpen && (

          <div
            className="
              lg:hidden
              bg-white
              border-t
              border-gray-100
              px-4
              py-6
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
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
                href="/host/bookings"
                onClick={closeMenu}
                className="font-bold"
              >

                Vermieter Dashboard

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

              <Link
                href="/profile"
                onClick={closeMenu}
                className="font-bold"
              >

                Profil

              </Link>

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

            </div>

          </div>

        )}

      </header>

      {/* MOBILE BOTTOM NAV */}

      <div
        className="
          md:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-50
          bg-white
          border-t
          border-gray-200
          h-20
          flex
          items-center
          justify-around
          px-2
        "
      >

        <Link
          href="/"
          className="flex flex-col items-center text-xs"
        >

          🏠
          <span>
            Home
          </span>

        </Link>

        <Link
          href="/favorites"
          className="flex flex-col items-center text-xs"
        >

          ❤️
          <span>
            Favoriten
          </span>

        </Link>

        <Link
          href="/create"
          className="
            -mt-10
            w-16
            h-16
            rounded-full
            bg-[#16d64d]
            text-white
            flex
            items-center
            justify-center
            text-3xl
            shadow-xl
          "
        >

          +

        </Link>

        <Link
          href="/messages"
          className="flex flex-col items-center text-xs"
        >

          💬
          <span>
            Nachrichten
          </span>

        </Link>

        <Link
          href="/profile"
          className="flex flex-col items-center text-xs"
        >

          👤
          <span>
            Profil
          </span>

        </Link>

      </div>

    </>

  );
}