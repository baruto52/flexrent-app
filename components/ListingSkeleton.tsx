"use client";

export default function ListingSkeleton() {

  return (

    <div className="bg-white rounded-3xl overflow-hidden border animate-pulse">

      {/* IMAGE */}

      <div className="w-full h-64 bg-gray-200" />

      {/* CONTENT */}

      <div className="p-5">

        {/* TITLE */}

        <div className="h-7 bg-gray-200 rounded-xl mb-4 w-3/4" />

        {/* LOCATION */}

        <div className="h-5 bg-gray-200 rounded-xl mb-5 w-1/2" />

        {/* USER */}

        <div className="flex items-center gap-3 mb-5">

          <div className="w-11 h-11 rounded-full bg-gray-200" />

          <div className="flex-1">

            <div className="h-4 bg-gray-200 rounded-xl mb-2 w-1/3" />

            <div className="h-3 bg-gray-200 rounded-xl w-1/4" />

          </div>

        </div>

        {/* PRICE */}

        <div className="h-8 bg-gray-200 rounded-xl w-1/3" />

      </div>

    </div>

  );
}