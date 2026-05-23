"use client";

import {
  Star,
} from "lucide-react";

interface Props {

  rating: number;

  size?: number;
}

export default function RatingStars({

  rating,

  size = 22,

}: Props) {

  return (

    <div
      className="
        flex
        items-center
        gap-1
      "
    >

      {[1, 2, 3, 4, 5].map(
        (star) => (

          <Star
            key={star}
            size={size}
            className={`
              ${
                star <= rating

                  ? "fill-yellow-400 text-yellow-400"

                  : "text-gray-300"
              }
            `}
          />

        )
      )}

    </div>

  );
}