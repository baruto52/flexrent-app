type Props = {
  own: boolean;
  message: string;
  createdAt: string;
};

export default function MessageBubble({
  own,
  message,
  createdAt,
}: Props) {

  return (

    <div
      className={`
        flex
        ${
          own
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      <div
        className={`
          max-w-[75%]
          px-5
          py-4
          rounded-[28px]
          shadow-sm
          ${
            own
              ? "bg-[#16d64d] text-white"
              : "bg-white text-black"
          }
        `}
      >

        <p className="text-lg leading-7">

          {message}

        </p>

        <div
          className={`
            mt-2
            text-xs
            ${
              own
                ? "text-white/70"
                : "text-gray-400"
            }
          `}
        >

          {new Date(
            createdAt
          ).toLocaleTimeString(
            "de-DE",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}

        </div>

      </div>

    </div>

  );
}