"use client";

interface Props {

  search: string;

  setSearch: (
    value: string
  ) => void;

  maxPrice: string;

  setMaxPrice: (
    value: string
  ) => void;

  category: string;

  setCategory: (
    value: string
  ) => void;
}

const categories = [

  "Alle",

  "Werkzeuge",

  "Fahrzeuge",

  "Immobilien",

  "Elektronik",

  "Sport",

  "Business",

  "Bikes",

  "Lager",
];

export default function FiltersBar({

  search,

  setSearch,

  maxPrice,

  setMaxPrice,

  category,

  setCategory,

}: Props) {

  return (
    <div
      className="
        bg-white
        rounded-[36px]
        shadow-sm
        p-6
        mb-10
      "
    >

      <div
        className="
          grid
          lg:grid-cols-3
          gap-6
        "
      >

        {/* SEARCH */}

        <div>

          <p
            className="
              font-black
              mb-3
            "
          >
            Suche
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Listings suchen..."
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              px-5
              outline-none
            "
          />

        </div>

        {/* CATEGORY */}

        <div>

          <p
            className="
              font-black
              mb-3
            "
          >
            Kategorie
          </p>

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              px-5
              outline-none
              bg-white
            "
          >

            {categories.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>

        {/* PRICE */}

        <div>

          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >

            <p className="font-black">
              Max Preis
            </p>

            <p className="text-gray-500">
              €
              {
                maxPrice || "5000"
              }
            </p>

          </div>

          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                e.target.value
              )
            }
            className="
              w-full
              accent-[#16d64d]
            "
          />

        </div>

      </div>

    </div>
  );
}