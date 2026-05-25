"use client";

import {
  CheckCheck,
} from "lucide-react";

type Props = {

  own: boolean;

  message: string;

  createdAt: string;

  seen?: boolean;
};

export default function MessageBubble({

  own,

  message,

  createdAt,

  seen,

}: Props) {

  return (

    <div
      className={`
        flex
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300
        ${
          own
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      <div
        className={`
          relative
          max-w-[85%]
          md:max-w-[500px]
          px-5
          py-4
          rounded-[30px]
          shadow-sm
          backdrop-blur-sm
          transition-all
          duration-300
          hover:scale-[1.01]
          ${
            own

              ? `
                bg-[#16d64d]
                text-white
                rounded-br-[10px]
              `

              : `
                bg-white
                text-black
                rounded-bl-[10px]
                border
                border-gray-100
              `
          }
        `}
      >

        {/* MESSAGE */}

        <p
          className="
            text-[16px]
            md:text-[17px]
            leading-7
            break-words
            whitespace-pre-wrap
          "
        >

          {message}

        </p>

        {/* FOOTER */}

        <div
          className={`
            flex
            items-center
            justify-end
            gap-2
            mt-3
            text-[11px]
            ${
              own
                ? "text-green-100"
                : "text-gray-400"
            }
          `}
        >

          {/* TIME */}

          <span>

            {new Date(
              createdAt
            ).toLocaleTimeString(
              "de-DE",
              {

                hour:
                  "2-digit",

                minute:
                  "2-digit",
              }
            )}

          </span>

          {/* SEEN */}

          {own && (

            <CheckCheck
              size={14}
              className={`
                ${
                  seen
                    ? "text-blue-200"
                    : "text-green-100"
                }
              `}
            />

          )}

        </div>

        {/* CHAT TAIL */}

        <div
          className={`
            absolute
            bottom-0
            w-5
            h-5
            ${
              own

                ? `
                  right-[-6px]
                  bg-[#16d64d]
                  rounded-bl-[20px]
                `

                : `
                  left-[-6px]
                  bg-white
                  rounded-br-[20px]
                  border-b
                  border-l
                  border-gray-100
                `
            }
          `}
        />

      </div>

    </div>

  );
}