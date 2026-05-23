"use client";

type Props = {

  listings: any[];

  onSelect: (
    listing: any
  ) => void;
};

export default function MapView({

  listings,

  onSelect,
}: Props) {

  return (

    <div className="bg-white rounded-3xl border p-10 min-h-[500px] flex items-center justify-center">

      <div className="w-full">

        <div className="text-center mb-10">

          <h2 className="text-4xl font-black mb-4">

            Kartenansicht

          </h2>

          <p className="text-gray-500">

            Nearby Listings & Google Maps Integration

          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {listings.map(
            (listing) => (

            <button
              key={listing.id}
              onClick={() =>
                onSelect(
                  listing
                )
              }
              className="border rounded-2xl p-5 hover:bg-gray-50 text-left transition"
            >

              <h3 className="font-bold text-lg mb-2">

                {listing.title}

              </h3>

              <p className="text-gray-500 mb-2">

                {listing.location}

              </p>

              <p className="font-bold text-green-600">

                € {listing.price}

              </p>

            </button>

          ))}

        </div>

      </div>

    </div>

  );
}