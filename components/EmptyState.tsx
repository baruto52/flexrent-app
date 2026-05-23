"use client";

type Props = {

  title: string;

  description: string;

  buttonText?: string;

  onClick?: () => void;
};

export default function EmptyState({

  title,

  description,

  buttonText,

  onClick,
}: Props) {

  return (

    <div className="flex flex-col items-center justify-center py-24 text-center">

      {/* ICON */}

      <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-8 text-5xl">

        📦

      </div>

      {/* TITLE */}

      <h2 className="text-4xl font-bold mb-4">

        {title}

      </h2>

      {/* DESCRIPTION */}

      <p className="text-gray-500 text-lg max-w-lg leading-8 mb-8">

        {description}

      </p>

      {/* BUTTON */}

      {buttonText && onClick && (

        <button
          onClick={onClick}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
        >

          {buttonText}

        </button>

      )}

    </div>

  );
}