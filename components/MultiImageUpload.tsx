"use client";

import {
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Props = {

  images: string[];

  setImages: (
    urls: string[]
  ) => void;
};

export default function MultiImageUpload({

  images,

  setImages,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  async function uploadImages(
    e: any
  ) {

    const files =
      e.target.files;

    if (!files)
      return;

    setLoading(true);

    const uploadedUrls: string[] =
      [];

    for (
      let i = 0;
      i < files.length;
      i++
    ) {

      const file =
        files[i];

      const fileName =
        `${Date.now()}-${file.name}`;

      const {
        error,
      } = await supabase
        .storage
        .from(
          "listing-images"
        )
        .upload(
          fileName,
          file
        );

      if (!error) {

        const { data } =
          supabase
            .storage
            .from(
              "listing-images"
            )
            .getPublicUrl(
              fileName
            );

        uploadedUrls.push(
          data.publicUrl
        );
      }
    }

    setImages([
      ...images,
      ...uploadedUrls,
    ]);

    setLoading(false);
  }

  function removeImage(
    url: string
  ) {

    setImages(

      images.filter(
        (img) =>
          img !== url
      )
    );
  }

  return (

    <div>

      {/* UPLOAD */}

      <label className="block mb-3 font-semibold">

        Bilder hochladen

      </label>

      <input
        type="file"
        multiple
        onChange={uploadImages}
        className="w-full border rounded-2xl px-4 py-3 mb-5"
      />

      {/* LOADING */}

      {loading && (

        <div className="mb-4 text-green-600 font-semibold">

          Bilder werden hochgeladen...

        </div>

      )}

      {/* IMAGES */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {images.map(
          (image) => (

          <div
            key={image}
            className="relative"
          >

            <img
              src={image}
              className="w-full h-32 object-cover rounded-2xl"
            />

            <button
              onClick={() =>
                removeImage(
                  image
                )
              }
              className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full"
            >

              ×

            </button>

          </div>

        ))}

      </div>

    </div>

  );
}