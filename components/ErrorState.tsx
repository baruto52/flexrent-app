"use client";

type Props = {

  title?: string;

  description?: string;

  onRetry?: () => void;
};

export default function ErrorState({

  title = "Etwas ist schiefgelaufen",

  description =
    "Bitte versuche es erneut.",

  onRetry,
}: Props) {

  return (

    <div className="flex flex-col items-center justify-center py-24 text-center">

      {/* ICON */}

      <div className="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center mb-8 text-5xl">

        ⚠️

      </div>

      {/* TITLE */}

      <h2 className="text-4xl font-bold mb-4 text-red-500">

        {title}

      </h2>

      {/* DESCRIPTION */}

      <p className="text-gray-500 text-lg max-w-lg leading-8 mb-8">

        {description}

      </p>

      {/* BUTTON */}

      {onRetry && (

        <button
          onClick={onRetry}
          className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-lg"
        >

          Erneut versuchen

        </button>

      )}

    </div>

  );
}