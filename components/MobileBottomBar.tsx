"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {

  House,

  Search,

  Plus,

  Inbox,

  User,

} from "lucide-react";

interface Props {

  hidden?: boolean;
}

export default function MobileBottomBar({

  hidden = false,

}: Props) {

  const pathname =
    usePathname();

  /*
    HIDE BAR
  */

  if (hidden) {

    return null;
  }

  const items = [

    {
      href: "/",
      label: "Home",
      icon: House,
    },

    {
      href: "/map",
      label: "Explore",
      icon: Search,
    },

    {
      href: "/create",
      label: "Create",
      icon: Plus,
    },

    {
      href: "/messages",
      label: "Chats",
      icon: Inbox,
    },

    {
      href: "/dashboard",
      label: "Profil",
      icon: User,
    },
  ];

  return (

    <div
      className="
        fixed
        bottom-5
        left-1/2
        -translate-x-1/2
        z-40
        lg:hidden
        w-[95%]
        max-w-[430px]
      "
    >

      <div
        className="
          bg-white/82
          backdrop-blur-2xl
          border
          border-white/30
          shadow-[0_20px_60px_rgba(0,0,0,0.18)]
          rounded-[38px]
          px-3
          py-3
          flex
          items-center
          justify-between
        "
      >

        {items.map(
          (item) => {

            const active =

              pathname ===
              item.href;

            const Icon =
              item.icon;

            return (

              <Link
                key={item.href}
                href={item.href}
                className="
                  flex
                  flex-col
                  items-center
                  gap-2
                  flex-1
                "
              >

                <div
                  className={`
                    w-16
                    h-16
                    rounded-[22px]
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300

                    ${
                      active

                        ? `
                          bg-[#00e01a]
                          text-white
                          shadow-lg
                          scale-110
                        `

                        : `
                          text-gray-500
                        `
                    }
                  `}
                >

                  <Icon
                    size={28}
                  />

                </div>

                <span
                  className={`
                    text-[12px]
                    font-black
                    transition-all

                    ${
                      active

                        ? "text-[#00e01a]"

                        : "text-gray-500"
                    }
                  `}
                >

                  {item.label}

                </span>

              </Link>

            );
          }
        )}

      </div>

    </div>

  );
}