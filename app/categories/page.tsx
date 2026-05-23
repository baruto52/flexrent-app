"use client";

import Link from "next/link";

import {
  Wrench,
  Car,
  Warehouse,
  Bike,
  Laptop,
  Home,
  Dumbbell,
  Briefcase,
} from "lucide-react";

const categories = [
  {
    title: "Werkzeuge",
    icon: Wrench,
  },

  {
    title: "Fahrzeuge",
    icon: Car,
  },

  {
    title: "Lager",
    icon: Warehouse,
  },

  {
    title: "Bikes",
    icon: Bike,
  },

  {
    title: "Elektronik",
    icon: Laptop,
  },

  {
    title: "Immobilien",
    icon: Home,
  },

  {
    title: "Sport",
    icon: Dumbbell,
  },

  {
    title: "Business",
    icon: Briefcase,
  },
];

export default function CategoriesPage() {

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <h1
          className="
            text-6xl
            font-black
            mb-4
          "
        >
          Kategorien
        </h1>

        <p className="text-gray-500 text-xl mb-14">
          Entdecke alle verfügbaren Kategorien.
        </p>

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-8
          "
        >

          {categories.map((item, index) => {

            const Icon = item.icon;

            return (

              <Link
                key={index}
                href="/explore"
                className="
                  bg-white
                  rounded-[34px]
                  border
                  border-gray-100
                  shadow-sm
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  h-[220px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-6
                "
              >

                <div
                  className="
                    w-20
                    h-20
                    rounded-[26px]
                    bg-[#12d64f]/10
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Icon
                    size={38}
                    className="text-[#12d64f]"
                  />

                </div>

                <span
                  className="
                    text-2xl
                    font-black
                    text-gray-800
                  "
                >
                  {item.title}
                </span>

              </Link>

            );
          })}

        </div>

      </div>

    </div>
  );
}