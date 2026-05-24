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

  LayoutDashboard,

  Map,

  CalendarDays,

  ShieldCheck,

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
        )
        .eq(
          "is_read",
          false
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

  const navLinks = [

    {
      href: "/",
      label: "Home",
    },

    {
      href: "/map",
      label: "Karte",
    },

    {
      href: "/bookings",
      label: "Buchungen",
    },

    {
      href: "/dashboard",
      label: "Dashboard",
    },
  ];

  return (

    <>

      <header
        className="
          sticky
          top-0
          z-50
          bg-white/85
          backdrop-blur-2xl
          border-b
          border-gray-100
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            md:px-6
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
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
                font-black
                text-xl
                shadow-lg
              "
            >

              F

            </div>

            <div>

              <h1
                className="
                  text-2xl
                  md:text-3xl
                  font-black
                  leading-none
                "
              >

                FlexRent

              </h1>

              <p
                className="
                  text-[10px]
                  text-gray-400
                  font-bold
                "
              >

                PREMIUM MARKETPLACE

              </p>

            </div>

          </Link>

          {/* DESKTOP NAV */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-3
            "
          >

            {navLinks.map(
              (link) => {

                const active =
                  pathname ===
                  link.href;

                return (

                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      px-6
                      h-12
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      font-bold
                      transition-all
                      ${
                        active

                          ? "bg-[#16d64d] text-white shadow-lg"

                          : "hover:bg-gray-100"
                      }
                    `}
                  >

                    {link.label}

                  </Link>

                );
              }
            )}

          </nav>

          {/* RIGHT */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* CREATE */}

            <Link
              href="/create"
              className="
                hidden
                md:flex
                h-12
                px-5
                rounded-2xl
                bg-[#16d64d]
                text-white
                items-center
                justify-center
                gap-2
                font-black
                shadow-lg
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
                    min-w-[24px]
                    h-6
                    rounded-full
                    bg-red-500
                    text-white
                    text-[11px]
                    font-black
                    flex
                    items-center
                    justify-center
                    px-1
                    shadow-lg
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
                    min-w-[24px]
                    h-6
                    rounded-full
                    bg-[#16d64d]
                    text-white
                    text-[11px]
                    font-black
                    flex
                    items-center
                    justify-center
                    px-1
                    shadow-lg
                  "
                >

                  {messages > 99
                    ? "99+"
                    : messages}

                </div>

              )}

            </Link>

            {/* USER */}

            {user && (

              <div
                className="
                  hidden
                  md:flex
                  items-center
                  gap-2
                  ml-2
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
                    font-black
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
                  font-black
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

      {/* MOBILE MENU */}

      {menuOpen && (

        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-sm
            lg:hidden
          "
          onClick={closeMenu}
        >

          <div
            className="
              absolute
              top-0
              right-0
              w-[320px]
              h-full
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-10
              "
            >

              <h2
                className="
                  text-3xl
                  font-black
                "
              >

                Menü

              </h2>

              <button
                onClick={closeMenu}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                "
              >

                <X size={22} />

              </button>

            </div>

            <div className="space-y-3">

              <MobileLink
                href="/"
                icon={<Map size={20} />}
                label="Home"
                onClick={closeMenu}
              />

              <MobileLink
                href="/map"
                icon={<Map size={20} />}
                label="Karte"
                onClick={closeMenu}
              />

              <MobileLink
                href="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                onClick={closeMenu}
              />

              <MobileLink
                href="/bookings"
                icon={<CalendarDays size={20} />}
                label="Buchungen"
                onClick={closeMenu}
              />

              <MobileLink
                href="/messages"
                icon={<Inbox size={20} />}
                label="Nachrichten"
                onClick={closeMenu}
              />

              <MobileLink
                href="/notifications"
                icon={<Bell size={20} />}
                label="Benachrichtigungen"
                onClick={closeMenu}
              />

              <MobileLink
                href="/favorites"
                icon={<Heart size={20} />}
                label="Favoriten"
                onClick={closeMenu}
              />

              <MobileLink
                href="/profile"
                icon={<User size={20} />}
                label="Profil"
                onClick={closeMenu}
              />

            </div>

            {user && (

              <button
                onClick={logout}
                className="
                  absolute
                  bottom-6
                  left-6
                  right-6
                  h-14
                  rounded-2xl
                  bg-red-500
                  text-white
                  font-black
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >

                <LogOut size={20} />

                Logout

              </button>

            )}

          </div>

        </div>

      )}

    </>

  );
}

function MobileLink({

  href,

  icon,

  label,

  onClick,

}: any) {

  return (

    <Link
      href={href}
      onClick={onClick}
      className="
        h-16
        rounded-2xl
        bg-[#f5f7fb]
        px-5
        flex
        items-center
        gap-4
        font-black
        text-lg
      "
    >

      <div
        className="
          w-11
          h-11
          rounded-xl
          bg-white
          flex
          items-center
          justify-center
        "
      >

        {icon}

      </div>

      {label}

    </Link>

  );
}