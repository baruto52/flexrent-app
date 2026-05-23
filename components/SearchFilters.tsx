"use client";

import {
  useEffect,
  useState,
} from "react";

import {

  useRouter,

  useSearchParams,

} from "next/navigation";

import {

  Search,

  MapPin,

  SlidersHorizontal,

} from "lucide-react";

export default function SearchFilters() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const [search, setSearch] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [rentalType, setRentalType] =
    useState("Alle");

  useEffect(() => {

    setSearch(

      searchParams.get("search") ||

      ""
    );

    setLocation(

      searchParams.get("location") ||

      ""
    );

    setRentalType(

      searchParams.get("rentalType") ||

      "Alle"
    );

  }, [searchParams]);

  function handleSearch() {

    const params =
      new URLSearchParams();

    if (search) {

      params.set(
        "search",
        search
      );
    }

    if (location) {

      params.set(
        "location",
        location
      );
    }

    if (
      rentalType !==
      "Alle"
    ) {

      params.set(
        "rentalType",
        rentalType
      );
    }

    router.push(

      `/?${params.toString()}`
    );
  }

  function handleKeyDown(
    e:
      React.KeyboardEvent<HTMLInputElement>
  ) {

    if (e.key === "Enter") {

      handleSearch();
    }
  }

  return (
    <section className="px-4 lg:px-8 -mt-14 relative z-30">

      <div className="max-w-7xl mx-auto">

        <div
          className="
            bg-white/95
            backdrop-blur-2xl
            rounded-[36px]
            border
            border-gray-100
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            p-5
            lg:p-6
          "
        >

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-4
              gap-4
            "
          >

            {/* SEARCH */}

            <div
              className="
                lg:col-span-2
                h-[74px]
                rounded-[24px]
                bg-gray-100
                px-6
                flex
                items-center
                gap-4
              "
            >

              <Search
                size={24}
                className="
                  text-gray-500
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Suche nach Werkzeugen, Fahrzeugen..."
                className="
                  bg-transparent
                  outline-none
                  w-full
                  text-gray-700
                  text-[16px]
                  font-medium
                "
              />

            </div>

            {/* LOCATION */}

            <div
              className="
                h-[74px]
                rounded-[24px]
                bg-gray-100
                px-6
                flex
                items-center
                gap-4
              "
            >

              <MapPin
                size={24}
                className="
                  text-gray-500
                "
              />

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Standort"
                className="
                  bg-transparent
                  outline-none
                  w-full
                  text-gray-700
                  text-[16px]
                  font-medium
                "
              />

            </div>

            {/* RENTAL TYPE */}

            <div
              className="
                h-[74px]
                rounded-[24px]
                bg-gray-100
                px-6
                flex
                items-center
                justify-between
              "
            >

              <select
                value={rentalType}
                onChange={(e) =>
                  setRentalType(
                    e.target.value
                  )
                }
                className="
                  bg-transparent
                  w-full
                  text-gray-700
                  font-medium
                  outline-none
                "
              >

                <option>
                  Alle
                </option>

                <option>
                  Stunde
                </option>

                <option>
                  Tag
                </option>

                <option>
                  Woche
                </option>

                <option>
                  Monat
                </option>

              </select>

              <SlidersHorizontal
                size={22}
                className="
                  text-gray-500
                "
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={
              handleSearch
            }
            className="
              mt-5
              w-full
              h-[74px]
              rounded-[24px]
              bg-[#00e01a]
              text-black
              font-black
              text-lg
              hover:scale-[1.01]
              transition-all
              duration-300
            "
          >
            Jetzt suchen
          </button>

        </div>

      </div>

    </section>
  );
}