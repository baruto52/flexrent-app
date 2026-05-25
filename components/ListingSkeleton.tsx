"use client";

export default function ListingSkeleton() {

  return (

    <div
      className="
        bg-white
        rounded-[36px]
        overflow-hidden
        shadow-sm
        animate-pulse
      "
    >

      {/* IMAGE */}

      <div
        className="
          w-full
          h-[300px]
          bg-gray-200
        "
      />

      {/* CONTENT */}

      <div className="p-7">

        {/* TOP */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <div
            className="
              h-8
              w-28
              rounded-full
              bg-gray-200
            "
          />

          <div
            className="
              h-6
              w-12
              rounded-xl
              bg-gray-200
            "
          />

        </div>

        {/* TITLE */}

        <div
          className="
            h-10
            w-[80%]
            rounded-2xl
            bg-gray-200
            mb-5
          "
        />

        {/* LOCATION */}

        <div
          className="
            h-5
            w-[55%]
            rounded-xl
            bg-gray-200
            mb-5
          "
        />

        {/* DESCRIPTION */}

        <div className="space-y-3">

          <div
            className="
              h-4
              w-full
              rounded-xl
              bg-gray-200
            "
          />

          <div
            className="
              h-4
              w-[90%]
              rounded-xl
              bg-gray-200
            "
          />

        </div>

        {/* PRICE */}

        <div
          className="
            h-12
            w-36
            rounded-2xl
            bg-gray-200
            mt-8
          "
        />

      </div>

    </div>

  );
}