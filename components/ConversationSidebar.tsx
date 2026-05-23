"use client";

import Link from "next/link";

type Props = {
  conversations: any[];
  activeId?: string;
};

export default function ConversationSidebar({
  conversations,
  activeId,
}: Props) {

  return (

    <div
      className="
        w-full
        lg:w-[380px]
        bg-white
        border-r
        border-gray-100
        overflow-y-auto
      "
    >

      <div className="p-6">

        <h1
          className="
            text-4xl
            font-black
            mb-8
          "
        >
          Nachrichten
        </h1>

        <div className="space-y-4">

          {conversations.map(
            (chat) => (

              <Link
                key={chat.userId}
                href={`/messages/${chat.userId}`}
                className={`
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-[28px]
                  transition
                  ${
                    activeId ===
                    chat.userId

                      ? "bg-[#16d64d] text-white"

                      : "bg-[#f5f7fb] hover:bg-gray-100"
                  }
                `}
              >

                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    overflow-hidden
                    bg-gray-200
                    flex-shrink-0
                  "
                >

                  <img
                    src={
                      chat.profile
                        ?.avatar_url ||

                      "https://placehold.co/300x300/png"
                    }
                    alt="User"
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>

                <div className="flex-1 min-w-0">

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      mb-1
                    "
                  >

                    <h2
                      className="
                        font-black
                        text-lg
                        truncate
                      "
                    >

                      {
                        chat.profile
                          ?.full_name ||

                        "User"
                      }

                    </h2>

                    <span
                      className={`
                        text-xs
                        ${
                          activeId ===
                          chat.userId

                            ? "text-white/70"

                            : "text-gray-400"
                        }
                      `}
                    >

                      {new Date(
                        chat.createdAt
                      ).toLocaleDateString(
                        "de-DE"
                      )}

                    </span>

                  </div>

                  <p
                    className={`
                      truncate
                      text-sm
                      ${
                        activeId ===
                        chat.userId

                          ? "text-white/80"

                          : "text-gray-500"
                      }
                    `}
                  >

                    {
                      chat.latestMessage
                    }

                  </p>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

    </div>

  );
}