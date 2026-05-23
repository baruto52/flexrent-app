"use client";

import Link from "next/link";

import {
  House,
  Search,
  Plus,
  LayoutGrid,
  User,
} from "lucide-react";

export default function MobileBottomBar() {

  return (
    <div
      className="
        fixed
        bottom-5
        left-1/2
        -translate-x-1/2
        z-50
        lg:hidden
        w-[95%]
        max-w-[430px]
      "
    >

      <div
        className="
          bg-white/90
          backdrop-blur-2xl
          border
          border-gray-100
          shadow-[0_20px_50px_rgba(0,0,0,0.12)]
          rounded-[32px]
          px-5
          py-4
          flex
          items-center
          justify-between
        "
      >

        {/* HOME */}

        <Link
          href="/"
          className="
            flex
            flex-col
            items-center
            gap-1
            text-[#00e01a]
          "
        >

          <div
            className="
              w-13
              h-13
              rounded-[18px]
              bg-[#00e01a]/10
              flex
              items-center
              justify-center
              p-3
            "
          >

            <House size={24} />

          </div>

          <span className="text-xs font-bold">
            Home
          </span>

        </Link>

        {/* EXPLORE */}

        <Link
          href="/explore"
          className="
            flex
            flex-col
            items-center
            gap-1
            text-gray-500
          "
        >

          <div
            className="
              w-13
              h-13
              rounded-[18px]
              flex
              items-center
              justify-center
              p-3
            "
          >

            <Search size={24} />

          </div>

          <span className="text-xs font-bold">
            Entdecken
          </span>

        </Link>

        {/* CREATE */}

        <Link
          href="/create"
          className="
            flex
            flex-col
            items-center
            gap-1
            text-gray-500
          "
        >

          <div
            className="
              w-13
              h-13
              rounded-[18px]
              flex
              items-center
              justify-center
              p-3
            "
          >

            <Plus size={24} />

          </div>

          <span className="text-xs font-bold">
            Erstellen
          </span>

        </Link>

        {/* CATEGORIES */}

        <Link
          href="/categories"
          className="
            flex
            flex-col
            items-center
            gap-1
            text-gray-500
          "
        >

          <div
            className="
              w-13
              h-13
              rounded-[18px]
              flex
              items-center
              justify-center
              p-3
            "
          >

            <LayoutGrid size={24} />

          </div>

          <span className="text-xs font-bold">
            Kategorien
          </span>

        </Link>

        {/* PROFILE */}

        <Link
          href="/profile"
          className="
            flex
            flex-col
            items-center
            gap-1
            text-gray-500
          "
        >

          <div
            className="
              w-13
              h-13
              rounded-[18px]
              flex
              items-center
              justify-center
              p-3
            "
          >

            <User size={24} />

          </div>

          <span className="text-xs font-bold">
            Profil
          </span>

        </Link>

      </div>

    </div>
  );
}