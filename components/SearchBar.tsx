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
  X,
} from "lucide-react";

interface Props {

  onSearch?: (
    search: string
  ) => void;
}

export default function SearchBar({

  onSearch,

}: Props) {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    setSearch(

      searchParams.get("search") ||

      ""
    );

  }, [searchParams]);

  useEffect(() => {

    const timeout =
      setTimeout(() => {

        if (onSearch) {

          onSearch(search);
        }

      }, 400);

    return () =>
      clearTimeout(timeout);

  }, [search]);

  function handleSearch() {

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (search.trim()) {

      params.set(
        "search",
        search
      );

    } else {

      params.delete(
        "search"
      );
    }

    router.push(
      `/?${params.toString()}`
    );
  }

  function clearSearch() {

    setSearch("");

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.delete(
      "search"
    );

    router.push(
      `/?${params.toString()}`
    );

    if (onSearch) {

      onSearch("");
    }
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
    <div
      className="
        bg-white
        rounded-[32px]
        shadow-sm
        p-4
        flex
        items-center
        gap-4
      "
    >

      {/* ICON */}

      <button
        onClick={
          handleSearch
        }
        className="
          w-14
          h-14
          rounded-2xl
          bg-[#16d64d]
          text-white
          flex
          items-center
          justify-center
          flex-shrink-0
          hover:scale-105
          transition
        "
      >

        <Search
          size={24}
        />

      </button>

      {/* INPUT */}

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
        placeholder="Suche nach Listings, Standort, Kategorien..."
        className="
          flex-1
          h-14
          text-lg
          outline-none
          bg-transparent
        "
      />

      {/* CLEAR */}

      {search && (

        <button
          onClick={
            clearSearch
          }
          className="
            w-12
            h-12
            rounded-xl
            bg-gray-100
            flex
            items-center
            justify-center
            hover:bg-gray-200
            transition
          "
        >

          <X
            size={20}
          />

        </button>

      )}

    </div>
  );
}