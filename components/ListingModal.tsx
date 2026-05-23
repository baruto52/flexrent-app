"use client";

import {

  FaMapMarkerAlt,

  FaStar,

  FaHeart,

  FaComments,

  FaCalendarCheck,

  FaTimes,

} from "react-icons/fa";

type Props = {

  listing: any;

  onClose: () => void;

  onChat: () => void;

  onBook: () => void;

  onReviews: () => void;
};

export default function ListingModal({

  listing,

  onClose,

  onChat,

  onBook,

  onReviews,
}: Props) {

  return (

    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md overflow-y-auto">

      <div className="min-h-screen flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-6xl rounded-[40px] overflow-hidden shadow-2xl">

          {/* IMAGE */}

          <div className="relative h-[500px] overflow-hidden">

            <img
              src={
                listing.images?.[0] ||
                listing.image ||
                "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
              }
              className="w-full h-full object-cover"
            />

            {/* CLOSE */}

            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center text-2xl shadow-xl"
            >

              <FaTimes />

            </button>

            {/* PRICE */}

            <div className="absolute bottom-8 left-8 bg-white rounded-[28px] px-8 py-5 shadow-2xl">

              <div className="flex items-end gap-3">

                <h2 className="text-5xl font-black text-green-600">

                  € {listing.price}

                </h2>

                <span className="text-gray-500 text-xl mb-2">

                  / Tag

                </span>

              </div>

            </div>

          </div>

          {/* CONTENT */}

          <div className="p-10">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-10">

              {/* LEFT */}

              <div className="flex-1">

                <h1 className="text-6xl font-black mb-6">

                  {listing.title}

                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xl mb-8">

                  <div className="flex items-center gap-3">

                    <FaMapMarkerAlt />

                    <span>

                      {listing.location ||
                        "Deutschland"}

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <FaStar className="text-yellow-400" />

                    <span>

                      4.9 Bewertung

                    </span>

                  </div>

                </div>

                <p className="text-gray-600 text-2xl leading-10">

                  {listing.description ||
                    "Keine Beschreibung vorhanden."}

                </p>

              </div>

              {/* RIGHT */}

              <div className="w-full lg:w-[350px] bg-gray-50 rounded-[35px] p-8">

                <div className="flex items-center gap-5 mb-8">

                  <img
                    src="https://i.pravatar.cc/150"
                    className="w-20 h-20 rounded-full"
                  />

                  <div>

                    <h3 className="text-2xl font-black">

                      Benutzer

                    </h3>

                    <p className="text-gray-500">

                      Vermieter

                    </p>

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="space-y-4">

                  <button
                    onClick={onBook}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
                  >

                    <FaCalendarCheck />

                    Jetzt buchen

                  </button>

                  <button
                    onClick={onChat}
                    className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
                  >

                    <FaComments />

                    Nachricht senden

                  </button>

                  <button
                    onClick={onReviews}
                    className="w-full bg-white border-2 border-gray-200 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
                  >

                    <FaStar />

                    Bewertungen

                  </button>

                  <button
                    className="w-full bg-white border-2 border-gray-200 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
                  >

                    <FaHeart />

                    Favorisieren

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}