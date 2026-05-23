"use client";

import {
  FaShareAlt,
} from "react-icons/fa";

type Props = {
  listing: any;
};

export default function ShareButton({
  listing,
}: Props) {

  async function shareListing() {

    const url =
      `${window.location.origin}/listing/${listing.id}`;

    // MOBILE SHARE API

    if (
      navigator.share
    ) {

      try {

        await navigator.share({

          title:
            listing.title,

          text:
            listing.description,

          url,
        });

      } catch (error) {

        console.log(error);

      }

      return;
    }

    // FALLBACK COPY

    await navigator.clipboard.writeText(
      url
    );

    alert(
      "Link kopiert!"
    );
  }

  return (

    <button
      onClick={shareListing}
      className="w-full border border-black py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
    >

      <FaShareAlt />

      Teilen

    </button>

  );
}