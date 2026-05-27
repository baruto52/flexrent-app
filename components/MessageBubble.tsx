"use client";

import Image from "next/image";

import {
  CheckCheck,
  Download,
} from "lucide-react";

type Props = {

  own: boolean;

  message?: string;

  image_url?: string;

  createdAt: string;

  seen?: boolean;
};

export default function MessageBubble({

  own,

  message,

  image_url,

  createdAt,

  seen,

}: Props) {

  const hasImage =
    !!image_url;

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
          md:max-w-[520px]

          shadow-sm

          transition-all
          duration-300

          hover:scale-[1.01]

          overflow-hidden

          ${
            own

              ? "bg-[#16d64d] text-white"

              : "bg-white text-black border border-gray-100"
          }

          ${
            hasImage

              ? "rounded-[34px] p-2"

              : `
                rounded-[30px]
                px-5
                py-4
              `
          }
        `}
      >

        {/* IMAGE */}

        {hasImage && (

          <div className="relative">

            <Image
              src={image_url}
              alt="Chat Bild"
              width={800}
              height={800}
              loading="lazy"
              quality={75}
              className="
                rounded-[28px]
                object-cover
                w-full
                max-h-[520px]
              "
            />

            {/* DOWNLOAD */}

            <a
              href={image_url}
              target="_blank"
              className="
                absolute
                top-4
                right-4
                w-12
                h-12
                rounded-full
                bg-black/60
                backdrop-blur-xl
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Download size={20} />

            </a>

          </div>

        )}

        {/* MESSAGE */}

        {message && (

          <p
            className={`
              text-[16px]
              md:text-[17px]
              leading-7
              break-words
              whitespace-pre-wrap

              ${
                hasImage

                  ? "mt-4 px-2 pb-2"

                  : ""
              }
            `}
          >

            {message}

          </p>

        )}

        {/* FOOTER */}

        <div
          className={`

            flex
            items-center
            justify-end
            gap-2

            text-[11px]

            ${
              hasImage

                ? "px-2 pb-2 mt-3"

                : "mt-3"
            }

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

        {/* TAIL */}

        {!hasImage && (

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

        )}

      </div>

    </div>

  );
}