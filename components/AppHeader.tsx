"use client";

import {
  useRouter,
} from "next/navigation";

import {

  ArrowLeft,

  X,

} from "lucide-react";

type Props = {

  title?: string;

  showClose?: boolean;
};

export default function AppHeader({

  title,

  showClose = false,

}: Props) {

  const router =
    useRouter();

  return (

    <header
      className="
        sticky
        top-0
        z-50
        bg-white/90
        backdrop-blur-xl
        border-b
        border-gray-100
        h-16
        flex
        items-center
        justify-between
        px-4
      "
    >

      {/* LEFT */}

      <button
        onClick={() =>
          router.back()
        }
        className="
          w-11
          h-11
          rounded-2xl
          bg-gray-100
          flex
          items-center
          justify-center
        "
      >

        <ArrowLeft
          size={22}
        />

      </button>

      {/* TITLE */}

      <h1
        className="
          absolute
          left-1/2
          -translate-x-1/2
          font-black
          text-lg
        "
      >

        {title}

      </h1>

      {/* RIGHT */}

      {showClose ? (

        <button
          onClick={() =>
            router.back()
          }
          className="
            w-11
            h-11
            rounded-2xl
            bg-gray-100
            flex
            items-center
            justify-center
          "
        >

          <X size={22} />

        </button>

      ) : (

        <div className="w-11" />

      )}

    </header>
  );
}